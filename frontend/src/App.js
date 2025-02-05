import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Registration from './pages/Registration';
import BusinessList from './pages/BusinessList';
import InvoiceSettings from './pages/InvoiceSettings';
import Invoice from './pages/Invoice';
import Dashboard from './pages/Dashboard';
import BillerMaster from './pages/BillerMaster';
import InvoiceSetting from './pages/InvoiceSetting';
import ItemCreation from './pages/ItemCreation';
import Pricing from './pages/Pricing';
import LedgerCreation from './pages/LedgerCreation';
import AccountingVouchers from './pages/AccountingVouchers';
import BillerReports from './pages/BillerReports';
import EWayPortal from './pages/EWayPortal';
import GSTPortal from './pages/GSTPortal';
import HSNSAC from './pages/HSNSAC';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569',
      light: '#64748b',
      dark: '#334155',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/businesses" element={<BusinessList />} />
          <Route path="/invoice-settings" element={<InvoiceSettings />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/biller-master" element={<BillerMaster />} />
          <Route path="/invoice-setting" element={<InvoiceSetting />} />
          <Route path="/item-creation" element={<ItemCreation />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/ledger-creation" element={<LedgerCreation />} />
          <Route path="/accounting-vouchers/*" element={<AccountingVouchers />} />
          <Route path="/biller-reports/*" element={<BillerReports />} />
          <Route path="/eway-portal" element={<EWayPortal />} />
          <Route path="/gst-portal" element={<GSTPortal />} />
          <Route path="/hsn-sac" element={<HSNSAC />} />
         </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 