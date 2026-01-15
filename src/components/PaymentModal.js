import React, { useState } from 'react';
import apiService from '../services/apiService';
import Icon from './Icon';

const PaymentModal = ({ isOpen, onClose, onConfirm, amount = "0.50", userId }) => {
  const [operationNumber, setOperationNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('yape');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const phoneNumber = '944507095';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!operationNumber.trim()) {
      setError('Por favor ingresa el numero de operacion');
      return;
    }

    if (operationNumber.length < 6) {
      setError('El numero de operacion debe tener al menos 6 digitos');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      // Registrar pago en el backend
      if (userId) {
        await apiService.registerPayment(userId, operationNumber, paymentMethod);
      }

      // Liberar descarga (validacion optimista)
      onConfirm(operationNumber, paymentMethod);
    } catch (error) {
      console.error('Error registrando pago:', error);
      // Aun asi permitir descarga (validacion optimista)
      onConfirm(operationNumber, paymentMethod);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar" type="button">
          <Icon name="x" size={14} />
        </button>

        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-title-icon">
              <Icon name="credit-card" size={18} />
            </span>
            <h2>Completar pago</h2>
          </div>
          <p>Escanea el QR y transfiere el monto indicado</p>
        </div>

        {/* Selector de metodo */}
        <div className="payment-method-selector">
          <button
            className={`method-btn ${paymentMethod === 'yape' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('yape')}
            type="button"
          >
            <span className="method-icon">
              <Icon name="qr" size={16} />
            </span>
            Yape
          </button>
          <button
            className={`method-btn ${paymentMethod === 'plin' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('plin')}
            type="button"
          >
            <span className="method-icon">
              <Icon name="zap" size={16} />
            </span>
            Plin
          </button>
        </div>

        {/* QR Code */}
        <div className="qr-section">
          <div className="qr-container">
            <div className="qr-placeholder">
              {/* QR de Yape/Plin */}
              <div className="qr-image-container">
                {paymentMethod === 'yape' ? (
                  <img
                    src="/yape-qr.png"
                    alt="QR Yape"
                    className="qr-image"
                  />
                ) : (
                  <img
                    src="/plin-qr.png"
                    alt="QR Plin"
                    className="qr-image"
                  />
                )}
              </div>
              <div className="qr-label">
                <span className="qr-label-text">
                  <Icon name="phone" size={14} />
                  {paymentMethod === 'yape' ? 'Yape' : 'Plin'}: {phoneNumber}
                </span>
                <button
                  className="copy-btn"
                  onClick={copyToClipboard}
                  title="Copiar numero"
                  type="button"
                >
                  {copied ? <Icon name="check" size={14} /> : <Icon name="clipboard" size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="payment-amount">
            <span className="amount-label">Monto a transferir:</span>
            <span className="amount-value">S/ {amount}</span>
          </div>
        </div>

        {/* Input numero de operacion */}
        <div className="operation-input-section">
          <label>Numero de operacion</label>
          <input
            type="text"
            value={operationNumber}
            onChange={(e) => {
              setOperationNumber(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="Ingresa el numero de tu transferencia"
            className="operation-input"
            maxLength={20}
          />
          {error && <span className="input-error">{error}</span>}
          <p className="input-hint">
            Lo encuentras en el comprobante de {paymentMethod === 'yape' ? 'Yape' : 'Plin'}
          </p>
        </div>

        {/* Boton confirmar */}
        <button
          className={`btn-confirm-payment ${isProcessing ? 'processing' : ''}`}
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Verificando pago...
            </>
          ) : (
            <>Confirmar y descargar PDF</>
          )}
        </button>

        <div className="modal-footer">
          <p className="security-note">
            <span className="security-icon">
              <Icon name="shield" size={14} />
            </span>
            Tu informacion esta segura. Descarga instantanea al verificar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
