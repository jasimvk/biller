import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
  Skeleton,
  Alert,
  Chip,
} from '@mui/material';
import {
  People,
  Inventory,
  Receipt,
  AttachMoney,
  Business,
  Book,
  Description,
  Assessment,
  Language,
  Assignment,
  Menu as MenuIcon,
  ChevronLeft,
  Dashboard as DashboardIcon,
  ChevronRight,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

function StatCard({ title, value, icon, color }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {React.cloneElement(icon, { sx: { color, mr: 1 } })}
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </Paper>
  );
}

function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSales: '0',
    pendingInvoices: '0',
    totalProducts: '0',
    activeCustomers: '0'
  });

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/business/details', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch business details');
        }

        const data = await response.json();
        setBusinessData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching business data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Determine if drawer should be open based on device type
  const isDrawerOpen = isMobile ? mobileOpen : desktopOpen;

  // Handle drawer toggle for both mobile and desktop
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  // Close mobile drawer when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const menuItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { title: 'Biller Master', icon: <Business />, path: '/biller-master' },
    { title: 'Invoice Setting', icon: <Receipt />, path: '/invoice-setting' },
    { title: 'Item Creation', icon: <Inventory />, path: '/item-creation' },
    { title: 'Pricing', icon: <AttachMoney />, path: '/pricing' },
    { title: 'Ledger Creation', icon: <Book />, path: '/ledger-creation' },
  ];

  const accountingItems = [
    { title: 'Accounting Vouchers', icon: <Description />, path: '/accounting-vouchers' },
    { title: 'Biller Reports', icon: <Assessment />, path: '/reports' },
    { title: 'E-Way Portal', icon: <Language />, path: '/eway-portal' },
    { title: 'GST Portal', icon: <Assignment />, path: '/gst-portal' },
  ];

  const statItems = [
    { title: 'Total Sales', value: stats.totalSales, icon: <AttachMoney />, color: '#4CAF50' },
    { title: 'Pending Invoices', value: stats.pendingInvoices, icon: <Receipt />, color: '#FF9800' },
    { title: 'Total Products', value: stats.totalProducts, icon: <Inventory />, color: '#2196F3' },
    { title: 'Active Customers', value: stats.activeCustomers, icon: <People />, color: '#9C27B0' },
  ];

  // Drawer configuration
  const drawerContent = (
    <>
      {/* Logo and Brand Area */}
      <Box sx={{ 
        p: 2.5, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: desktopOpen ? 'space-between' : 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        minHeight: 64,
        bgcolor: 'white'
      }}>
        {desktopOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? (
                <Skeleton width={150} />
              ) : (
                businessData?.tradeName || 'Loading...'
              )}
            </Typography>
          </Box>
        )}
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'primary.lighter',
            }
          }}
        >
          {desktopOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Menu Items */}
      <Box sx={{ py: 1, bgcolor: 'white', height: '100%' }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.title}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  handleDrawerToggle();
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                px: 2,
                minHeight: 44,
                color: 'text.primary',
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'primary.lighter',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                  },
                },
                ...(window.location.pathname === item.path && {
                  backgroundColor: 'primary.lighter',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    bgcolor: 'primary.main',
                    borderRadius: '0 3px 3px 0',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                }),
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'text.secondary',
                  minWidth: 0,
                  mr: desktopOpen ? 2 : 'auto',
                  justifyContent: 'center',
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              {desktopOpen && (
                <ListItemText 
                  primary={item.title}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

        {/* Accounting Section */}
        {desktopOpen && (
          <Typography 
            variant="overline" 
            sx={{ 
              px: 4, 
              mb: 1, 
              display: 'block',
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            ACCOUNTING
          </Typography>
        )}
        <List sx={{ px: 2 }}>
          {accountingItems.map((item) => (
            <ListItem
              button
              key={item.title}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  handleDrawerToggle();
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                px: 2,
                minHeight: 44,
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.lighter',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'text.secondary',
                  minWidth: 0,
                  mr: desktopOpen ? 2 : 'auto',
                  justifyContent: 'center',
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              {desktopOpen && (
                <ListItemText 
                  primary={item.title}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
          backgroundColor: theme.palette.primary.main,
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {loading ? (
              <Skeleton width={150} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            ) : (
              businessData?.tradeName || 'Loading...'
            )}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : desktopOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            bgcolor: 'white',
            boxShadow: '0 0 2px 0 rgba(0,0,0,0.05), 0 2px 10px 0 rgba(0,0,0,0.08)',
            ...(isMobile ? {} : {
              width: desktopOpen ? drawerWidth : theme.spacing(7),
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: '100%',
          mt: { xs: 8, sm: 2 },
          ml: { sm: desktopOpen ? `${drawerWidth}px` : `${theme.spacing(7)}px` },
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Welcome Banner */}
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {loading ? (
                    <Skeleton variant="text" width="50%" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : error ? (
                    <Alert severity="error" sx={{ bgcolor: 'transparent', color: 'white' }}>
                      {error}
                    </Alert>
                  ) : (
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Welcome back
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                        {businessData?.tradeName || 'Loading...'}
                      </Typography>
                      <Chip
                        label={`GSTIN: ${businessData?.gstin || 'N/A'}`}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          '& .MuiChip-label': { px: 2 }
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                  }}
                />
              </Paper>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {statItems.map((stat) => (
                  <Grid item xs={12} sm={6} md={3} key={stat.title}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          {stat.title}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={3}>
                {menuItems.map((item) => (
                  <Grid item xs={6} sm={4} md={3} key={item.title}>
                    <Paper
                      elevation={0}
                      onClick={() => navigate(item.path)}
                      sx={{
                        p: { xs: 2, sm: 3 },
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderRadius: 3,
                        bgcolor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          '& .icon': {
                            color: 'primary.main',
                          }
                        },
                      }}
                    >
                      {React.cloneElement(item.icon, { 
                        className: 'icon',
                        sx: { 
                          fontSize: { xs: 32, sm: 40 },
                          mb: { xs: 1, sm: 2 },
                          color: 'text.secondary',
                          transition: 'all 0.2s',
                        }
                      })}
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard; 