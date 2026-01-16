import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import './LoginPage.css';

const GOOGLE_CLIENT_ID = '313777843448-u9turk089vgf6at9g2p0i66pcdv7duk4.apps.googleusercontent.com';
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

const LoginPage = () => {
  const { login } = useAuth();
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setSuccess('');
  };

  const switchView = (newView) => {
    resetForm();
    setView(newView);
  };

  // Login con email
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Login exitoso
      const userData = {
        ...data.user,
        mongoId: data.user.id,
        authProvider: 'email'
      };

      await login(userData, 'email');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Registro con email
  const handleRegister = async (e) => {
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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      // Registro exitoso - login automático
      const userData = {
        ...data.user,
        mongoId: data.user.id,
        authProvider: 'email'
      };

      await login(userData, 'email');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Olvidé contraseña
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar email');
      }

      setSuccess('Si el email existe, recibirás instrucciones para restablecer tu contraseña.');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Login con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError('');

      const decoded = jwtDecode(credentialResponse.credential);
      
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión con Google');
      }

      const userData = {
        ...data.user,
        mongoId: data.user.id,
        token: credentialResponse.credential,
        authProvider: 'google'
      };

      await login(userData, 'google');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-page">
        <div className="login-card-container">
          {/* Panel Izquierdo - Ilustración */}
          <div className="login-illustration-panel">
            <img 
              src="/login.svg" 
              alt="Profesional con CV" 
              className="login-illustration"
            />
          </div>

          {/* Panel Derecho - Formulario */}
          <div className="login-form-panel">
            <div className="login-logo-wrapper">
              <LogoMark className="login-logo" />
            </div>

            <div className="login-header">
              <h1 className="login-title">
                {view === 'login' && 'Inicia sesión'}
                {view === 'register' && 'Crear cuenta'}
                {view === 'forgot' && 'Recuperar contraseña'}
              </h1>
              <p className="login-subtitle">
                {view === 'login' && 'Accede a tu cuenta de CV Express'}
                {view === 'register' && 'Crea tu CV profesional en minutos'}
                {view === 'forgot' && 'Te enviaremos un enlace para restablecer tu contraseña'}
              </p>
            </div>

            {error && (
              <div className="login-error">
                <Icon name="alert-circle" size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="login-success">
                <Icon name="check" size={16} />
                <span>{success}</span>
              </div>
            )}

            {isLoading ? (
              <div className="login-loading">
                <div className="loading-spinner"></div>
                <p>
                  {view === 'login' && 'Iniciando sesión...'}
                  {view === 'register' && 'Creando cuenta...'}
                  {view === 'forgot' && 'Enviando email...'}
                </p>
              </div>
            ) : (
              <>
                {/* LOGIN FORM */}
                {view === 'login' && (
                  <form className="login-form" onSubmit={handleEmailLogin}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="password">Contraseña</label>
                      <div className="password-input">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          autoComplete="current-password"
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

                    <button type="button" className="forgot-link" onClick={() => switchView('forgot')}>
                      ¿Olvidaste tu contraseña?
                    </button>

                    <button type="submit" className="submit-btn">
                      Iniciar sesión
                    </button>
                  </form>
                )}

                {/* REGISTER FORM */}
                {view === 'register' && (
                  <form className="login-form" onSubmit={handleRegister}>
                    <div className="form-group">
                      <label htmlFor="name">Nombre completo</label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        required
                        autoComplete="name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-email">Email</label>
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="reg-password">Contraseña</label>
                      <div className="password-input">
                        <input
                          id="reg-password"
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
                      <label htmlFor="confirm-password">Confirmar contraseña</label>
                      <input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite tu contraseña"
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    <button type="submit" className="submit-btn">
                      Crear cuenta
                    </button>
                  </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {view === 'forgot' && (
                  <form className="login-form" onSubmit={handleForgotPassword}>
                    <div className="form-group">
                      <label htmlFor="forgot-email">Email</label>
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        autoComplete="email"
                      />
                    </div>

                    <button type="submit" className="submit-btn">
                      Enviar instrucciones
                    </button>

                    <button type="button" className="back-link" onClick={() => switchView('login')}>
                      <Icon name="arrow-left" size={16} />
                      Volver al inicio de sesión
                    </button>
                  </form>
                )}

                {/* Divider + Google */}
                {view !== 'forgot' && (
                  <>
                    <div className="login-divider">
                      <span>o continúa con</span>
                    </div>

                    <div className="google-login-wrapper">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        width="100%"
                        ux_mode="popup"
                      />
                    </div>

                    <div className="login-switch">
                      {view === 'login' ? (
                        <p>
                          ¿No tienes cuenta?{' '}
                          <button type="button" onClick={() => switchView('register')}>
                            Regístrate
                          </button>
                        </p>
                      ) : (
                        <p>
                          ¿Ya tienes cuenta?{' '}
                          <button type="button" onClick={() => switchView('login')}>
                            Inicia sesión
                          </button>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            <div className="login-footer">
              <span className="login-quality-tag">ATS READY</span>
              <p className="login-terms">
                Al continuar, aceptas nuestros{' '}
                <a href="https://docs.google.com/document/d/e/2PACX-1vQB51fgxzSLqbZm8eJJFsGlFDHpJQPkwqjrSWkzSnnwAY6CH87cD0CFjO0jqcHgIDZKQwH6kgeFEH7N/pub" target="_blank" rel="noopener noreferrer">
                  Términos y Política de Privacidad
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

