import { React, useState, useEffect } from 'react'

const Averages = () => {

    let [data, setData] = useState([]);
    let average = 0;

    useEffect(() => {
        const getAverages = async () => {
            try {
                let response = await fetch('/api/getAverages');
                if (response.ok) {
                    const responseData = await response.json();
                    average = responseData;
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
                    setData(responseData);
                } else {
                    const errorData = await response.json();
                    setData(errorData.message || 'An error occurred.');
                    console.error('Error fetching info:', errorData.message);
                }
            } catch (error) {
                console.error('Fetching averages failed:', error);
            }
        }

        getAverages();
        getPlayers();
    }, []);
    
    return (
        <>
        <div className='justify-center items-center m-8 p-3 bg-[#ececec] h-screen'>{/* Background */}
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
                {data.map((stat, key) => { {/* Cards */}
                    return(
                        <>
                            <div className='grid grid-cols-12 bg-blue-400 p-5 my-4 rounded-2xl drop-shadow-md border-2 border-solid border-black text-center items-center'> { /* Actual Cards */}
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
        </div>
        </>
    )
}

export default Averages