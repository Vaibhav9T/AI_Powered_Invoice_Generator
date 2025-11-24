import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAthenticated = true;
    const loading = false;
    if(loading){
        return <div>Loading...</div>;
    }
    if(!isAthenticated){
        return <Navigate to="/login" replace />;
    }
  return (
    <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>
  );
};

export default memo(ProtectedRoute);