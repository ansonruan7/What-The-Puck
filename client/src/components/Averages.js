import { React, useState, useEffect } from 'react'

const Averages = () => {

    let [rawData, setRawData] = useState([]);
    let [processedData, setProcessedData] = useState([]);
    let average = 0;

    let [pageSwitch, setPageSwitch] = useState(true);

    useEffect(() => {
        const getAverages = async () => {
            try {
                let response = await fetch('/api/getAverages');
                if (response.ok) {
                    const responseData = await response.json();
                    average = responseData;
                    console.log(average);
                } else {
                    const errorData = await response.json();
                    average = (errorData.message || 'An error occurred.');
                    console.error('Error fetching info:', errorData.message);
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
                    const processed = calculateRatings(responseData);
                    console.log("Processed Data (Before Setting State):", processed);
                    setProcessedData(processed);
                } else {
                    const errorData = await response.json();
                    setRawData(errorData.message || 'An error occurred.');
                    console.error('Error fetching info:', errorData.message);
                    setProcessedData(errorData.message || 'An error occurred.');
                    console.error('Error fetching info:', errorData.message);
                }
            } catch (error) {
                console.error('Fetching averages failed:', error);
            }
        }

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
            let count = data.length;
    
            // Normalize numeric fields
            for (let key in updatedPlayer) {
                if (typeof updatedPlayer[key] === "number" && key !== "__v") {
                    updatedPlayer[key] = updatedPlayer[key] / count;
                }
            }
    
            // Apply weight-based rating calculation
            updatedPlayer["goals"] *= 40;
            updatedPlayer["shots"] *= 5;
            updatedPlayer["assists"] *= 20;
            updatedPlayer["blocks"] *= 5;
            updatedPlayer["faceoff_wins"] -= updatedPlayer["faceoff_losses"];
            updatedPlayer["takeaways"] -= updatedPlayer["turnovers"];
            updatedPlayer["pim"] *= -2.5;
    
            // Remove unnecessary fields
            delete updatedPlayer["faceoff_losses"];
            delete updatedPlayer["turnovers"];
            delete updatedPlayer["games"];

            // Calculate score and append
            updatedPlayer["rating"] = (updatedPlayer["goals"] + updatedPlayer['shots'] + updatedPlayer['assists'] + updatedPlayer["blocks"] + updatedPlayer["faceoff_wins"] + updatedPlayer["takeaways"] + updatedPlayer["pim"])/timeToSeconds(updatedPlayer["icetime"]);
            
            console.log(updatedPlayer['rating']);
            return updatedPlayer;
        });
        return updatedData;
    };

    
    return (
        <>
        {pageSwitch ? <div className='justify-center items-center m-8 p-3 bg-[#ececec] h-screen min-w-fit'>{/* Background */}
            <div className='flex items-center justify-center w-full'>
                <button onClick={() => setPageSwitch(false)} className='bg-white p-3 m-2 rounded-full border-black border-solid border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Statistics
                </button>
                <button onClick={() => setPageSwitch(true)} className='bg-white p-3 m-2 rounded-full border-black border-solid border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Ratings
                </button>
            </div>
            <div className='grid grid-cols-3 font-bold text-center justify-center items-center p-5 m-auto'> {/* Data Holder/Labels */}
                <p>Full Name</p>
                <p>Position</p>
                <p>Rating</p>
            </div>
                {processedData.map((stat, index) => { {/* Cards */}
                    return(
                        <>
                            <div key={index} className='grid grid-cols-3 bg-blue-400 p-5 my-4 rounded-2xl drop-shadow-md border-2 border-solid border-black text-center items-center m-auto'> { /* Actual Cards */}
                                <p>{stat.username}</p>
                                <p>{stat.position}</p>
                                <p>{stat.rating}</p>
                            </div>
                        </>
                    )})
                }
        </div> : 
        <div className='justify-center items-center m-8 p-3 bg-[#ececec] h-screen'>{/* Background */}
            <div className='flex items-center justify-center w-full'>
                <button onClick={() => setPageSwitch(false)} className='bg-white p-3 m-2 rounded-full border-black border-solid border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Statistics
                </button>
                <button onClick={() => setPageSwitch(true)} className='bg-white p-3 m-2 rounded-full border-black border-solid border-2 drop-shadow-sm hover:bg-[#c9e2f7]'>
                    Ratings
                </button>
            </div>
            <div className='grid grid-cols-12 font-bold text-center justify-center items-center p-5'> {/* Data Holder/Labels */}
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
                {rawData.map((stat, index) => { {/* Cards */}
                    return(
                        <>
                            <div key={index} className='grid grid-cols-12 bg-blue-400 p-5 my-4 rounded-2xl drop-shadow-md border-2 border-solid border-black text-center items-center'> { /* Actual Cards */}
                                <p>{stat.username}</p>
                                <p>{stat.position}</p>
                                <p>{stat.goals}</p>
                                <p>{stat.shots}</p>
                                <p>{stat.assists}</p>
                                <p>{stat.blocks}</p>
                                <p>{stat.pim}</p>
                                <p>{stat.turnovers}</p>
                                <p>{stat.takeaways}</p>
                                <p>{stat.faceoff_wins}</p>
                                <p>{stat.faceoff_losses}</p>
                                <p>{stat.icetime}</p>
                            </div>
                        </>
                    )})
                }
        </div>}
        </>
    )
}

export default Averages;