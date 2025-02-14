import React, { Fragment, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useLocation } from 'react-router-dom';
import { Button, InputField, Card, Alert } from '@mckesson/mcp-component-library';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ForgotPassword = () => {
  const { oktaAuth } = useOktaAuth();
  const query = useQuery();
  const defaultEmail = query.get('email') || '';
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await oktaAuth.forgotPassword({
        username: email,
        factorType: 'EMAIL'
      });
      setMessage('Password reset email sent successfully.');
    } catch (error) {
      setMessage('Error sending password reset email.');
    }
  };

  return (
    <div style={{ width: '480px', margin: '60px auto' }}>
      <form onSubmit={handleSubmit}>
        <Card
          bodyContent={
            <div style={{ marginTop: '20px' }}>
              <InputField
                id="email"
                isRequired
                label="Email"
                name="email"
                onInputChange={(e) => {
                  setEmail(e.target.value);
                }}
                tooltipText="Enter your email address"
                useRegister={false}
              />
            </div>
          }
          footerContent={
            <div>
              <div style={{ marginBottom: '20px' }}>
                <Button type="submit">Submit</Button>
              </div>
              {message && <Alert size="sm" description={message} onClose={() => {}} type="error" />}
            </div>
          }
          header={<h2>Forgot Password ?</h2>}
          uniqueId={1}
          width="100%"
        />
      </form>
    </div>
  );
};

export default ForgotPassword;
