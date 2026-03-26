import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Redirect back to the page the user was trying to access before login
  const from = location.state?.from ?? '/booking';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const { email, password } = formData;

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Sign In</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>Welcome back</h2>
          <p className={styles.heroSubtitle}>Sign in to manage your bookings</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="sarah@email.com"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className={styles.registerLink}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>Create one</Link>
          </p>

        </form>
      </main>
    </div>
  );
}

export default LoginPage;