import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import AdminPage from './Admin.jsx';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // prevents default form submit behavior
    if (username === 'admin' && password === 'admin') {
      navigate('/AdminPage');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
