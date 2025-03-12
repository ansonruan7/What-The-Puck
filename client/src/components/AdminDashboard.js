import { React, useState } from 'react';

const AdminDashboard = () => {

    /* ------------------------------------- Role related code ------------------------------------- */
    const [isRoleRequest, setRoleRequest] = useState(false);
    const handleRoleRequest = () => {
        getUnverifiedRoles();
        setRoleRequest(!isRoleRequest)
    }

    const [roleRequests, updateRoleRequests] = useState([]);

    const getUnverifiedRoles = async () => {
        try{
            const response = await fetch('/api/verify_role', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            updateRoleRequests(data);
        } catch (error){
            console.log("Error occured: " + error);
        }
    }

    const submitRoleDecision = async (_id, approved) => {
        try{
            const response = await fetch('/api/role_decision',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({_id, approved})
            });

            if (response.ok) {
                updateRoleRequests((prev) =>
                    prev.filter((roleRequest) => roleRequest._id !== _id)
                );
                console.log('Role decision submitted successfully!');
            } else {
                console.log('Failed to submit role decision');
            }
        }
        catch (error) {
            console.log('Error occurred: ' + error);
        }
    }

    /* ------------------------------------- Data related code ------------------------------------- */
    const [isDataRequest, setDataRequest] = useState(false);
    const handleDataRequest = () => {
        getUnverifiedData();
        setDataRequest(!isDataRequest);
    }

    const [dataRequests, updateDataRequests] = useState([]);

    const getUnverifiedData = async () => {
        try {
            const response = await fetch('/api/verify_data', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (Array.isArray(data)) {
                updateDataRequests(data);
            } else if (data && Array.isArray(data.data)) {
                updateDataRequests(data.data);
            } else {
                console.error('Unexpected data format:', data);
                updateDataRequests([]);
            }
        } catch (error) {
            console.log('Error occurred:', error);
            updateDataRequests([]);
        }
    };

    const submitDataDecision = async (_id, approved) => {
        try{
            const response = await fetch('/api/data_decision',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({_id, approved})
            });

            if (response.ok) {
                updateDataRequests((prev) =>
                    prev.filter((roleRequest) => roleRequest._id !== _id)
                );
                console.log('Data decision submitted successfully!');
            } else {
                console.log('Failed to submit data decision');
            }
        }
        catch (error) {
            console.log('Error occurred: ' + error);
        }
    }

    return(
        <div>
            {isRoleRequest ? (
                <div>
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <button onClick={handleRoleRequest} className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button>
                    </div>
                    <div>
                        {roleRequests.map((account, index) => (
                            <li key={index} className='list-none flex text-center items-center justify-between m-16 p-8 border-2 border-black border-solid drop-shadow-lg rounded-md'>
                                <p className='font-bold'>{account.username}</p>
                                <p className='font-bold'>{account.role}</p>
                                <button onClick={() => submitRoleDecision(account._id, true)} className='border-2 border-solid border-black p-6 hover:bg-[#2e9f0c]'>Approve</button>
                                <button onClick={() => submitRoleDecision(account._id, false)} className='border-2 border-solid border-black p-6 hover:bg-[#eb4242]'>Reject</button>
                            </li>
                        ))}
                    </div>
                </div>
            ) : isDataRequest ? (
                <div>
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <button onClick={handleDataRequest} className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button>
                    </div>
                    <div>
                        {dataRequests.map((data, index) => (
                            <li key={index} className='list-none flex text-left flex-col m-16 p-8 border-2 border-black border-solid drop-shadow-lg rounded-md'>
                                <p className='font-bold text-lg mb-2'>{data.player}</p>
                                <div className='grid grid-cols-2 gap-4 w-full'>
                                    {Object.entries(data).map(([key, value]) => (
                                        [
                                            'email', 'username', 'goals', 'assists', 'blocks', 
                                            'faceoff_losses', 'faceoff_wins', 'games', 'icetime', 
                                            'pim', 'shots', 'takeaways', 'turnovers'
                                        ].includes(key) && value && (
                                            <p key={key} className='text-md text-gray-700'>
                                                <span className='font-bold capitalize'>{key.replace('_', ' ')}:</span> {value}
                                            </p>
                                        )
                                    ))}
                                </div>
                                <div className='flex w-full justify-around mt-4'>
                                    <button
                                        onClick={() => submitDataDecision(data._id, true)}
                                        className='border-2 border-solid border-black p-4 hover:bg-[#2e9f0c] w-[40%]'
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => submitDataDecision(data._id, false)}
                                        className='border-2 border-solid border-black p-4 hover:bg-[#eb4242] w-[40%]'
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <a href='/'><button className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button></a>
                    </div>
                    <div>
                        <button onClick={handleRoleRequest} className='p-4 m-8 border-2 border-solid border-black rounded-xl hover:bg-[#bfbfc4]'>Role Requests</button>
                        <button onClick={handleDataRequest} className='p-4 m-8 border-2 border-solid border-black rounded-xl hover:bg-[#bfbfc4]'>Data Requests</button>
                    </div>
                </div>
            )}
        </div>
    );
    
    
}

export default AdminDashboard;