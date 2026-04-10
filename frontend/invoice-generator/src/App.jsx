import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage/LandingPage';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // Note: Removed .jsx extension for cleaner imports
import ProfilePage from './pages/Profile/ProfilePage';
import AllInvoices from './pages/Invoices/AllInvoices';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import InvoiceDetail from './pages/Invoices/InvoiceDetails';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import DashboardHome from './pages/Dashboard/DashBoardHome';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />} >
            
            {/* By wrapping EVERY page inside the Dashboard component here, 
                your sidebar and header will NEVER disappear! */}
            <Route path="dashboard" element={<Dashboard><DashboardHome /></Dashboard>} />
            <Route path="invoices" element={<Dashboard><AllInvoices /></Dashboard>} />
            <Route path="invoices/new" element={<Dashboard><CreateInvoice /></Dashboard>} />
            <Route path="invoice/:id" element={<Dashboard><InvoiceDetail /></Dashboard>} />
            <Route path="profile" element={<Dashboard><ProfilePage /></Dashboard>} />
            
          </Route>

          {/* Catch-all route for 404s */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Fixed Toaster Syntax */}
      <Toaster 
        toastOptions={{
          className: '',
          style: {
            fontSize: '13px',
          }
        }} 
      />
    </AuthProvider>
  );
};

export default App;