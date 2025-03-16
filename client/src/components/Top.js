import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';

const Top = () => {
    const [selectedStat, setSelectedStat] = useState('goals');
    const [topUsers, setTopUsers] = useState([]);

    const statsOptions = [
        'Games', 'goals', 'shots', 'assists', 'blocks',
        'pim', 'turnovers', 'takeaways', 'faceoff_wins',
        'faceoff_losses', 'icetime'
    ];

    // Fetch top users when stat changes
    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const response = await axios.get(`/api/top-users?stat=${selectedStat}`);
                setTopUsers(response.data);
            } catch (error) {
                console.error('Error fetching top users:', error);
            }
        };

        fetchTopUsers();
    }, [selectedStat]);

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Top Users by {selectedStat}</h1>

                <select
                    value={selectedStat}
                    onChange={(e) => setSelectedStat(e.target.value)}
                    className="p-2 border rounded-md mb-4"
                >
                    {statsOptions.map(stat => (
                        <option key={stat} value={stat.toLowerCase()}>
                            {stat.charAt(0).toUpperCase() + stat.slice(1)}
                        </option>
                    ))}
                </select>

                <table className="table-auto w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="p-2 text-center">Username</th>
                            <th className="p-2 text-center">Team</th>
                            <th className="p-2 text-center">{selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.map((user) => (
                            <tr key={user._id} className="border-t text-center">
                                <td className="p-2">{user.username}</td>
                                <td className="p-2">{user.team}</td>
                                <td className="p-2">{user[selectedStat]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Top;