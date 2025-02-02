import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ fontWeight: 500 }}
          >
            © {currentYear} Biller. All rights reserved.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Link
              href="#"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': { color: theme.palette.primary.main }
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': { color: theme.palette.primary.main }
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': { color: theme.palette.primary.main }
              }}
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 