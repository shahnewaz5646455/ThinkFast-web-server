import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from './AuthContext';

export default function Privaterouter({children}) {
    const location = useLocation();
    const { user, loading } = useContext(AuthContext);
    if (loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <span className="text-cyan-500 loading loading-bars loading-xl"></span>
        </div>
    }
    if (user && user?.email) {
        return children;
    }
    // Pass the current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
}