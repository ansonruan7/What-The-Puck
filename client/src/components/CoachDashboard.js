import { React, useState, useEffect } from 'react';
import "../index.css";
import temp_picture from "../assets/TempPhoto.jpg";

const CoachDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);  
    const [team, setTeam] = useState([]);  
    const [isUpload, setIsUpload] = useState(false);
    const [player, setPlayer] = useState('');
    const [stats, setStats] = useState({
        games: '',
        goals: '',
        shots: '',
        assists: '',
        blocks: '',
        pim: '',
        turnovers: '',
        takeaways: '',
        faceoff_wins: '',
        faceoff_losses: '',
        icetime: ''
    });
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        const fetchPlayers = async () => {
            try {
                const response = await fetch('/api/players');
                const data = await response.json();

                if (response.ok) {
                    setTeam(data); 
                } else {
                    console.error('Failed to fetch players:', data.message);
                }
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, []);

    const handleDataSubmission = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setResultMessage("Error: You are not logged in.");
            return;
        }
    
        try {
            const response = await fetch('/api/push_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ player, ...stats })
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                setResultMessage("Success: Data submission successful!");
            } else {
                setResultMessage(`Error: ${responseData.message || 'Data submission failed.'}`);
            }
        } catch (error) {
            console.log("Error occurred: " + error);
            setResultMessage("Error: Network or server issue occurred.");
        }
    };
    

    const handleStatChange = (e) => {
        setStats({ ...stats, [e.target.name]: e.target.value });
    };

    return (
        <div>
            {!isUpload ? (
                <div>
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <a href='/'><button className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button></a>
                        <button 
                            onClick={() => setIsUpload(!isUpload)} 
                            className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'
                            disabled={!isLoggedIn}
                        >
                            Upload Information
                        </button>
                    </div>
    
                    {!isLoggedIn && (
                        <div className="text-center text-red-500 mt-4">
                            <p>Please log in to upload data.</p>
                        </div>
                    )}
    
                    <div className='grid grid-cols-3'>
                        <div className='col-span-2 m-10'>
                            <h1 className='text-center text-4xl font-semibold'>My Team</h1>
                            <div className='grid grid-cols-3 gap-4 mt-4'>
                                {team.map((player, index) => (
                                    <li key={index} className='p-4 border-2 border-solid border-black rounded-xl m-2 flex flex-col items-center bg-white drop-shadow-md shadow-md'>
                                        <img src={temp_picture} alt={player.username} className='w-32 h-32 mb-4 rounded-full border-4 border-blue-500' /> 
                                        <h2 className='font-bold text-lg'>{player.username}</h2>
                                    </li>
                                ))}
                            </div>
                        </div>
    
                        <div className='m-10'>
                            <h1 className='text-center text-4xl font-semibold'>Top Players</h1>
                            <ul className='my-10'>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2 bg-white shadow-md'>Wayne Gretzky</li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2 bg-white shadow-md'>Mario Lemieux</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <button 
                        onClick={() => setIsUpload(!isUpload)} 
                        className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'
                    >
                        Back
                    </button>
    
                    <div className='grid justify-center'>
                        <div className="text-center justify-center bg-white w-fit p-6 rounded-lg drop-shadow-md shadow-xl">
                            <div className="my-4">
                                <label htmlFor="">Please Select A Player: </label>
                                <select  
                                    onChange={(e) => setPlayer(e.target.value)} 
                                    defaultValue=""
                                    className='border-2 border-solid border-black p-2 rounded-md w-full'
                                >
                                    <option value="" disabled>Select a player</option>
                                    {team.map((playerData, index) => (
                                        <option key={index} value={playerData.username}>
                                            {playerData.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
    
                            <div className='grid grid-cols-2 gap-4'>
                                {Object.keys(stats).map(stat => (
                                    <div key={stat} className="my-2">
                                        <label htmlFor={stat} className='block font-semibold'>{stat.replace('_', ' ').toUpperCase()}:</label>
                                        <input 
                                            name={stat} 
                                            type='text' 
                                            value={stats[stat]} 
                                            onChange={handleStatChange} 
                                            className='border-2 border-solid border-black p-2 rounded-md w-full'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
    
                        <button 
                            onClick={handleDataSubmission} 
                            className='rounded-xl border-2 border-black border-solid p-4 my-8 bg-blue-500 text-white hover:bg-blue-600 w-full'
                        >
                            Submit
                        </button>
    
                        <p className={`w-full text-center ${resultMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                            {resultMessage}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachDashboard;
