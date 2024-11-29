import { React } from 'react';

const AdminDashboard = () => {
    return(
        <div>
            {/* Navigation Tabs */}
            <div className='flex justify-between drop-shadow-xl bg-slate-300'>
                <a href='/'><button className='rounded-xl border-2 border-black border-solid p-4 m-4 hover:bg-[#bfbfc4]'>Back</button></a>
            </div>
        </div>
    );
}

export default AdminDashboard;