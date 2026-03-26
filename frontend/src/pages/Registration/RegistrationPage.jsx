import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import styles from './RegistrationPage.module.css';

function RegistrationPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:     '',
    surname:  '',
    username: '',
    email:    '',
    password: '',
  });

  const [error,      setError]      = useState(null);
  const [isLoading,  setIsLoading]  = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Basic presence validation
    const { name, surname, username, email, password } = formData;
    if (!name || !surname || !username || !email || !password) {
      setError('All fields are required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      // Redirect to booking page after successful registration
      navigate('/intake');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Create Account</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>Get started</h2>
          <p className={styles.heroSubtitle}>It only takes a couple of minutes</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>First name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Sarah"
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="surname" className={styles.label}>Surname</label>
              <input
                id="surname"
                name="surname"
                type="text"
                placeholder="Smith"
                className={styles.input}
                value={formData.surname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="sarahsmith"
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
            />
          </div>

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
              placeholder="At least 8 characters"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Error message */}
          {error && <p className={styles.errorMsg}>{error}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className={styles.loginLink}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>Sign in</Link>
          </p>

        </form>
      </main>
    </div>
  );
}

export default RegistrationPage;