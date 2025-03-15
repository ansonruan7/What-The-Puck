import React, { useState, useEffect } from 'react';
import Layout from './Layout';

const LOWER_IS_BETTER_STATS = ['team_pim'];

const TeamComp = () => {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch available teams for dropdowns
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/getTeams');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch teams.');
        }

        setTeams(data.teams);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setTeams([]);
      }
    };

    fetchTeams();
  }, []);

  const handleCompare = async () => {
    if (!team1 || !team2) {
      setError('Please select both teams.');
      setComparisonData(null);
      return;
    }

    try {
      const response = await fetch(`/api/compareTeams?team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to compare teams.');
      }

      setComparisonData(data);
      setError(null);
    } catch (err) {
      console.error('Error comparing teams:', err);
      setError('Error fetching comparison data.');
      setComparisonData(null);
    }
  };

  const getStatClass = (statKey, value, opponentValue) => (
    LOWER_IS_BETTER_STATS.includes(statKey)
      ? value < opponentValue ? 'text-green-500 font-bold' : 'text-black'
      : value > opponentValue ? 'text-green-500 font-bold' : 'text-black'
  );

  const formatStatName = (statKey) => (
    statKey.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Team Comparison</h1>

        <div className="mb-4">
          <select
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded-md w-full"
          >
            <option value="">Select Team 1</option>
            {teams.map((team) => (
              <option key={team.team} value={team.team}>
                {team.team}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <select
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded-md w-full"
          >
            <option value="">Select Team 2</option>
            {teams.map((team) => (
              <option key={team.team} value={team.team}>
                {team.team}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompare}
          className="bg-blue-500 text-white p-2 rounded-md w-full"
        >
          Compare Teams
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {comparisonData && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Comparison Results</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="font-bold">Team Name</div>
              <div className="font-bold">{comparisonData.team1.team}</div>
              <div className="font-bold">{comparisonData.team2.team}</div>

              {Object.keys(comparisonData.comparison).map((statKey) => (
                <React.Fragment key={statKey}>
                  <div className="font-semibold">{formatStatName(statKey)}</div>
                  <div className={getStatClass(statKey, comparisonData.team1.stats[statKey], comparisonData.team2.stats[statKey])}>
                    {comparisonData.team1.stats[statKey]}
                  </div>
                  <div className={getStatClass(statKey, comparisonData.team2.stats[statKey], comparisonData.team1.stats[statKey])}>
                    {comparisonData.team2.stats[statKey]}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeamComp;
