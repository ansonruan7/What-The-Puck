import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './components/Home.js';
import Login from './components/Login.js';
import CreateAccount from './components/CreateAccount.js';
import AuthUser from './components/AuthUser.js';
import CoachDashboard from './components/CoachDashboard.js';
import PlayerDashboard from './components/PlayerDashboard.js';
import { UserProvider } from './components/UserContext.js';
import AdminDashboard from './components/AdminDashboard.js';
import Averages from './components/Averages.js';
import Navbar from './components/Navbar.js';


function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/AuthUser" element={<AuthUser/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/CreateAccount" element={<CreateAccount/>}/>
          <Route path="/CoachDashboard" element={<CoachDashboard/>}/>
          <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          <Route path="/PlayerDashboard" element={<PlayerDashboard/>}/>
          <Route path='/Averages' element={<Averages/>}/>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;