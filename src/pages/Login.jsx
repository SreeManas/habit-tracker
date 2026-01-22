import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-icon">⚔️</div>
          <h1 className="login-title">Discipline</h1>
          <p className="login-subtitle">
            A personal discipline game system
          </p>
          
          {error && <div className="error-message">{error}</div>}
          
          <button
            className="btn-google"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
          
          <p className="login-note">
            Track your habits. Build discipline. Level up.
          </p>
        </div>
      </div>
    </div>
  );
};
