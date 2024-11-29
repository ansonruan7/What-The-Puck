import { React, useState } from 'react';
import "../index.css";
import temp_picture from "../assets/TempPhoto.jpg";

const CoachDashboard = () => {

    let playerCards = [
        {
            "playerName": "Henrik Lundqvist",
            "position": "G"
        },
        {
            "playerName": "Jonathan Toews",
            "position": "C"
        },
        {
            "playerName": "Evgeni Malkin",
            "position": "C"
        },
        {
            "playerName": "Nikita Kucherov",
            "position": "RW"
        },
        {
            "playerName": "Steve Yzerman",
            "position": "C"
        },
        {
            "playerName": "Mark Messier",
            "position": "C"
        },
        {
            "playerName": "Joe Sakic",
            "position": "C"
        },
        {
            "playerName": "Teemu Selänne",
            "position": "RW"
        },
        {
            "playerName": "Pavel Datsyuk",
            "position": "C"
        }
    ]
    
    const [isUpload, setIsUpload] = useState(false);
    const handleIsUpload = () => {setIsUpload(!isUpload)};

    const [category, setCategory] = useState('');

    return(
        <div>
            {!isUpload ? (
                <div>
                    {/* Navigation Tabs */}
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <a href='/'><button className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button></a>
                        <button onClick={handleIsUpload} className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Upload Information</button>
                    </div>
                    <div className='grid grid-cols-3'>
                        <div className='col-span-2 m-10'>
                            <h1 className='text-center text-4xl font-semibold'>My Team</h1>

                            {/* Contains all player cards */}
                            <div className='grid grid-cols-3 grid-rows-3'>
                                {playerCards.map((player, index) => (
                                        <li key={index} className='p-4 border-2 border-solid border-black rounded-xl m-2 flex flex-col items-center'>
                                            {/* Player Image */}
                                            <img src={temp_picture} alt={player.playerName} className='w-32 h-32 mb-4' /> 
                                            <p className='font-bold'>{player.playerName}</p>
                                            <p className='italic'>{player.position}</p>
                                        </li>
                                    ))}
                            </div>
                        </div>

                        {/* List of players in the right side of the screen and some featured stats */}
                        <div className='m-10'>
                            <h1 className='text-center text-4xl font-semibold'>Top Players</h1>
                            <ul className='my-10'>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Wayne Gretzky
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Mario Lemieux
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Sidney Crosby
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Alex Ovechkin
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Jaromír Jágr
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Bobby Orr
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Patrick Roy
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Gordie Howe
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Martin Brodeur
                                </li>
                                <li className='p-4 border-2 border-solid border-black rounded-xl m-2'>
                                    Connor McDavid
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div>

                    {/* Upload information form*/}
                    <div>
                    <button onClick={handleIsUpload} className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button>
                        <div className="h-screen text-center justify-center">
                            <label htmlFor="">Please Select A Category:</label>
                            <select  
                                onChange={(e) => setCategory(e.target.value)} 
                                defaultValue="" // Ensures no role is selected by default
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Coach/Manager">Coach/Manager</option>
                                <option value="Player">Player</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CoachDashboard;