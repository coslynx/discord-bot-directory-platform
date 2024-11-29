import { Box, Typography, Container, Link } from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ py: 3, bgcolor: '#121212' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="#">
            Discord Bot Directory
          </Link>{' '}
          {currentYear}{' '}
          <CopyrightIcon />
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
```