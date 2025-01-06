import { React, useState } from "react";

const PlayerDashboard = () => {
  const [playerData, setPlayerData] = useState([]);
  const [isDataVisible, setIsDataVisible] = useState(false);

  const handleDataToggle = () => {
    fetchPlayerData();
    setIsDataVisible(!isDataVisible);
  };

  // Fetch Player Data
  const fetchPlayerData = async () => {
    try {
      const response = await fetch("/api/player/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPlayerData(data);
      } else {
        console.error("Failed to fetch player data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  return (
    <div>
      {isDataVisible ? (
        <div>
          {/* Navigation Tabs */}
          <div className="flex justify-between drop-shadow-xl bg-slate-300">
            <button
              onClick={handleDataToggle}
              className="rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]"
            >
              Back
            </button>
          </div>

          {/* Player Data Table */}
          <div>
            {playerData.length > 0 ? (
              <ul>
                {playerData.map((data, index) => (
                  <li
                    key={index}
                    className="list-none flex text-center items-center justify-between m-16 p-8 border-2 border-black border-solid drop-shadow-lg rounded-md"
                  >
                    <p className="font-bold">Player: {data.player}</p>
                    <p className="font-bold">Category: {data.category}</p>
                    <p className="font-bold">Value: {data.value}</p>
                    <p className="font-bold">
                      Data Verified: {data.data_verified ? "Yes" : "No"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No data available</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Navigation Tabs */}
          <div className="flex justify-between drop-shadow-xl bg-slate-300">
            <a href="/">
              <button className="rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]">
                Back
              </button>
            </a>
          </div>

          {/* Button to Access Player Data */}
          <div>
            <button
              onClick={handleDataToggle}
              className="p-4 m-8 border-2 border-solid border-black rounded-xl hover:bg-[#bfbfc4]"
            >
              View Player Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDashboard;
