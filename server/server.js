const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const Storage = require('node-storage');
const store = new Storage('./data/db.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const validator = require('validator');
const jwt = require('jsonwebtoken');


mongoose.connect('mongodb+srv://dkorkut:danielwestern@cluster0.xxodj.mongodb.net/WHATTHEPUCK', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
      console.log('DB Connected');
  })
  .catch((e) => {
      console.log('DB not Connected', e);
  })

app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

const User = mongoose.model('User', {
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  username: {type: String, required: true},
  role: {
    type: String,
    required: true,
    enum: ['Coach/Manager', 'Player', 'Admin'],
  },
  salt: {type: String, required: true},
  disabled: {type: Boolean, default: false},
  verified: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
})

passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true}, async function verify(req, email, password, cb) {
  console.log(`${email} and ${password}`);
  host = req.host;
  console.log(host);

  try{
    const user = await User.findOne({email});

    if(!user){
      return cb(null, false, {message: 'Incorrect email or password'});
    }
    if (user.disabled === true){
      return cb (null, false, {message: 'Contact site Admin'});
    }
    if(!user.verified){
      console.log("unverified");
      const verificationLink = `http://${req.headers.host}/api/verify/${email}/${user._id}`
      return cb(null, false, {message: `Verify your email ${verificationLink}`});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch){
      console.log('Passwords do not Match');
      return cb (null, false, {message: 'Incorrect Email or Password'});
    }

    console.log("Authenticated");
    return cb(null, user, {message: 'Valid User'});
  }catch(error) {
    console.log(error);
    return cb(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    if(!user){
      return done(null, false, {message: 'User not found.'});
    }
    return done(null, user);
  }catch (error){
    console.error('Error finding user by ID', error);
    return done(error);
  }
});


app.post('/api/signup', async(req, res) => {
  try{
    const {email, password, username, role} = req.body;

    if(!validator.isEmail(email) || password.length < 6){
      return res.status(400).json({message: 'Invalid email or password format'});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(409).json({message: 'Email already exists'});
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      role,
      salt
    });

    await newUser.save();
    const verificationLink = `http://${req.headers.host}/api/verify/${email}/${newUser._id}`

    return res.status(201).json({message: `Registeration Success. Use Verification Link ${verificationLink} to verify account`});
  }catch(error){
    console.error(error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
});


app.get('/api/verify/:email/:userId', async (req, res) => {
  const {email, userId} = req.params;

  try{
    const user = await User.findOne({email});
    if(!user || !userId){
      return res.status(400).json({message: 'Invalid verification link'});
    }
    user.verified = true;
    await user.save();

    res.json({message: 'Email address verified successfully'});
  }catch (error){
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});


app.post('/api/login', async (req, res, next) => {
  try{
    const host = req.headers.host;
    req.host = host;

    passport.authenticate('local', {host}, async(err, user, info) => {
      if(err){
        console.error('Error with your Authentication', err);
        return res.status(500).json({message: 'Internal Server Error'});
      }
      if(!user){
        return res.status(401).json({message: info.message} || 'Authentication has failed');
      }

      req.logIn(user, (loginErr) => {
        if(loginErr){
          console.error('Login err:', loginErr);
          return res.status(500).json({message: 'Internal Service Error'});
        }
        const priv = user.isAdmin;
        console.log(priv);
        const token = jwt.sign({userId: user._id}, 'your_secret_key', {expiresIn: '24h'});
        return res.status(200).json({message: 'Login Successful', user, token, priv});
      });
    })(req, res, next);
  }catch(error){
    console.error('Error during the process of authentication', error);
    const errorMsg = error && error.info ? error.info.message : 'Authentication failed';
    return res.status(401).json({message: errorMsg});
  }
});

app.put('/api/updatePassword', async (req, res) =>{
  try{
    const{email, password, newPassword} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({message: 'User cannot be found'});
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if(!passMatch){
      return res.status(401).json({message: 'Not correct password'});
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    console.log("Password Updated");
    await user.save();

    return res.status(200).json({message: 'Password has been updated'});
  }catch(error){
    console.error(error);
    return res.status(500).json({message: 'Internal Server Error'});

  }
});


const tokenVerification = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({message: 'Not Authorized: Missing or Malformed Token'});
  }

  const token = authHeader.split(' ')[1]; // Extract token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
          return res.status(401).json({message: 'Not Authorized: Invalid Token'});
      }

      req.userId = decoded.userId; // Attach decoded userId to req
      next();
  });
};


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
