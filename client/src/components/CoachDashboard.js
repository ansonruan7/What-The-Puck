import { React, useState } from 'react';
import "../index.css";
import temp_picture from "../assets/TempPhoto.jpg";
import { useEffect } from "react";

const CoachDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Set default state to false

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Optionally, validate token (e.g., check expiration) here
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
    }, []);

    // Temporarily hard-coded
    let team = [
        { "playerName": "Henrik Lundqvist", "position": "G" },
        { "playerName": "Jonathan Toews", "position": "C" },
        { "playerName": "Evgeni Malkin", "position": "C" },
        { "playerName": "Nikita Kucherov", "position": "RW" },
        { "playerName": "Steve Yzerman", "position": "C" },
        { "playerName": "Mark Messier", "position": "C" },
        { "playerName": "Joe Sakic", "position": "C" },
        { "playerName": "Teemu Selänne", "position": "RW" },
        { "playerName": "Pavel Datsyuk", "position": "C" }
    ];
    
    // Page management
    const [isUpload, setIsUpload] = useState(false);
    const handleIsUpload = () => { setIsUpload(!isUpload) };

    // Data upload variables
    const [category, setCategory] = useState('');
    const [player, setPlayer] = useState('');
    const [value, setValue] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const handleDataSubmission = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setResultMessage("Error: You are not logged in.");
            return; // Don't proceed without a token
        }

        try {
            const response = await fetch('/api/push_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ player: player, category: category, value: value })
            });
            const responseData = await response.json();
            setResultMessage(responseData.message);
        } catch (error) {
            console.log("Error occurred: " + error);
            setResultMessage("Error: Data submission failed.");
        }
    };

    return (
        <div>
            {!isUpload ? (
                <div>
                    {/* Navigation Tabs */}
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <a href='/'><button className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button></a>
                        <button 
                            onClick={handleIsUpload} 
                            className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'
                            disabled={!isLoggedIn} // Disable the button if not logged in
                        >
                            Upload Information
                        </button>
                    </div>

                    {/* Show message if user is not logged in */}
                    {!isLoggedIn && (
                        <div className="text-center text-red-500 mt-4">
                            <p>Please log in to upload data.</p>
                        </div>
                    )}

                    <div className='grid grid-cols-3'>
                        <div className='col-span-2 m-10'>
                            <h1 className='text-center text-4xl font-semibold'>My Team</h1>

                            {/* Contains all player cards */}
                            <div className='grid grid-cols-3 grid-rows-3'>
                                {team.map((player, index) => (
                                        <li key={index} className='p-4 border-2 border-solid border-black rounded-xl m-2 flex flex-col items-center'>
                                            {/* Player Image */}
                                            <img src={temp_picture} alt={player.playerName} className='w-32 h-32 mb-4' /> 
                                            <h2 className='font-bold'>{player.playerName}</h2>
                                            <h2 className='italic'>{player.position}</h2>
                                        </li>
                                    ))}
                            </div>
                        </div>

                        {/* List of players in the right side of the screen and some featured stats */}
                        <div className='m-10'>
                            <h1 className='text-center text-4xl font-semibold'>Top Players</h1>
                            <ul className='my-10'>
                                {/* Display top players */}
                                {/* You can list more top players here */}
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Wayne Gretzky
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Mario Lemieux
                                </li>
                                {/* Add more players here */}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Upload information form*/}
                    <button onClick={handleIsUpload} className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button>
                    <div className='grid justify-center'>
                        <div className="text-center justify-center bg-white w-fit p-4 rounded-lg drop-shadow-md shadow-xl">
                            <div className="my-4">
                                <label htmlFor="">Please Select A Player: </label>
                                <select  
                                    onChange={(e) => setPlayer(e.target.value)} 
                                    defaultValue="" // Ensures no role is selected by default
                                >
                                    <option value="" disabled>Select a player</option>
                                    {team.map((player, index) => {
                                            return(
                                                <option key={index} value={player.playerName}>{player.playerName}</option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="my-4">
                                <label htmlFor="">Please Select A Category: </label>
                                <select  
                                    onChange={(e) => setCategory(e.target.value)} 
                                    defaultValue="" // Ensures no role is selected by default
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="Shots">Shots</option>
                                    <option value="Face-offs">Face-offs</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Data value: </label>
                                <input onChange={(e) => setValue(e.target.value)} className='border-2 border-solid border-black p-1' type='text' placeholder='Value'></input>
                            </div>
                        </div>
                        <button onClick={handleDataSubmission} className='rounded-xl border-2 border-black border-solid p-4 my-8 hover:bg-[#bfbfc4]'>Submit</button>
                        <p className='w-full'>{resultMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CoachDashboard;
