import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet // 🔥 ADDED THIS: The magic component that swaps pages
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage/LandingPage';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
// import Dashboard from './pages/Dashboard/Dashboard'; 
import ProfilePage from './pages/Profile/ProfilePage';
import AllInvoices from './pages/Invoices/AllInvoices';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import InvoiceDetail from './pages/Invoices/InvoiceDetails';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import DashboardHome from './pages/Dashboard/DashBoardHome';
import EditInvoice from './pages/Invoices/EditInvoice';
import DashboardLayout from './components/layout/DashboardLayout';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ==========================================
              PUBLIC ROUTES 
          ========================================== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* ==========================================
              PROTECTED ROUTES (Requires Login)
          ========================================== */}
          <Route path="/" element={<ProtectedRoute />} >
            
            {/* 🔥 THE ONE AND ONLY PICTURE FRAME 🔥 */}
            {/* <Route element={<DashboardLayout />}> */}
              
              {/* The Pictures (Pages) inside the frame */}
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="invoices" element={<AllInvoices />} />
              <Route path="invoices/new" element={<CreateInvoice />} />
              <Route path="invoices/edit/:id" element={<EditInvoice />} />
              <Route path="invoice/:id" element={<InvoiceDetail />} />
              <Route path="profile" element={<ProfilePage />} />
              
            {/* </Route> */}

          </Route>

          {/* Catch-all route for 404s */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

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