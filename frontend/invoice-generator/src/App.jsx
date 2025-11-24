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
import Dashboard from './pages/Dashboard/Dashboard';
import ProfilePage from './pages/Profile/ProfilePage';
import AllInvoices from './pages/Invoices/AllInvoices';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import InvoiceDetail from './pages/Invoices/InvoiceDetails';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/*Protected Routes */}
            <Route path="/" element={<ProtectedRoute/>} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="invoices" element={<AllInvoices />} />
            <Route path="invoice/new" element={<CreateInvoice/>}/>
            <Route path="invoice/:id" element={<InvoiceDetail/>}/>
            <Route path="profile" element={<ProfilePage/>}/>
          {/*  */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
      <Toaster>
        toastOptions={{
          className: '',
          style:{
            fontSize:'13px',
          }
        }}
      </Toaster>
    </div>
  );
};

export default App;