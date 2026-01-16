import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LogoMark = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 400 200"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="CV Express"
    preserveAspectRatio="xMidYMid meet"
  >
    <title>CV Express</title>
    <text x="200" y="90" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="90" fontWeight="700" fill="#1A237E">CV</text>
    <rect x="55" y="125" width="25" height="6" fill="#D32F2F" rx="3" />
    <rect x="40" y="140" width="40" height="6" fill="#D32F2F" rx="3" />
    <rect x="60" y="155" width="20" height="6" fill="#D32F2F" rx="3" />
    <text x="220" y="155" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="45" fontStyle="italic" fontWeight="700" fill="#D32F2F">EXPRESS</text>
    <path d="M330 145 L360 135 L345 165 Z" fill="#D32F2F" />
    <path d="M320 155 Q340 155 345 145" stroke="#D32F2F" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al restablecer contraseña');
      }

      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-brand-row">
            <LogoMark className="login-logo" />
            <span className="login-hero-tag">ATS READY</span>
          </div>

          <h1 className="login-title">Nueva contraseña</h1>
          <p className="login-subtitle">Ingresa tu nueva contraseña</p>

          {error && (
            <div className="login-error">
              <Icon name="alert-circle" size={16} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="login-success" style={{ flexDirection: 'column', gap: '12px', padding: '24px' }}>
              <Icon name="check" size={32} />
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>¡Contraseña actualizada!</span>
              <span>Redirigiendo al inicio de sesión...</span>
            </div>
          ) : isLoading ? (
            <div className="login-loading">
              <div className="loading-spinner"></div>
              <p>Actualizando contraseña...</p>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="new-password">Nueva contraseña</label>
                <div className="password-input">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-new-password">Confirmar contraseña</label>
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="submit-btn">
                <Icon name="check" size={18} />
                Actualizar contraseña
              </button>

              <button type="button" className="back-link" onClick={() => navigate('/')}>
                <Icon name="arrow-left" size={16} />
                Volver al inicio de sesión
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
