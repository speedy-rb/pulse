import { useState, useEffect } from "react";
import styles from './LoginScreen.module.css';


function LoginScreen({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      if (!res.ok) {
        setErrorMessage('Invalid email or password.');
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setErrorMessage('Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.loginScreen}>
      <section className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <img
            className={styles.loginLogo}
            src="/pulse-icon-192x192.png"
            alt="Pulse"
          />
          <h1>Log in</h1>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.loginField}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.loginField}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {errorMessage && (
            <p className={styles.loginError}>{errorMessage}</p>
          )}

          <button
            className={styles.loginButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginScreen;