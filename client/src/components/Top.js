import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';

const Top = () => {
    const [selectedStat, setSelectedStat] = useState('goals');
    const [topUsers, setTopUsers] = useState([]);
    const [selectedTeamStat, setSelectedTeamStat] = useState('goals_for');
    const [topTeams, setTopTeams] = useState([]);

    const playerStatsOptions = [
        'Games', 'goals', 'shots', 'assists', 'blocks',
        'pim', 'turnovers', 'takeaways', 'faceoff_wins',
        'faceoff_losses', 'icetime'
    ];

    const teamStatsOptions = [
        'Goals For', 'Team Assists', 'Team PIM', 'Goals Per Game'
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

    // Fetch top teams when stat changes
    useEffect(() => {
        const fetchTopTeams = async () => {
            try {
                const response = await axios.get(`/api/top-teams?stat=${selectedTeamStat.toLowerCase().replace(/ /g, '_')}`);
                setTopTeams(response.data);
            } catch (error) {
                console.error('Error fetching top teams:', error);
            }
        };

        fetchTopTeams();
    }, [selectedTeamStat]);

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Top Users by {selectedStat}</h1>

                <select
                    value={selectedStat}
                    onChange={(e) => setSelectedStat(e.target.value)}
                    className="p-2 border rounded-md mb-4"
                >
                    {playerStatsOptions.map(stat => (
                        <option key={stat} value={stat.toLowerCase()}>
                            {stat.charAt(0).toUpperCase() + stat.slice(1)}
                        </option>
                    ))}
                </select>

                <table className="table-auto w-full bg-white shadow-md rounded-lg mb-8">
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

                <h1 className="text-2xl font-bold mb-4">Top Teams by {selectedTeamStat}</h1>

                <select
                    value={selectedTeamStat}
                    onChange={(e) => setSelectedTeamStat(e.target.value)}
                    className="p-2 border rounded-md mb-4"
                >
                    {teamStatsOptions.map(stat => (
                        <option key={stat} value={stat}>
                            {stat}
                        </option>
                    ))}
                </select>

                <table className="table-auto w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-green-600 text-white">
                            <th className="p-2 text-center">Team</th>
                            <th className="p-2 text-center">{selectedTeamStat}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topTeams.map((team) => (
                            <tr key={team._id} className="border-t text-center">
                                <td className="p-2">{team.team}</td>
                                <td className="p-2">{team[selectedTeamStat.toLowerCase().replace(/ /g, '_')]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Top;