require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;
const Storage = require('node-storage');
const store = new Storage('./data/db.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const { ObjectId } = require('mongodb');
const cors = require('cors');
/*const childPython = spawn('python', ['predict.py', 'Jack Hughes scored 0 goals on 6  shots, 2 assists, with 0 shot blocks, 0 penalty minutes, 1 giveaway and 0 takeaways, with 1 faceoff win, and 3 faceoff losses with 20:37 minutes played'], );
childPython.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});*/

app.use(cors({
    origin: 'http://localhost:3000',  // Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    credentials: true  // Allow cookies and authentication headers
}));
app.use(bodyParser.json());

mongoose.connect('', {
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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  role: {
      type: String,
      required: true,
      enum: ['Coach/Manager', 'Player', 'Admin'],
  },
  team: {
      type: String,
      required: true,
      enum: [
          'N/A (ADMIN)',
          'Anaheim Ducks', 'Arizona Coyotes', 'Boston Bruins',
          'Buffalo Sabres', 'Calgary Flames', 'Carolina Hurricanes',
          'Chicago Blackhawks', 'Colorado Avalanche', 'Columbus Blue Jackets',
          'Dallas Stars', 'Detroit Red Wings', 'Edmonton Oilers',
          'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild',
          'Montreal Canadiens', 'Nashville Predators', 'New Jersey Devils',
          'New York Islanders', 'New York Rangers', 'Ottawa Senators',
          'Philadelphia Flyers', 'Pittsburgh Penguins', 'San Jose Sharks',
          'Seattle Kraken', 'St. Louis Blues', 'Tampa Bay Lightning',
          'Toronto Maple Leafs', 'Vancouver Canucks', 'Vegas Golden Knights',
          'Washington Capitals', 'Winnipeg Jets'
      ]
  },
  salt: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  role_verified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },

  // Player Data Fields
  games: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  shots: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  blocks: { type: Number, default: 0 },
  pim: { type: Number, default: 0 }, // Penalty minutes
  turnovers: { type: Number, default: 0 },
  takeaways: { type: Number, default: 0 },
  faceoff_wins: { type: Number, default: 0 },
  faceoff_losses: { type: Number, default: 0 },
  icetime: { type: String, default: '00:00' }, // Stored as "MM:SS"
  data_verified: { type: Boolean, default: false }
});

app.post("/predict", (req, res) => {
  const text = req.body.input;
  let responseSent = false;  // Flag to track if the response has been sent

  const pythonProcess = spawn("python", ['predict.py', text]);
  let dataBuffer = '';

  // Handle the stdout response from Python
  pythonProcess.stdout.on("data", (data) => {
    
    if (!responseSent) {
      dataBuffer += data.toString();
      //console.log(dataBuffer);
      res.json(dataBuffer);
      responseSent = true;
    }
  });

  pythonProcess.stdout.on("end", () => {
    if (!responseSent) {
      try {
        const result = JSON.parse(dataBuffer);
        console.log(result);
        res.json(result);
        responseSent = true;
      } catch (error) {
        console.error(`Error parsing JSON: ${error}`);
        res.status(500).json({ error: "Prediction failed due to JSON parsing error" });
        responseSent = true;
      }
    }
  });

  /* Handle errors from stderr
  pythonProcess.stderr.on("data", (data) => {
    if (!responseSent) {
      console.error(`ERROR: ${data.toString()}`);
      res.status(500).json({ error: "Prediction failed" });
      responseSent = true;
    }
  });*/

  // Handle Python process exit
  pythonProcess.on("close", (code) => {
    if (!responseSent) {
      console.error(`Python process exited with code ${code}`);
      res.status(500).json({ error: "Prediction failed due to Python error" });
      responseSent = true;
    }
  });
});


const HOCKEYDATA = mongoose.model('HOCKEYDATA',{
  player: {type: String, required: true},
  category: {
    type: String,
    required: true,
    enum: ["Shots", "Face-offs"],
  },
  //position: {type: Object, coordinates: {x: Double, y: Double}},
  value: {type: Number, required: true},
  data_verified: {type: Boolean, default: false}
})

