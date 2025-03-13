import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useUser } from './UserContext';

const PlayerDashboard = () => {
    const { user } = useUser(); 
    const [playerStats, setPlayerStats] = useState({
        role: user?.role || '',
        team: user?.team || '',
        games: user?.games || 0,
        goals: user?.goals || 0,
        shots: user?.shots || 0,
        assists: user?.assists || 0,
        blocks: user?.blocks || 0,
        pim: user?.pim || 0,
        turnovers: user?.turnovers || 0,
        takeaways: user?.takeaways || 0,
        faceoff_wins: user?.faceoff_wins || 0,
        faceoff_losses: user?.faceoff_losses || 0,
        icetime: user?.icetime || '00:00',
    });

    const [isDataVisible, setIsDataVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setPlayerStats({
                role: user.role,
                team: user.team,
                games: user.games,
                goals: user.goals,
                shots: user.shots,
                assists: user.assists,
                blocks: user.blocks,
                pim: user.pim,
                turnovers: user.turnovers,
                takeaways: user.takeaways,
                faceoff_wins: user.faceoff_wins,
                faceoff_losses: user.faceoff_losses,
                icetime: user.icetime,
            });
        }
    }, [user]);

    const handleDataToggle = () => {
        setIsDataVisible(!isDataVisible);
    };

    return (
        <Layout>
            <div className="profile-container p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
                {!isDataVisible ? (
                    <div className="flex justify-center">
                        <button
                            onClick={handleDataToggle}
                            className="p-4 m-8 border-2 border-solid border-black rounded-xl hover:bg-[#bfbfc4]"
                        >
                            View Player Data
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Info Section */}
                        <div className="info-section bg-gray-100 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Player Stats</h2>
                            <p><strong>Role:</strong> {playerStats.role}</p>
                            <p><strong>Team:</strong> {playerStats.team}</p>
                            <p><strong>Games Played:</strong> {playerStats.games}</p>
                            <p><strong>Goals:</strong> {playerStats.goals}</p>
                            <p><strong>Shots:</strong> {playerStats.shots}</p>
                            <p><strong>Assists:</strong> {playerStats.assists}</p>
                            <p><strong>Blocks:</strong> {playerStats.blocks}</p>
                            <p><strong>Penalty Minutes:</strong> {playerStats.pim}</p>
                            <p><strong>Turnovers:</strong> {playerStats.turnovers}</p>
                            <p><strong>Takeaways:</strong> {playerStats.takeaways}</p>
                            <p><strong>Faceoff Wins:</strong> {playerStats.faceoff_wins}</p>
                            <p><strong>Faceoff Losses:</strong> {playerStats.faceoff_losses}</p>
                            <p><strong>Ice Time:</strong> {playerStats.icetime}</p>
                        </div>

                        {/* Back Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleDataToggle}
                                className="mt-4 w-full max-w-xs bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PlayerDashboard;


