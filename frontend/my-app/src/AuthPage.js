import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AuthStateListener from './AuthListener';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [appId, setAppId] = useState('plagiarism_checker');
  // sb-localhost-auth-token
  useEffect(() => {
    const storedSession = JSON.parse(localStorage.getItem('sb-demoadmin-auth-token'));
    if (storedSession) {
      setMessage(`Welcome back, ${storedSession.user.email}`);
    }
  }, []);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Sign-up successful! Please check your email to confirm your account.');
    }
  };

  const handleLogin = async () => {
    try {
      const { error, user, session } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log("Session old", localStorage.getItem('sb-demoadmin-auth-token'))

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        localStorage.getItem('sb-demoadmin-auth-token');
        setMessage(`Login successful! Welcome, ${user.email}`);
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error.message}`);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const { error, user, session } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        localStorage.getItem('sb-demoadmin-auth-token');;
        setMessage(`Login successful! Welcome, ${user.email}`);
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb-demoadmin-auth-token');
    setMessage('You have been logged out.');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Supabase Auth</h1>
      <div style={styles.formGroup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.buttonGroup}>
        <button onClick={handleSignUp} style={styles.button}>Sign Up</button>
        <button onClick={handleLogin} style={styles.button}>Login</button>
        <button onClick={handleGoogleLogin} style={styles.button}>Login with Google</button>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    color: '#555',
  },
};

export default AuthPage;
