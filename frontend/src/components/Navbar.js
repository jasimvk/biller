import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        bgcolor: 'background.default',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1.5rem',
            }}
            onClick={() => navigate('/')}
          >
            BILLER
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/businesses')}
              sx={{
                fontWeight: location.pathname === '/businesses' ? 600 : 500,
                color: location.pathname === '/businesses' 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary,
              }}
            >
              View Businesses
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                px: 3,
                fontWeight: 600,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Register Business
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 