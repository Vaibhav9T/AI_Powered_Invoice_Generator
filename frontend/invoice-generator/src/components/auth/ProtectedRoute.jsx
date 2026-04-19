import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    // Only grab 'loading' and 'isAuthenticated'
    const { isAuthenticated, loading } = useAuth();

    // Show a loading screen while AuthContext reads from localStorage
    if(loading){
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    // If loading is finished and they aren't authenticated, kick them out
    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }
    
    // Let them through!
    return <Outlet />;
};

export default ProtectedRoute;