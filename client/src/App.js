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
              <ProtectedRoute allowedRoles={['Player']}>
                <PlayerDashboard />
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
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
