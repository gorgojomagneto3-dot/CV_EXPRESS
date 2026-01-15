import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import './LoginPage.css';

const GOOGLE_CLIENT_ID = '313777843448-u9turk089vgf6at9g2p0i66pcdv7duk4.apps.googleusercontent.com';

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
    <text
      x="200"
      y="90"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="90"
      fontWeight="700"
      fill="#1A237E"
    >
      CV
    </text>
    <rect x="55" y="125" width="25" height="6" fill="#D32F2F" rx="3" />
    <rect x="40" y="140" width="40" height="6" fill="#D32F2F" rx="3" />
    <rect x="60" y="155" width="20" height="6" fill="#D32F2F" rx="3" />
    <text
      x="220"
      y="155"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="45"
      fontStyle="italic"
      fontWeight="700"
      fill="#D32F2F"
    >
      EXPRESS
    </text>
    <path d="M330 145 L360 135 L345 165 Z" fill="#D32F2F" />
    <path
      d="M320 155 Q340 155 345 145"
      stroke="#D32F2F"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const LoginPage = () => {
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoggingIn(true);
      setError('');

      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        token: credentialResponse.credential
      };

      const result = await login(userData);

      if (result.isNewUser) {
        console.log('Nuevo usuario registrado');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setError('Error al iniciar sesion. Intenta de nuevo.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Login Failed');
    setError('No se pudo iniciar sesion con Google. Intenta de nuevo.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-brand-row">
              <LogoMark className="login-logo" />
              <span className="login-hero-tag">ATS READY</span>
            </div>

            <h1 className="login-title">Inicia sesion en CV Express</h1>
            <p className="login-subtitle">Crea tu CV profesional en minutos</p>

            {error && (
              <div className="login-error">
                <Icon name="alert-circle" size={16} />
                <span>{error}</span>
              </div>
            )}

            {isLoggingIn ? (
              <div className="login-loading">
                <div className="loading-spinner"></div>
                <p>Iniciando sesion...</p>
              </div>
            ) : (
              <div className="google-login-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="360"
                  text="continue_with"
                  shape="rectangular"
                  ux_mode="popup"
                />
              </div>
            )}
            <p className="login-terms">
              Al continuar, aceptas nuestros <a href="https://docs.google.com/document/d/e/2PACX-1vQB51fgxzSLqbZm8eJJFsGlFDHpJQPkwqjrSWkzSnnwAY6CH87cD0CFjO0jqcHgIDZKQwH6kgeFEH7N/pub" target="_blank" rel="noopener noreferrer">Términos, Condiciones y Política de Privacidad</a>.
            </p>
            <div className="login-illustration">
              <img
                src="/login.png"
                alt="Ilustracion de equipo creando CV"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

