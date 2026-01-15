import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import CVDocument from './components/CVDocument';
import Icon from './components/Icon';
import Logo from './components/Logo';

import Step1Profile from './components/steps/Step1Profile';
import Step2Experience from './components/steps/Step2Experience';
import Step3Education from './components/steps/Step3Education';
import Step4Finish from './components/steps/Step4Finish';
import PaymentModal from './components/PaymentModal';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { cvData as defaultData } from './data/cvData';
import './styles/App.css';

// Navigation items for header stepper
const navItems = [
  { id: 1, icon: 'user', label: 'Datos personales', shortLabel: 'Datos', section: 'datos' },
  { id: 2, icon: 'briefcase', label: 'Experiencia', shortLabel: 'Exp', section: 'experiencia' },
  { id: 3, icon: 'book-open', label: 'Educacion', shortLabel: 'Educacion', section: 'educacion' },
  { id: 4, icon: 'zap', label: 'Habilidades', shortLabel: 'Habilidades', section: 'habilidades' },
  { id: 5, icon: 'flag', label: 'Finalizar', shortLabel: 'Finalizar', section: 'finalizar' },
];

function CVBuilder() {
  const { user, logout, updateUserPaymentStatus } = useAuth();
  const [cvData, setCvData] = useState(defaultData);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(user?.isPremium || false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewData, setPreviewData] = useState(defaultData);

  const handleDataChange = (newData) => {
    setCvData(newData);
  };

  const goToStep = (step) => {
    if (currentStep !== step && currentStep < step && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const downloadPDF = useCallback(async () => {
    try {
      const fileName = `CV_${cvData.personalInfo.nombre || 'MiCV'}_${new Date().toISOString().split('T')[0]}.pdf`;
      const blob = await pdf(<CVDocument data={cvData} template={selectedTemplate} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar el PDF. Intenta de nuevo.');
    }
  }, [cvData, selectedTemplate]);

  const handlePaymentConfirm = async (operationNumber, method) => {
    console.log('Pago confirmado:', operationNumber, method);
    setIsPaid(true);
    setShowPaymentModal(false);
    // Actualizar estado de premium del usuario
    updateUserPaymentStatus();
    // Descargar PDF automáticamente después del pago
    await downloadPDF();
  };

  useEffect(() => {
    const timer = setTimeout(() => setPreviewData(cvData), 200);
    return () => clearTimeout(timer);
  }, [cvData]);

  const previewDocument = useMemo(
    () => <CVDocument data={previewData} template={selectedTemplate} />,
    [previewData, selectedTemplate]
  );

  const zoomMin = 50;
  const zoomMax = 150;
  const zoomStep = 10;
  const zoomDefault = 100;

  const handleZoom = (delta) => {
    setPreviewZoom((prev) => Math.min(zoomMax, Math.max(zoomMin, prev + delta)));
  };

  const resetZoom = () => {
    setPreviewZoom(zoomDefault);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Profile data={cvData} onChange={handleDataChange} />;
      case 2:
        return <Step2Experience data={cvData} onChange={handleDataChange} />;
      case 3:
      case 4:
        return <Step3Education data={cvData} onChange={handleDataChange} />;
      case 5:
        return (
          <Step4Finish
            data={cvData}
            onChange={handleDataChange}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            onOpenPayment={() => setShowPaymentModal(true)}
          />
        );
      default:
        return <Step1Profile data={cvData} onChange={handleDataChange} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header-new">
        <div className="header-top-row">
          <div className="header-brand">
            <Logo size="small" />
          </div>
          <div className="header-actions">
            {user && (
              <div className="user-menu">
                <div className={`user-avatar-wrapper ${user.isPremium ? 'premium' : ''}`}>
                  {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
                  {user.isPremium && <span className="premium-badge">⭐</span>}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                  {user.isPremium && user.daysRemaining && (
                    <span className="premium-days">{user.daysRemaining} días restantes</span>
                  )}
                </div>
                <button className="btn-logout" onClick={logout}>
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="stepper-bar">
        <div
          className="header-stepper"
          style={{ '--step-progress': `${(100 / (navItems.length - 1)) * (currentStep - 1)}%` }}
        >
          <div className="header-stepper-track">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`header-step-node ${currentStep === item.id ? 'active' : ''} ${completedSteps.includes(item.id) ? 'completed' : ''}`}
              >
                {item.id}
              </div>
            ))}
          </div>
          <div className="header-stepper-status">
            {navItems.map((item) => (
              <div key={item.id} className="header-step-status">
                {completedSteps.includes(item.id) ? (
                  <Icon name="check" size={12} />
                ) : currentStep === item.id ? (
                  <span className="header-step-dot" />
                ) : (
                  <span className="header-step-empty" />
                )}
              </div>
            ))}
          </div>
          <div className="header-stepper-labels">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`header-step-label ${currentStep === item.id ? 'active' : ''}`}
              >
                {item.shortLabel || item.label}
              </div>
            ))}
          </div>
          <div className="header-stepper-pointer">
            {navItems.map((item) => (
              <div key={item.id} className="header-step-pointer">
                {currentStep === item.id ? (
                  <span className="header-step-pointer-text">Estas aqui</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main-split-layout">
        {/* CENTRAL FORM PANEL */}
        <div className="form-panel">
          <div className="form-content-wrapper">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="step-navigation">
              <button
                className="btn-nav btn-prev"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <Icon name="arrow-left" size={16} />
                Anterior
              </button>

              {currentStep < 5 ? (
                <button className="btn-nav btn-next" onClick={nextStep}>
                  Continuar
                  <Icon name="arrow-right" size={16} />
                </button>
              ) : isPaid ? (
                <button
                  className="btn-nav btn-download"
                  onClick={downloadPDF}
                >
                  <Icon name="download" size={16} />
                  Descargar PDF
                </button>
              ) : (
                <button
                  className="btn-nav btn-finish"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <Icon name="credit-card" size={16} />
                  Obtener CV - S/ 0.50
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CV PREVIEW PANEL */}
        <div className="preview-panel">
          <div className="preview-header">
            <div className="preview-title">
              <Icon name="eye" size={18} />
              <span>Vista previa</span>
            </div>
            <div className="preview-template-badge">
              {selectedTemplate === 'classic' && '📄 Clásico'}
              {selectedTemplate === 'modern' && '✨ Moderno'}
              {selectedTemplate === 'minimal' && '◻️ Minimalista'}
            </div>
          </div>
          
          <div className="preview-toolbar">
            <div className="zoom-controls">
              <button
                className="preview-zoom-btn"
                onClick={() => handleZoom(-zoomStep)}
                disabled={previewZoom <= zoomMin}
                title="Alejar"
              >
                <Icon name="minus" size={14} />
              </button>
              <button
                className="preview-zoom-value"
                onClick={resetZoom}
                title="Restablecer a 100%"
              >
                {previewZoom}%
              </button>
              <button
                className="preview-zoom-btn"
                onClick={() => handleZoom(zoomStep)}
                disabled={previewZoom >= zoomMax}
                title="Acercar"
              >
                <Icon name="plus" size={14} />
              </button>
            </div>
            {isPaid && (
              <button className="preview-download-btn" onClick={downloadPDF} title="Descargar PDF">
                <Icon name="download" size={14} />
                <span>Descargar</span>
              </button>
            )}
          </div>

          <div className="preview-container">
            <div className="preview-page-indicator">
              <Icon name="document" size={12} />
              <span>Página 1 de 1</span>
            </div>
            <div
              className="cv-preview-wrapper"
              style={{ transform: `scale(${previewZoom / 100})` }}
            >
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={false}
                className="pdf-viewer"
              >
                {previewDocument}
              </PDFViewer>
            </div>
          </div>

          <div className="preview-footer">
            <div className="preview-tip">
              <Icon name="lightbulb" size={14} />
              <span>Los cambios se reflejan en tiempo real</span>
            </div>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        userId={user?.mongoId}
      />
    </div>
  );
}

// Main App with Auth
function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return isAuthenticated ? <CVBuilder /> : <LoginPage />;
}

// Wrapper with AuthProvider
function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
