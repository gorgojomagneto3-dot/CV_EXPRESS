import React from 'react';
import Icon from '../Icon';

const templates = [
  { id: 'classic', name: 'Clasico', description: 'Diseno tradicional y profesional', color: '#1e40af', popular: true },
  { id: 'modern', name: 'Moderno', description: 'Lineas limpias y contemporaneo', color: '#7c3aed', popular: false },
  { id: 'minimal', name: 'Minimalista', description: 'Simple y elegante', color: '#374151', popular: false },
];

const Step4Finish = ({ data, onChange, selectedTemplate, onTemplateSelect, onOpenPayment }) => {
  return (
    <div className="step-content step-finish">
      <div className="step-header">
        <h2>
          <span className="step-title-icon">
            <Icon name="flag" size={18} />
          </span>
          Casi listo
        </h2>
        <p className="step-description">Selecciona tu plantilla y descarga tu CV profesional</p>
      </div>

      {/* Resumen de CV */}
      <div className="cv-summary-card">
        <div className="summary-header">
          <span className="summary-icon">
            <Icon name="document" size={18} />
          </span>
          <h3>Resumen de tu CV</h3>
        </div>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{data.experiencia.filter(e => e.puesto).length}</span>
            <span className="stat-label">Experiencias</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{data.educacion.filter(e => e.titulo).length}</span>
            <span className="stat-label">Formacion</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{data.habilidades.tecnicas.length}</span>
            <span className="stat-label">Habilidades</span>
          </div>
        </div>
      </div>

      {/* Selector de Plantillas */}
      <div className="templates-section">
        <h3 className="section-title">
          <span className="section-title-icon">
            <Icon name="layout" size={16} />
          </span>
          Elige tu plantilla
        </h3>
        <div className="templates-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
              onClick={() => onTemplateSelect(template.id)}
            >
              {template.popular && <span className="popular-badge">Popular</span>}
              <div
                className={`template-preview ${template.id}`}
                style={{ borderTopColor: template.color }}
              >
                <div className="template-preview-lines">
                  <div className="preview-line header" style={{ backgroundColor: template.color }}></div>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <div className="template-info">
                <h4>{template.name}</h4>
                <p>{template.description}</p>
              </div>
              <div className={`template-check ${selectedTemplate === template.id ? 'visible' : ''}`}>
                <Icon name="check" size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Precio y CTA */}
      <div className="pricing-section">
        <div className="price-card">
          <div className="price-info">
            <span className="price-label">Precio unico</span>
            <div className="price-amount">
              <span className="currency">S/</span>
              <span className="amount">0.50</span>
            </div>
            <span className="price-note">Descarga ilimitada por 7 dias</span>
          </div>

          <div className="price-features">
            <div className="feature-item">
              <span className="feature-icon">
                <Icon name="check" size={14} />
              </span>
              PDF de alta calidad
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <Icon name="check" size={14} />
              </span>
              Optimizado para ATS
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <Icon name="check" size={14} />
              </span>
              Ediciones ilimitadas
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <Icon name="check" size={14} />
              </span>
              Sin marca de agua
            </div>
          </div>

          <button
            className="btn-payment"
            onClick={onOpenPayment}
          >
            <span className="btn-payment-icon">
              <Icon name="qr" size={18} />
            </span>
            Pagar con Yape / Plin
          </button>

          <p className="payment-security">
            <span className="security-icon">
              <Icon name="shield" size={14} />
            </span>
            Pago seguro - Descarga instantanea
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step4Finish;
