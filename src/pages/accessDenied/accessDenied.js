import { Container } from '@mui/system';
import React from 'react';

const AccessDeniedPage = () => {
  return (
    <Container sx={{ textAlign: 'center', p: 3, m: 3 }}>
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        {/* You can add more content or links here if needed */}
      </div>
    </Container>
  );
};

export default AccessDeniedPage;
