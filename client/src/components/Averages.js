import { React, useState } from 'react'

const Averages = () => {

    let [data, updateData] = useState([]);

    //API SETUP, SUBTRACT TURNOVERS FROM TAKEAWAYS AND FACEOFF_LOSSES FROM WINS
    data = [
        {
            "home_goals": 7,
            "away_goals": 3,
            "result": "WIN",
            "full_name": "Kevin Liu",
            "position": "C",
            "goals": 10,
            "shots": 42,
            "assists": 8,
            "blocks": 13,
            "pim": 3.7,
            "turnovers": 18,
            "takeaways": 32,
            "faceoff_wins": 2,
            "faceoff_losses": 7,
            "icetime": 1523
        },
        {
            "home_goals": 2,
            "away_goals": 5,
            "result": "LOSS",
            "full_name": "Jason Carter",
            "position": "RW",
            "goals": 1,
            "shots": 15,
            "assists": 3,
            "blocks": 5,
            "pim": 2.0,
            "turnovers": 12,
            "takeaways": 7,
            "faceoff_wins": 0,
            "faceoff_losses": 0,
            "icetime": 1248
        },
        {
            "home_goals": 6,
            "away_goals": 4,
            "result": "WIN",
            "full_name": "Alex Johnson",
            "position": "D",
            "goals": 0,
            "shots": 5,
            "assists": 4,
            "blocks": 17,
            "pim": 5.2,
            "turnovers": 9,
            "takeaways": 14,
            "faceoff_wins": 0,
            "faceoff_losses": 0,
            "icetime": 1672
        },
        {
            "home_goals": 3,
            "away_goals": 3,
            "result": "TIE",
            "full_name": "Ryan Smith",
            "position": "LW",
            "goals": 2,
            "shots": 12,
            "assists": 1,
            "blocks": 8,
            "pim": 1.0,
            "turnovers": 14,
            "takeaways": 9,
            "faceoff_wins": 0,
            "faceoff_losses": 0,
            "icetime": 1398
        },
        {
            "home_goals": 1,
            "away_goals": 2,
            "result": "LOSS",
            "full_name": "Ethan Cole",
            "position": "C",
            "goals": 0,
            "shots": 10,
            "assists": 2,
            "blocks": 10,
            "pim": 4.5,
            "turnovers": 7,
            "takeaways": 11,
            "faceoff_wins": 6,
            "faceoff_losses": 4,
            "icetime": 1285
        }
    ]    
    
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
                                <p>{stat.full_name}</p>
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
                                <p>{parseInt(stat.icetime/60) + ":" + parseInt(stat.icetime%60)}</p>
                            </div>
                        </>
                    )})
                }
        </div>
        </>
    )
}

export default Averages