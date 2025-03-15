import React, { useState } from 'react';
import Layout from './Layout';

const LOWER_IS_BETTER_STATS = ['faceoff_losses', 'pim', 'turnovers']; // Add more if needed

const PlayerComp = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Options, setPlayer1Options] = useState([]);
  const [player2Options, setPlayer2Options] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPlayers = async (name, setOptions) => {
    if (!name.trim()) {
      setOptions([]);
      return;
    }

    try {
      const response = await fetch(`/api/getPlayer?playerName=${encodeURIComponent(name)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch players.');
      }

      setOptions(data.playerData || []);
    } catch (err) {
      console.error('Error fetching players:', err);
      setOptions([]);
    }
  };

  const handleCompare = async () => {
    if (!player1 || !player2) {
      setError('Please select both players.');
      setComparisonData(null);
      return;
    }

    try {
      const response = await fetch(`/api/comparePlayers?player1=${encodeURIComponent(player1)}&player2=${encodeURIComponent(player2)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to compare players.');
      }

      setComparisonData(data);
      setError(null);
    } catch (err) {
      console.error('Error comparing players:', err);
      setError('Error fetching comparison data.');
      setComparisonData(null);
    }
  };

  const getStatClass = (statKey, value, opponentValue) => {
    if (LOWER_IS_BETTER_STATS.includes(statKey)) {
      return value < opponentValue ? 'text-green-500 font-bold' : 'text-black';
    } else {
      return value > opponentValue ? 'text-green-500 font-bold' : 'text-black';
    }
  };

  const formatStatName = (statKey) => {
    return statKey
      .replace(/_/g, ' ')   // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Player Comparison</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Player 1"
            value={player1}
            onChange={(e) => {
              setPlayer1(e.target.value);
              fetchPlayers(e.target.value, setPlayer1Options);
            }}
            className="p-2 border-2 border-gray-300 rounded-md w-full"
          />
          {player1Options.length > 0 && (
            <ul className="border border-gray-300 rounded-md bg-white mt-2">
              {player1Options.map((player) => (
                <li
                  key={player._id}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => setPlayer1(player.username)}
                >
                  {player.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Player 2"
            value={player2}
            onChange={(e) => {
              setPlayer2(e.target.value);
              fetchPlayers(e.target.value, setPlayer2Options);
            }}
            className="p-2 border-2 border-gray-300 rounded-md w-full"
          />
          {player2Options.length > 0 && (
            <ul className="border border-gray-300 rounded-md bg-white mt-2">
              {player2Options.map((player) => (
                <li
                  key={player._id}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => setPlayer2(player.username)}
                >
                  {player.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleCompare}
          className="bg-blue-500 text-white p-2 rounded-md w-full"
        >
          Compare Players
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {comparisonData && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Comparison Results</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="font-bold">Player Name</div>
              <div className="font-bold">{comparisonData.player1.username}</div>
              <div className="font-bold">{comparisonData.player2.username}</div>

              {Object.keys(comparisonData.comparison).map((statKey) => (
                <React.Fragment key={statKey}>
                  <div className="font-semibold">{formatStatName(statKey)}</div>
                  <div
                    className={getStatClass(
                      statKey,
                      comparisonData.player1.stats[statKey],
                      comparisonData.player2.stats[statKey]
                    )}
                  >
                    {comparisonData.player1.stats[statKey]}
                  </div>
                  <div
                    className={getStatClass(
                      statKey,
                      comparisonData.player2.stats[statKey],
                      comparisonData.player1.stats[statKey]
                    )}
                  >
                    {comparisonData.player2.stats[statKey]}
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

export default PlayerComp;