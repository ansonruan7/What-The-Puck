import { useEffect, React, useState } from 'react';
import "../index.css";
import temp_picture from "../assets/TempPhoto.jpg";

const PlayerDashboard = () => {
    const [playerData, setPlayerData] = useState([]);
    const [error, setError] = useState('');
  
    useEffect(() => {
      // Fetch all players' data when the component mounts
      const fetchPlayerData = async () => {
        try {
          const response = await fetch('/api/player/dashboard');
          const data = await response.json();
  
          if (response.ok) {
            setPlayerData(data);
          } else {
            setError(data.message || 'An error occurred while fetching data.');
          }
        } catch (error) {
          setError('Failed to fetch player data.');
        }
      };
  
      fetchPlayerData();
    }, []);
  
    return (
      <div>
        <h2>Player Dashboard</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Player</th>
              <th className="p-2 border-b">Category</th>
              <th className="p-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            {playerData.length > 0 ? (
              playerData.map((data) => (
                <tr key={data._id}>
                  <td className="p-2 border-b">{data.player}</td>
                  <td className="p-2 border-b">{data.category}</td>
                  <td className="p-2 border-b">{data.value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-2 text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default PlayerDashboard;