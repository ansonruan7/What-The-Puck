import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useUser } from './UserContext';  

const PlayerDashboard = () => {
    const { user } = useUser(); 
    const [verifiedStats, setVerifiedStats] = useState({});

    const [prediction, setPrediction] = useState(null);
    const [performance, setPerformance] = useState('');

    useEffect(() => {
        if (user?.data_verified) {
            
            setVerifiedStats({
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
                icetime: user.icetime  
                
            });

            const aiInput = `${user.playerName} scored ${user.goals} goals on ${user.shots} shots, ${user.assists} assists, with ${user.blocks} shot blocks, ${user.pim} penalty minutes, ${user.turnovers} giveaways and ${user.takeaways} takeaways, with ${user.faceoff_wins} faceoff wins, and ${user.faceoff_losses} faceoff losses with ${user.icetime} minutes played`;
            fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: aiInput }), 
            })
            .then(response => response.json())
            .then(data => {
                const parsedData = JSON.parse(data);
                const predictionValue = parsedData.prediction;
                //console.log(predictionValue + "AAAA")
                setPrediction(predictionValue);

                // Set performance based on the prediction value (1 or 0)
                let performanceValue = "Unknown";
                if (parsedData.prediction === 1) {
                    performanceValue = "Overperformer";
                  } else if (parsedData.prediction === 0) {
                    performanceValue = "Underperformer";
                  }
                setPerformance(performanceValue);
            })
            .catch(error => {
                console.error('Error fetching prediction:', error);
            });
            
        }
    }, [user]);

    return (
        <Layout>
            <div className="profile-container p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
                <div className="info-section bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Player Stats (Verified)</h2>
                    {user?.data_verified ? (
                        <>
                            <p><strong>Games Played:</strong> {verifiedStats.games}</p>
                            <p><strong>Goals:</strong> {verifiedStats.goals}</p>
                            <p><strong>Shots:</strong> {verifiedStats.shots}</p>
                            <p><strong>Assists:</strong> {verifiedStats.assists}</p>
                            <p><strong>Blocks:</strong> {verifiedStats.blocks}</p>
                            <p><strong>Penalty Minutes:</strong> {verifiedStats.pim}</p>
                            <p><strong>Turnovers:</strong> {verifiedStats.turnovers}</p>
                            <p><strong>Takeaways:</strong> {verifiedStats.takeaways}</p>
                            <p><strong>Faceoff Wins:</strong> {verifiedStats.faceoff_wins}</p>
                            <p><strong>Faceoff Losses:</strong> {verifiedStats.faceoff_losses}</p>
                            <p><strong>Ice Time:</strong> {verifiedStats.icetime}</p>
                            {/* Display prediction and performance */}
                            {prediction !== null && (
                                <div className="prediction-section mt-4 p-4 bg-gray-100 rounded-lg">
                                    <p><strong>AI Prediction:</strong> {prediction}</p>
                                    <p><strong>Performance:</strong> {performance}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-red-500">Stats are pending admin approval.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PlayerDashboard;



