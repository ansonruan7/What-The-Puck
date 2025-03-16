import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute.js';
import Profile from './components/Profile';
import PlayerComp from './components/PlayerComp.js';
import TeamComp from './components/TeamComp.js';
import Top from './components/Top.js';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar/>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/AuthUser" element={<AuthUser />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />

          {/* Protected Routes */}
          <Route 
            path="/PlayerDashboard" 
            element={
              <ProtectedRoute allowedRoles={['Player', 'Coach/Manager', 'Admin']}>
                <PlayerDashboard />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/Profile"
            element={
              <ProtectedRoute allowedRoles={['Player', 'Coach/Manager', 'Admin']}>
              <Profile />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/CoachDashboard" 
            element={
              <ProtectedRoute allowedRoles={['Coach/Manager', 'Admin']}>
                <CoachDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/AdminDashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/Averages" 
            element={
              <ProtectedRoute allowedRoles={['Player', 'Coach/Manager', 'Admin']}>
                <Averages />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/PlayerComp" 
            element={
              <ProtectedRoute allowedRoles={['Player', 'Coach/Manager', 'Admin']}>
                <PlayerComp />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/TeamComp" 
            element={
              <ProtectedRoute allowedRoles={['Player', 'Coach/Manager', 'Admin']}>
                <TeamComp />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Top" 
            element={
              <ProtectedRoute allowedRoles={['Player', 'Coach/Manager', 'Admin']}>
                <Top />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
