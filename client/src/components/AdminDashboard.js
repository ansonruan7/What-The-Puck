import { React, useState } from 'react';

const AdminDashboard = () => {

    /* ------------------------------------- Role related code ------------------------------------- */
    const [isRoleRequest, setRoleRequest] = useState(false);
    const handleRoleRequest = () => {
        getUnverifiedRoles();
        setRoleRequest(!isRoleRequest)
    }

    // Contains all unverified accounts
    const [roleRequests, updateRoleRequests] = useState([]);

    // Handle Role Requests
    const getUnverifiedRoles = async () => {
        try{
            // Make the request
            const response = await fetch('/api/verify_role', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Get the data
            const data = await response.json();
            // Update the list of accounts
            updateRoleRequests(data);
        } catch (error){
            console.log("Error occured: " + error);
        }
    }

    // Send role decisions
    const submitRoleDecision = async (_id, approved) => {
        try{
            const response = await fetch('/api/role_decision',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id, approved})
            });

            if (response.ok) {
                // Optionally update the UI after a successful decision
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
    
    // Contains all unverified accounts
    const [dataRequests, updateDataRequests] = useState([]);

    // Handle Role Requests
    const getUnverifiedData = async () => {
        try{
            // Make the request
            const response = await fetch('/api/verify_data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Get the data
            const data = await response.json();
            // Update the list of accounts
            updateDataRequests(data);
        } catch (error){
            console.log("Error occured: " + error);
        }
    }

    // Send role decisions
    const submitDataDecision = async (_id, approved) => {
        try{
            const response = await fetch('/api/data_decision',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id, approved})
            });

            if (response.ok) {
                // Optionally update the UI after a successful decision
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
                    {/* Content for Role Requests */}
                    {/* Navigation Tabs */}
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
                    {/* Content for Role Requests */}
                    {/* Navigation Tabs */}
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <button onClick={handleDataRequest} className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button>
                    </div>
                    <div>
                        {dataRequests.map((data, index) => (
                            <li key={index} className='list-none flex text-center items-center justify-between m-16 p-8 border-2 border-black border-solid drop-shadow-lg rounded-md'>
                                <p className='font-bold'>{data.player}</p>
                                <p className='font-bold'>{data.category}</p>
                                <p className='font-bold'>{data.value}</p>
                                <button onClick={() => submitDataDecision(data._id, true)} className='border-2 border-solid border-black p-6 hover:bg-[#2e9f0c]'>Approve</button>
                                <button onClick={() => submitDataDecision(data._id, false)} className='border-2 border-solid border-black p-6 hover:bg-[#eb4242]'>Reject</button>
                            </li>
                    ))}
                    </div>
                </div>
            ) : (
                <div>
                    {/* Navigation Tabs */}
                    <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                        <a href='/'><button className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button></a>
                    </div>

                    {/* Buttons to access different forms */}
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