const TEAMDATA = mongoose.model('TEAMDATA', {
  team: { type: String, required: true },              // Team name
  goals_for: { type: Number, required: true, default: 0 },   // Total team goals
  team_assists: { type: Number, required: true, default: 0 }, // Total team assists
  team_pim: { type: Number, required: true, default: 0 },     // Total penalty minutes (previous field)
  goals_per_game: { type: Number, required: true, default: 0 } // Goals per game
});



passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true}, async function verify(req, email, password, cb) {
  host = req.host;

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

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  // Remove 'Bearer ' from the token string if it exists
  const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  jwt.verify(tokenString, process.env.JWT_SECRET, (err, decoded) => {  // Using environment variable for secret key
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    // Attach the decoded user ID to the request object
    req.userId = decoded.userId;
    next();
  });
};

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


app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, username, role, team } = req.body;

    if (!validator.isEmail(email) || password.length < 6) {
      return res.status(400).json({ message: 'Invalid email or password format' });
    }

    const validTeams = [
      'N/A (ADMIN)',
      'Anaheim Ducks', 'Arizona Coyotes', 'Boston Bruins', 'Buffalo Sabres',
      'Calgary Flames', 'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche',
      'Columbus Blue Jackets', 'Dallas Stars', 'Detroit Red Wings', 'Edmonton Oilers',
      'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild', 'Montreal Canadiens',
      'Nashville Predators', 'New Jersey Devils', 'New York Islanders', 'New York Rangers',
      'Ottawa Senators', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'San Jose Sharks',
      'Seattle Kraken', 'St. Louis Blues', 'Tampa Bay Lightning', 'Toronto Maple Leafs',
      'Vancouver Canucks', 'Vegas Golden Knights', 'Washington Capitals', 'Winnipeg Jets'
    ];

    const selectedTeam = role === 'Admin' ? 'N/A (ADMIN)' : team;

    if (!validTeams.includes(selectedTeam)) {
      return res.status(400).json({ message: 'Invalid team selection.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      role,
      team: selectedTeam,
      salt
    });

    await newUser.save();

    const verificationLink = `http://${req.headers.host}/api/verify/${email}/${newUser._id}`;

    // ✅ Return immediately after success response
    res.status(201).json({ message: `Registration Success. Please Verify Your Email: ${verificationLink}` });

    // Handle email errors independently to avoid crashes
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Please Verify Your Email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email and complete your registration.</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully.');
    } catch (mailError) {
      console.error('Error sending email: ', mailError);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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


app.post('/api/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "User not found" });

      // Check if the user is verified
      if (!user.verified) {
          return res.status(403).json({ message: `Email not verified. Please check your email to verify your account. http://${req.headers.host}/api/verify/${email}/${user._id}` });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '24h' });

      console.log("Generated Token (Server):", token);  // ✅ Debugging

      res.status(200).json({ 
          message: "Login Successful",
          user,
          token  // ✅ Ensure token is included in response
      });

  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
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

// Request that pulls all users with unverified roles
app.get('/api/verify_role', async (req, res) => {
  try{
    // Get all users that have not had their roles verified
    const curs = await User.find({role_verified: false});
    res.json(curs);
  } catch (error){
    console.error('Error fetching events:', error);
    res.status(404).send('Error ' + error);
  }
});

// Request that pushes the decision of the admin
app.post('/api/role_decision', async (req, res) => {
  const {_id, approved} = req.body;
  const id = new ObjectId(req.body._id); // Converts to MongoDB ObjectId
  try{
    const result = await User.updateOne(
      { _id:  id},
      { $set: { role_verified: req.body.approved } }
    );
    res.json(result);
  } catch (error){
    console.log("Error occured: " + error);
  }
});

// Coach/Manager data pushing function
app.post('/api/push_data', async (req, res) => {
  const { player, games, goals, shots, assists, blocks, pim, turnovers, takeaways, faceoff_wins, faceoff_losses, icetime } = req.body;

  // Validation: Check if all fields are provided
  if (!player || !games || !goals || !shots || !assists || !blocks || !pim || !turnovers || !takeaways || !faceoff_wins || !faceoff_losses || !icetime) {
      return res.status(400).json({ message: "Error: Please fill in all fields before submitting." });
  }

  try {
      const playerData = await User.findOne({ username: player, role: 'Player' });

      if (!playerData) {
          return res.status(404).json({ message: "Player not found." });
      }

      // Update the player's stats in the User model
      await User.updateOne(
          { username: player },
          {
              $set: {
                  games: Number(games) || 0,
                  goals: Number(goals) || 0,
                  shots: Number(shots) || 0,
                  assists: Number(assists) || 0,
                  blocks: Number(blocks) || 0,
                  pim: Number(pim) || 0,
                  turnovers: Number(turnovers) || 0,
                  takeaways: Number(takeaways) || 0,
                  faceoff_wins: Number(faceoff_wins) || 0,
                  faceoff_losses: Number(faceoff_losses) || 0,
                  icetime: icetime || '00:00',
                  data_verified: false // Flag for admin review
              }
          }
      );

      res.status(200).json({ message: "Upload Success! Data pending admin verification." });
  } catch (error) {
      console.error('Error updating player data:', error);
      res.status(500).json({ message: "Error occurred: " + error });
  }
});



// Request that pulls all unverified data
// GET: Retrieve all users with unverified data
app.get('/api/verify_data', async (req, res) => {
  try {
    const unverifiedUsers = await User.find({ data_verified: false });

    if (!unverifiedUsers || unverifiedUsers.length === 0) {
      return res.status(404).json({ message: 'No unverified data found.' });
    }

    res.status(200).json(unverifiedUsers);
  } catch (error) {
    console.error('Error fetching unverified data:', error);
    res.status(500).json({ message: 'Server error occurred.', error: error.message });
  }
});

// POST: Update user verification status based on admin's decision
app.post('/api/data_decision', async (req, res) => {
  const { _id, approved } = req.body;

  if (!_id || typeof approved === 'undefined') {
    return res.status(400).json({ message: 'Invalid request. Please provide _id and approved status.' });
  }

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user's verification status
    await User.updateOne({ _id: _id }, { $set: { data_verified: approved } });

    if (approved) {
      // If approved, recalculate and update TEAMDATA
      const verifiedPlayers = await User.find({
        team: user.team,
        role: 'Player',
        data_verified: true
      });

      const totalStats = verifiedPlayers.reduce((totals, player) => ({
        goals: totals.goals + Number(player.goals || 0),
        assists: totals.assists + Number(player.assists || 0),
        pim: totals.pim + Number(player.pim || 0),
        games: totals.games + Number(player.games || 0)
      }), { goals: 0, assists: 0, pim: 0, games: 0 });

      const goalsPerGame = totalStats.games > 0
        ? parseFloat((totalStats.goals / totalStats.games).toFixed(2))
        : 0;

      await TEAMDATA.findOneAndUpdate(
        { team: user.team },
        {
          $set: {
            goals_for: totalStats.goals,
            team_assists: totalStats.assists,
            team_pim: totalStats.pim,
            goals_per_game: goalsPerGame
          }
        },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({ message: `User ${approved ? 'approved' : 'rejected'} successfully.` });
  } catch (error) {
    console.error('Error updating data verification:', error);
    res.status(500).json({ message: 'Error occurred while updating data verification.', error: error.message });
  }
});


app.get('/api/player/dashboard',verifyToken, async (req, res) => {
  try {
    const playerId = req.query.playerid;

    let playerData;
    if (playerId) {
      // Fetch data for a specific player
      playerData = await HOCKEYDATA.find({ player: playerId });
    } else {
      // Fetch all player data
      playerData = await HOCKEYDATA.find();
    }

    if (!playerData || playerData.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.json(playerData);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/players', async (req, res) => {
  try {
      const players = await User.find(
          { role: 'Player', role_verified: true }, 
          { username: 1, team: 1, _id: 0 }  // 🔹 Ensure `team` is included!
      );

      if (!players || players.length === 0) {
          return res.status(404).json({ message: 'No verified players found.' });
      }

      console.log("Players API Response:", players); // 🛠 Debugging
      res.status(200).json(players);
  } catch (error) {
      console.error('Error fetching player data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/getTeams', async (req, res) => {
  try {
    const teams = await TEAMDATA.find({}, 'team'); // Fetch only team names
    res.status(200).json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/getTeam', async (req, res) => {
  const { teamName } = req.query;

  if (!teamName) {
    return res.status(400).json({ message: 'Please provide a team name.' });
  }

  try {
    const matchingTeam = await TEAMDATA.findOne({ 
      team: { $regex: new RegExp(`^${teamName}`, 'i') } 
    });

    if (!matchingTeam) {
      return res.status(404).json({ message: `No teams found matching: ${teamName}` });
    }

    // Return as an array inside `teamData` to match frontend expectations
    res.status(200).json({
      teamData: [
        {
          _id: matchingTeam._id,
          team: matchingTeam.team,
          goals_for: matchingTeam.goals_for,
          team_assists: matchingTeam.team_assists,
          team_pim: matchingTeam.team_pim,
          goals_per_game: matchingTeam.goals_per_game
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching team data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not Authorized: Missing or Malformed Token' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Not Authorized: Invalid Token' });
      }

      req.user = decoded; // Attach decoded user data to `req`
      next();
  });
};

app.get('/api/getPlayer', async (req, res) => {
  const { playerName } = req.query; // Extract player name from query parameters

  if (!playerName) {
      return res.status(400).json({ message: 'Please provide a player name.' });
  }

  try {
      const playerData = await User.find({
          username: { $regex: new RegExp(playerName, 'i') }, // Case-insensitive partial match
          role: 'Player',           // Only show players
          data_verified: true       // ✅ Only show verified data
      }).select('-password -salt'); // Exclude sensitive data

      if (!playerData || playerData.length === 0) {
          return res.status(404).json({ message: `No data found for player: ${playerName}` });
      }

      res.status(200).json({ playerData }); // Return array of matching players
  } catch (error) {
      console.error('Error fetching player data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/api/update-profile', authenticateUser, async (req, res) => {
  const { email, username, password, stats } = req.body;
  const userId = req.user.userId;

  try {
      const updateData = { email, username };

      // Password update logic
      if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(password, salt);
      }

      // Queue stat changes for admin approval
      if (stats) {
          updateData.pending_stats = stats; // Store unverified stats in a temporary field
          updateData.data_verified = false; // Mark data as unverified
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      res.json({
          message: 'Profile updated successfully. Awaiting admin approval for stat changes.',
          user: updatedUser
      });
  } catch (error) {
      res.status(500).json({ message: 'Error updating profile.' });
  }
});

app.get('/api/comparePlayers', async (req, res) => {
  const { player1, player2 } = req.query;

  if (!player1 || !player2) {
      return res.status(400).json({ message: 'Please provide two player names.' });
  }

  try {
      const players = await User.find({
          username: { $in: [player1, player2] },
          role: 'Player' // Ensure only player roles are fetched
      });

      if (players.length !== 2) {
          return res.status(404).json({ message: 'Both players must exist in the database.' });
      }

      const [p1, p2] = players;

      const comparisonData = {
        player1: {
            username: `${p1.username} (${p1.team})`,
            stats: p1
        },
        player2: {
            username: `${p2.username} (${p2.team})`,
            stats: p2
        },
        comparison: {}
    };
    

      // Compare numeric stats
      const statFields = [
          'games', 'goals', 'shots', 'assists', 'blocks',
          'pim', 'turnovers', 'takeaways', 'faceoff_wins',
          'faceoff_losses'
      ];

      statFields.forEach((key) => {
          if (p1[key] > p2[key]) {
              comparisonData.comparison[key] = 'player1';
          } else if (p1[key] < p2[key]) {
              comparisonData.comparison[key] = 'player2';
          } else {
              comparisonData.comparison[key] = 'equal';
          }
      });

      res.status(200).json(comparisonData);

  } catch (error) {
      console.error('Error comparing players:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/compareTeams', async (req, res) => {
  const { team1, team2 } = req.query;

  if (!team1 || !team2) {
      return res.status(400).json({ message: 'Please provide two team names.' });
  }

  try {
      const [t1, t2] = await Promise.all([
          TEAMDATA.findOne({ team: { $regex: new RegExp(`^${team1}$`, 'i') } }),
          TEAMDATA.findOne({ team: { $regex: new RegExp(`^${team2}$`, 'i') } })
      ]);

      if (!t1 || !t2) {
          return res.status(404).json({ message: 'One or both teams not found.' });
      }

      const comparisonData = {
          team1: {
              team: t1.team,
              stats: t1
          },
          team2: {
              team: t2.team,
              stats: t2
          },
          comparison: {}
      };

      const statsToCompare = ['goals_for', 'team_assists', 'team_pim', 'goals_per_game'];
      statsToCompare.forEach(stat => {
          if (stat === 'team_pim') {
              comparisonData.comparison[stat] = t1[stat] < t2[stat] ? 'team1' : 'team2';
          } else {
              comparisonData.comparison[stat] = t1[stat] > t2[stat] ? 'team1' : 'team2';
          }
      });

      res.status(200).json(comparisonData);
  } catch (error) {
      console.error('Error comparing teams:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


// JWT Secret
const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';  // Use .env or default to 'default_secret_key'

// MongoDB URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
      console.log('DB Connected');
  })
  .catch((e) => {
      console.log('DB not Connected', e);
  });

// Helper Function
function timeToSeconds(timeStr) {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
}

const secondsToTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

app.get('/api/getAverages', async (req, res) => {
  try {
    let data = await User.find({}).lean();

    if (data.length === 0) {
      return res.status(404).json({ message: `No data found.` });
    }
    
    let averages = {};
    let count = 0;
    let rating_average = 0;

    //Add values together to prepare to average
    data.forEach(player => {
      if(player["role"] === "Player"){
        Object.entries(player).forEach(([key, value]) => {
          if (typeof value === "number") {
            averages[key] = (averages[key] || 0) + value;
          } else if (key === "icetime" && typeof value === "string") {  
            // Convert "MM:SS" to seconds
            averages["icetime"] = (averages["icetime"] || 0) + timeToSeconds(value);
          }
        });
        count += 1
      }
    });

    // Get the real average
    Object.entries(averages).forEach(([key, value]) => {
      averages[key] = value/count;
    })

    averages["icetime"] = secondsToTime(averages["icetime"]);

    res.send(averages);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/getAllPlayers', async (req, res) => {
  try {
    let data = await User.find({}).lean();
    if (data.length === 0) {
      return res.status(404).json({ message: `No data found.` });
    }
    // Filter out non-player roles
    data = data.filter(player => player.role === "Player");
    
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/api/top-users', async (req, res) => {
  const { stat } = req.query; // e.g., 'goals', 'assists'
  
  // List of valid stats to ensure security
  const validStats = [
      'games', 'goals', 'shots', 'assists', 'blocks',
      'pim', 'turnovers', 'takeaways', 'faceoff_wins',
      'faceoff_losses', 'icetime'
  ];

  if (!validStats.includes(stat)) {
      return res.status(400).json({ error: 'Invalid stat category.' });
  }

  try {
      let topUsers;

      if (stat === 'icetime') {
          // For ice time, convert "MM:SS" to total seconds for sorting
          topUsers = await User.aggregate([
              {
                  $match: {
                      role: 'Player',
                      data_verified: true
                  }
              },
              {
                  $addFields: {
                      icetimeInSeconds: {
                          $sum: [
                              { $multiply: [{ $toInt: { $arrayElemAt: [{ $split: ["$icetime", ":"] }, 0] } }, 60] },
                              { $toInt: { $arrayElemAt: [{ $split: ["$icetime", ":"] }, 1] } }
                          ]
                      }
                  }
              },
              { $sort: { icetimeInSeconds: -1 } }, // Sort ice time by total seconds
              { $limit: 10 }
          ]);
      } else {
          topUsers = await User.find({
              role: 'Player',          
              data_verified: true      
          })
          .sort({ [stat]: -1 })        
          .limit(10);                  
      }

      res.json(topUsers);
  } catch (error) {
      res.status(500).json({ error: 'Server error occurred.' });
  }
});


app.get('/api/top-teams', async (req, res) => {
  const { stat } = req.query;

  const validStats = [
      'goals_for', 'team_assists', 'team_pim', 'goals_per_game'
  ];

  if (!validStats.includes(stat)) {
      return res.status(400).json({ error: 'Invalid stat category.' });
  }

  try {
      const topTeams = await TEAMDATA.find({})
          .sort({ [stat]: -1 })  // Sort teams by selected stat
          .limit(10);            // Limit to top 10 teams

      res.json(topTeams);
  } catch (error) {
      res.status(500).json({ error: 'Server error occurred.' });
  }
});




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
