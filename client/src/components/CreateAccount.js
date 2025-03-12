import React, { useState } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [role, setRole] = useState('');
    const [team, setTeam] = useState(''); // Added team state
    const [info, setInfo] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username: nickname, role, team }), // Added team
            });

            if (response.ok) {
                const responseData = await response.json();
                setInfo(responseData.message);
                console.log('Account Created Successfully:', responseData.message);
            } else {
                const errorData = await response.json();
                setInfo(errorData.message || 'An error occurred.');
                console.error('Error creating account:', errorData.message);
            }
        } catch (error) {
            console.error('Creation of Account Has Failed:', error);
            setInfo('Creation of Account Has Failed.');
        }
    };

    return (
        <Layout>
            <div className='auth-container'>
                <form>
                    <h2>Create Account</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    
                    {/* Role Dropdown */}
                    <div className="role-dropdown">
                        <label htmlFor="role-select">Please Select One Role:</label>
                        <select 
                            id="role-select" 
                            onChange={(e) => setRole(e.target.value)} 
                            defaultValue=""
                        >
                            <option value="" disabled>Select a role</option>
                            <option value="Coach/Manager">Coach/Manager</option>
                            <option value="Player">Player</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Team Dropdown */}
                    <div className="team-dropdown">
                        <label htmlFor="team-select">Please Select a Team:</label>
                        <select 
                            id="team-select" 
                            onChange={(e) => setTeam(e.target.value)} 
                            defaultValue=""
                        >
                            <option value="" disabled>Select a team</option>
                            <option value="N/A (ADMIN)">N/A (ADMIN)</option>
                            <option value="Anaheim Ducks">Anaheim Ducks</option>
                            <option value="Arizona Coyotes">Arizona Coyotes</option>
                            <option value="Boston Bruins">Boston Bruins</option>
                            <option value="Buffalo Sabres">Buffalo Sabres</option>
                            <option value="Calgary Flames">Calgary Flames</option>
                            <option value="Carolina Hurricanes">Carolina Hurricanes</option>
                            <option value="Chicago Blackhawks">Chicago Blackhawks</option>
                            <option value="Colorado Avalanche">Colorado Avalanche</option>
                            <option value="Columbus Blue Jackets">Columbus Blue Jackets</option>
                            <option value="Dallas Stars">Dallas Stars</option>
                            <option value="Detroit Red Wings">Detroit Red Wings</option>
                            <option value="Edmonton Oilers">Edmonton Oilers</option>
                            <option value="Florida Panthers">Florida Panthers</option>
                            <option value="Los Angeles Kings">Los Angeles Kings</option>
                            <option value="Minnesota Wild">Minnesota Wild</option>
                            <option value="Montreal Canadiens">Montreal Canadiens</option>
                            <option value="Nashville Predators">Nashville Predators</option>
                            <option value="New Jersey Devils">New Jersey Devils</option>
                            <option value="New York Islanders">New York Islanders</option>
                            <option value="New York Rangers">New York Rangers</option>
                            <option value="Ottawa Senators">Ottawa Senators</option>
                            <option value="Philadelphia Flyers">Philadelphia Flyers</option>
                            <option value="Pittsburgh Penguins">Pittsburgh Penguins</option>
                            <option value="San Jose Sharks">San Jose Sharks</option>
                            <option value="Seattle Kraken">Seattle Kraken</option>
                            <option value="St. Louis Blues">St. Louis Blues</option>
                            <option value="Tampa Bay Lightning">Tampa Bay Lightning</option>
                            <option value="Toronto Maple Leafs">Toronto Maple Leafs</option>
                            <option value="Vancouver Canucks">Vancouver Canucks</option>
                            <option value="Vegas Golden Knights">Vegas Golden Knights</option>
                            <option value="Washington Capitals">Washington Capitals</option>
                            <option value="Winnipeg Jets">Winnipeg Jets</option>
                        </select>
                    </div>

                    <br />
                    <br />
                    
                    <button onClick={handleSignup}>Sign Up</button>
                </form>
            </div>
            <p>{info}</p>
        </Layout>
    );
};

export default CreateAccount;
