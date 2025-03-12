import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import Layout from './Layout';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce'; // Import lodash debounce for efficiency

const AuthUser = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  // Player Data States
  const [playerName, setPlayerName] = useState('');
  const [playerResults, setPlayerResults] = useState([]);
  const [playerError, setPlayerError] = useState(null);

  // Team Data States
  const [teamName, setTeamName] = useState('');
  const [teamResults, setTeamResults] = useState([]);
  const [teamError, setTeamError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  // Debounced search for player data
  const fetchPlayerData = debounce(async (name) => {
    if (!name.trim()) {
      setPlayerError(null);
      setPlayerResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/getPlayer?playerName=${encodeURIComponent(name.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Player not found');
      }

      setPlayerResults(data.playerData || []);
      setPlayerError(null);
    } catch (error) {
      console.error('Error fetching player data:', error);
      setPlayerError('Failed to fetch player data.');
      setPlayerResults([]);
    }
  }, 300);

  // Debounced search for team data
  const fetchTeamData = debounce(async (name) => {
    if (!name.trim()) {
      setTeamError(null);
      setTeamResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/getTeam?teamName=${encodeURIComponent(name.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Team not found');
      }

      setTeamResults(data.teamData || []);
      setTeamError(null);
    } catch (error) {
      console.error('Error fetching team data:', error);
      setTeamError('Failed to fetch team data.');
      setTeamResults([]);
    }
  }, 300);

  // Input Handlers
  const handlePlayerInputChange = (e) => {
    const name = e.target.value;
    setPlayerName(name);
    fetchPlayerData(name);
  };

  const handleTeamInputChange = (e) => {
    const name = e.target.value;
    setTeamName(name);
    fetchTeamData(name);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div>
        <p>You must be logged in to view this page.</p>
        <Link to="/">Go back to Home</Link>
      </div>
    );
  }

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="flex justify-center items-start min-h-[15vh] pt-4">
        <h2 className="text-2xl font-bold text-center">Welcome, {user.email}!</h2>
      </div>

      {/* Search & Results Section */}
      <div className="flex min-h-[85vh]">
        {/* Left Side - Player Search */}
        <div className="w-1/2 p-4">
          <div className="search-container mt-2 w-3/4 mx-auto">
            <input
              type="text"
              placeholder="Search for a player..."
              value={playerName}
              onChange={handlePlayerInputChange}
              className="p-2 border-2 border-gray-300 rounded-md w-full"
            />
          </div>

          {playerError && <p className="text-red-500 mt-4">{playerError}</p>}

          {playerResults.length > 0 && (
            <div className="player-results mt-4">
              <h3>Matching Players</h3>
              {playerResults.map((player) => (
                <div key={player._id} className="border p-4 mt-4 rounded-md bg-gray-100">
                  <h4 className="font-bold text-lg">{player.player}</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    <li><strong>Team:</strong> {player.team}</li>
                    <li><strong>Games:</strong> {player.games}</li>
                    <li><strong>Goals:</strong> {player.goals}</li>
                    <li><strong>Shots:</strong> {player.shots}</li>
                    <li><strong>Assists:</strong> {player.assists}</li>
                    <li><strong>Blocks:</strong> {player.blocks}</li>
                    <li><strong>PIM (Penalty Minutes):</strong> {player.pim}</li>
                    <li><strong>Turnovers:</strong> {player.turnovers}</li>
                    <li><strong>Takeaways:</strong> {player.takeaways}</li>
                    <li><strong>Faceoff Wins:</strong> {player.faceoff_wins}</li>
                    <li><strong>Faceoff Losses:</strong> {player.faceoff_losses}</li>
                    <li><strong>Ice Time:</strong> {player.icetime}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Team Search */}
        <div className="w-1/2 p-4">
          <div className="search-container mt-2 w-3/4 mx-auto">
            <input
              type="text"
              placeholder="Search for a team..."
              value={teamName}
              onChange={handleTeamInputChange}
              className="p-2 border-2 border-gray-300 rounded-md w-full"
            />
          </div>

          {teamError && <p className="text-red-500 mt-4">{teamError}</p>}

          {teamResults.length > 0 && (
            <div className="team-results mt-4">
              <h3>Matching Teams</h3>
              {teamResults.map((team) => (
                <div key={team._id} className="border p-4 mt-4 rounded-md bg-gray-100">
                  <h4 className="font-bold text-lg">{team.team}</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    <li><strong>Goals For:</strong> {team.goals_for}</li>
                    <li><strong>Team Assists:</strong> {team.team_assists}</li>
                    <li><strong>Penalty Minutes:</strong> {team.penalty_minutes}</li>
                    <li><strong>Goals Per Game:</strong> {team.goals_per_game.toFixed(2)}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthUser;
