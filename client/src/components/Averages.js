import { React, useState, useEffect } from 'react';
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const Averages = () => {
    let [rawData, setRawData] = useState([]);
    let [processedData, setProcessedData] = useState([]);
    let [averages, setAverages] = useState(null);
    let [pageSwitch, setPageSwitch] = useState(true);

    useEffect(() => {
        const getAverages = async () => {
            try {
                let response = await fetch('/api/getAverages');
                if (response.ok) {
                    const responseData = await response.json();
                    setAverages(responseData);
                } else {
                    console.error('Error fetching averages');
                }
            } catch (error) {
                console.error('Fetching averages failed:', error);
            }
        };

        const getPlayers = async () => {
            try {
                let response = await fetch('/api/getAllPlayers');
                if (response.ok) {
                    const responseData = await response.json();
                    setRawData(responseData);
                    setProcessedData(calculateRatings(responseData));
                } else {
                    console.error('Error fetching players');
                }
            } catch (error) {
                console.error('Fetching players failed:', error);
            }
        };

        getAverages();
        getPlayers();
    }, []);

    function timeToSeconds(timeStr) {
        const [minutes, seconds] = timeStr.split(":").map(Number);
        return minutes * 60 + seconds;
    }

    const calculateRatings = (data) => {
        const updatedData = data.map((player) => {
            let updatedPlayer = { ...player };
    
            // Calculate raw rating (same as before)
            updatedPlayer["raw_rating"] = (updatedPlayer["goals"] * 40 +
                                          updatedPlayer["shots"] * 5 +
                                          updatedPlayer["assists"] * 20 +
                                          updatedPlayer["blocks"] * 5 +
                                          updatedPlayer["faceoff_wins"] - 
                                          updatedPlayer["faceoff_losses"] +
                                          updatedPlayer["takeaways"] - 
                                          updatedPlayer["turnovers"] +
                                          updatedPlayer["pim"] * -2.5) / 
                                          timeToSeconds(updatedPlayer["icetime"]);
    
            if (Number.isNaN(updatedPlayer["raw_rating"])) {
                updatedPlayer["raw_rating"] = "Unavailable";
            }
            
            return updatedPlayer;
        });
    
        // Get an array of valid ratings
        const ratings = updatedData
            .filter(player => typeof player["raw_rating"] === "number")
            .map(player => player["raw_rating"]);
    
        // Sort ratings in ascending order
        ratings.sort((a, b) => a - b);
    
        // Assign percentiles
        updatedData.forEach(player => {
            if (typeof player["raw_rating"] === "number") {
                const rank = ratings.indexOf(player["raw_rating"]) + 1; // Get position in sorted array
                const percentile = (rank / ratings.length) * 100;
                player["rating"] = Math.round(percentile);
            } else {
                player["rating"] = "Unavailable";
            }
        });
    
        return updatedData;
    };

    return (
        <>
        {pageSwitch ? 
        <div className='justify-center items-center m-8 p-3 bg-[#ececec] h-screen min-w-fit'>
            <div className='flex items-center justify-center w-full'>
                <button onClick={() => setPageSwitch(false)} className='bg-white p-3 m-2 rounded-full border-black border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Statistics
                </button>
                <button onClick={() => setPageSwitch(true)} className='bg-white p-3 m-2 rounded-full border-black border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Ratings
                </button>
            </div>

            <div className='grid grid-cols-3 font-bold text-center p-5'>
                <p>Full Name</p>
                <p>Position</p>
                <p>Rating</p>
            </div>

            {processedData.map((stat, index) => (
                <div key={index} className='grid grid-cols-3 bg-blue-400 p-5 my-4 rounded-2xl border-2 text-center'>
                    <p>{stat.username}</p>
                    <p>{stat.position}</p>
                    <p>{stat.rating}</p>
                </div>
            ))}
        </div> 
        : 
        <div className='justify-center items-center m-8 p-3 bg-[#ececec] h-screen'>
            <div className='flex items-center justify-center w-full'>
                <button onClick={() => setPageSwitch(false)} className='bg-white p-3 m-2 rounded-full border-black border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Statistics
                </button>
                <button onClick={() => setPageSwitch(true)} className='bg-white p-3 m-2 rounded-full border-black border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Ratings
                </button>
            </div>
            
            <div className='grid grid-cols-12 font-bold text-center p-5'>
                <p>Full Name</p>
                <p>Position</p>
                <p>Goals</p>
                <p>Shots</p>
                <p>Assists</p>
                <p>Blocks</p>
                <p>PIM</p>
                <p>Turnovers</p>
                <p>Takeaways</p>
                <p>Faceoff Wins</p>
                <p>Faceoff Losses</p>
                <p>Icetime</p>
            </div>

            {rawData.map((stat, index) => (
                <div key={index} className='grid grid-cols-12 bg-blue-400 p-5 my-4 rounded-2xl border-2 text-center'>
                    <p>{stat.username}</p>
                    <p>{stat.position}</p>
                    {Object.keys(averages || {}).slice(1).map((key) => (
                        <p key={key} className='flex items-center justify-center'>
                            {key === "icetime"
                                ? stat[key] // Display time as is
                                : stat[key]} 
                            {key === "icetime"
                                ? (timeToSeconds(stat[key]) > timeToSeconds(averages[key]) ? <AiOutlineArrowUp className='text-green-500 ml-1' /> : <AiOutlineArrowDown className='text-red-500 ml-1' />) 
                                : (stat[key] > averages[key] ? <AiOutlineArrowUp className='text-green-500 ml-1' style={{size: 20}} /> : <AiOutlineArrowDown className='text-red-500 ml-1' style={{size: 20}} />)}
                        </p>
                    ))}
                </div>
            ))}
        </div>}
        </>
    );
}

export default Averages;