import React, { useState } from 'react';
import Icon from '../Icon';
import { suggestSkills, getAIUsesRemaining, canUseAI } from '../../services/aiService';

const Step3Education = ({ data, onChange }) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccess, setAiSuccess] = useState('');
  const [usesRemaining, setUsesRemaining] = useState(getAIUsesRemaining());
  // Educacion
  const updateEducacion = (index, field, value) => {
    const newEdu = [...data.educacion];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, educacion: newEdu });
  };

  const addEducacion = () => {
    onChange({
      ...data,
      educacion: [...data.educacion, {
        titulo: "",
        institucion: "",
        ubicacion: "",
        fechaInicio: "",
        fechaFin: ""
      }]
    });
  };

  const removeEducacion = (index) => {
    if (data.educacion.length > 1) {
      const newEdu = data.educacion.filter((_, i) => i !== index);
      onChange({ ...data, educacion: newEdu });
    }
  };

  // Habilidades
  const updateHabilidades = (tipo, value) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    onChange({
      ...data,
      habilidades: { ...data.habilidades, [tipo]: skills }
    });
  };

  // Idiomas
  const updateIdioma = (index, field, value) => {
    const newIdiomas = [...data.idiomas];
    newIdiomas[index] = { ...newIdiomas[index], [field]: value };
    onChange({ ...data, idiomas: newIdiomas });
  };

  const addIdioma = () => {
    onChange({
      ...data,
      idiomas: [...data.idiomas, { idioma: "", nivel: "" }]
    });
  };

  const removeIdioma = (index) => {
    if (data.idiomas.length > 1) {
      const newIdiomas = data.idiomas.filter((_, i) => i !== index);
      onChange({ ...data, idiomas: newIdiomas });
    }
  };

  // Certificaciones
  const updateCertificacion = (index, field, value) => {
    const newCert = [...data.certificaciones];
    newCert[index] = { ...newCert[index], [field]: value };
    onChange({ ...data, certificaciones: newCert });
  };

  const addCertificacion = () => {
    onChange({
      ...data,
      certificaciones: [...data.certificaciones, {
        nombre: "",
        institucion: "",
        fecha: ""
      }]
    });
  };

  const removeCertificacion = (index) => {
    const newCert = data.certificaciones.filter((_, i) => i !== index);
    onChange({ ...data, certificaciones: newCert });
  };

  // Sugerir habilidades con IA
  const handleSuggestSkills = async () => {
    if (!canUseAI()) {
      setAiError('Has alcanzado el límite de 5 sugerencias diarias. Vuelve mañana.');
      return;
    }

    setIsLoadingAI(true);
    setAiError('');
    setAiSuccess('');

    try {
      const result = await suggestSkills(data);
      
      // Combinar habilidades existentes con las sugeridas (sin duplicados)
      const currentTecnicas = data.habilidades.tecnicas || [];
      const currentBlandas = data.habilidades.blandas || [];
      
      const newTecnicas = [...new Set([...currentTecnicas, ...result.tecnicas])];
      const newBlandas = [...new Set([...currentBlandas, ...result.blandas])];
      
      onChange({
        ...data,
        habilidades: {
          tecnicas: newTecnicas,
          blandas: newBlandas
        }
      });

      setUsesRemaining(result.usesRemaining);
      setAiSuccess(`¡Sugerencias añadidas! Te quedan ${result.usesRemaining} usos hoy.`);
      
      setTimeout(() => setAiSuccess(''), 5000);
    } catch (error) {
      setAiError(error.message);
      setTimeout(() => setAiError(''), 5000);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="step-content">
      {/* Educacion */}
      <div className="step-header">
        <h2>
          <span className="step-title-icon">
            <Icon name="book-open" size={18} />
          </span>
          Educacion
        </h2>
        <p className="step-description">Tu formacion academica y titulos obtenidos</p>
      </div>

      <div className="education-list">
        {data.educacion.map((edu, index) => (
          <div key={index} className="education-card">
            <div className="card-header-with-actions">
              <div className="card-number">{index + 1}</div>
              <h3>Formacion {index + 1}</h3>
              {data.educacion.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-card"
                  onClick={() => removeEducacion(index)}
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label>Titulo / Carrera <span className="required">*</span></label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="book-open" size={16} />
                  </span>
                  <input
                    type="text"
                    value={edu.titulo}
                    onChange={(e) => updateEducacion(index, 'titulo', e.target.value)}
                    placeholder="Ej: Ingenieria de Sistemas"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Institucion <span className="required">*</span></label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="building" size={16} />
                  </span>
                  <input
                    type="text"
                    value={edu.institucion}
                    onChange={(e) => updateEducacion(index, 'institucion', e.target.value)}
                    placeholder="Universidad / Instituto"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-3col">
              <div className="form-group">
                <label>Ubicacion</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="map-pin" size={16} />
                  </span>
                  <input
                    type="text"
                    value={edu.ubicacion}
                    onChange={(e) => updateEducacion(index, 'ubicacion', e.target.value)}
                    placeholder="Ciudad, Pais"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Ano inicio</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="calendar" size={16} />
                  </span>
                  <input
                    type="text"
                    value={edu.fechaInicio}
                    onChange={(e) => updateEducacion(index, 'fechaInicio', e.target.value)}
                    placeholder="2017"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Ano fin</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="calendar" size={16} />
                  </span>
                  <input
                    type="text"
                    value={edu.fechaFin}
                    onChange={(e) => updateEducacion(index, 'fechaFin', e.target.value)}
                    placeholder="2021"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn-add-item" onClick={addEducacion}>
          <span>+</span> Agregar formacion
        </button>
      </div>

      {/* Habilidades */}
      <div className="step-section">
        <div className="step-header">
          <h2>
            <span className="step-title-icon">
              <Icon name="zap" size={18} />
            </span>
            Habilidades
          </h2>
          <p className="step-description">Separa cada habilidad con una coma</p>
        </div>

        <div className="form-card">
          {/* Botón de sugerencia IA */}
          <div className="ai-suggestion-box">
            <div className="ai-suggestion-header">
              <div className="ai-badge">
                <Icon name="sparkles" size={16} />
                <span>Sugerencia IA</span>
              </div>
              <span className="ai-uses-badge">
                {usesRemaining} usos restantes hoy
              </span>
            </div>
            <p className="ai-description">
              Genera habilidades personalizadas basadas en tu experiencia y educación.
            </p>
            <button
              type="button"
              className={`btn-ai-suggest ${isLoadingAI ? 'loading' : ''}`}
              onClick={handleSuggestSkills}
              disabled={isLoadingAI || !canUseAI()}
            >
              {isLoadingAI ? (
                <>
                  <span className="spinner-small"></span>
                  Generando...
                </>
              ) : (
                <>
                  <Icon name="sparkles" size={16} />
                  Sugerir habilidades con IA
                </>
              )}
            </button>
            {aiError && <div className="ai-error">{aiError}</div>}
            {aiSuccess && <div className="ai-success">{aiSuccess}</div>}
          </div>

          <div className="form-group">
            <label>Habilidades tecnicas</label>
            <input
              type="text"
              value={data.habilidades.tecnicas.join(', ')}
              onChange={(e) => updateHabilidades('tecnicas', e.target.value)}
              placeholder="JavaScript, React, Node.js, Python, SQL, Git..."
              className="input-modern"
            />
            <div className="skills-preview">
              {data.habilidades.tecnicas.map((skill, i) => (
                <span key={i} className="skill-tag technical">{skill}</span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Habilidades blandas</label>
            <input
              type="text"
              value={data.habilidades.blandas.join(', ')}
              onChange={(e) => updateHabilidades('blandas', e.target.value)}
              placeholder="Liderazgo, Trabajo en equipo, Comunicacion..."
              className="input-modern"
            />
            <div className="skills-preview">
              {data.habilidades.blandas.map((skill, i) => (
                <span key={i} className="skill-tag soft">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Idiomas */}
      <div className="step-section">
        <div className="step-header">
          <h2>
            <span className="step-title-icon">
              <Icon name="globe" size={18} />
            </span>
            Idiomas
          </h2>
        </div>

        <div className="languages-grid">
          {data.idiomas.map((idioma, index) => (
            <div key={index} className="language-card">
              <div className="language-inputs">
                <div className="input-with-icon" style={{ flex: 1 }}>
                  <span className="input-icon">
                    <Icon name="globe" size={16} />
                  </span>
                  <input
                    type="text"
                    value={idioma.idioma}
                    onChange={(e) => updateIdioma(index, 'idioma', e.target.value)}
                    placeholder="Idioma"
                    className="input-modern with-icon"
                    style={{ width: '100%' }}
                  />
                </div>
                <select
                  value={idioma.nivel}
                  onChange={(e) => updateIdioma(index, 'nivel', e.target.value)}
                  className="input-modern"
                >
                  <option value="">Nivel</option>
                  <option value="Basico">Basico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </div>
              {data.idiomas.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-small"
                  onClick={() => removeIdioma(index)}
                >
                  <Icon name="x" size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="btn-add-item compact" onClick={addIdioma}>
          <span>+</span> Agregar idioma
        </button>
      </div>

      {/* Certificaciones */}
      <div className="step-section">
        <div className="step-header">
          <h2>
            <span className="step-title-icon">
              <Icon name="award" size={18} />
            </span>
            Certificaciones (Opcional)
          </h2>
        </div>

        <div className="certifications-list">
          {data.certificaciones.map((cert, index) => (
            <div key={index} className="certification-card">
              <div className="form-grid-3col">
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="award" size={16} />
                  </span>
                  <input
                    type="text"
                    value={cert.nombre}
                    onChange={(e) => updateCertificacion(index, 'nombre', e.target.value)}
                    placeholder="Nombre del certificado"
                    className="input-modern with-icon"
                  />
                </div>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="building" size={16} />
                  </span>
                  <input
                    type="text"
                    value={cert.institucion}
                    onChange={(e) => updateCertificacion(index, 'institucion', e.target.value)}
                    placeholder="Institucion"
                    className="input-modern with-icon"
                  />
                </div>
                <div className="cert-date-row">
                  <div className="input-with-icon" style={{ flex: 1 }}>
                    <span className="input-icon">
                      <Icon name="calendar" size={16} />
                    </span>
                    <input
                      type="text"
                      value={cert.fecha}
                      onChange={(e) => updateCertificacion(index, 'fecha', e.target.value)}
                      placeholder="Ano"
                      className="input-modern with-icon"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-remove-small"
                    onClick={() => removeCertificacion(index)}
                  >
                    <Icon name="x" size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="btn-add-item compact" onClick={addCertificacion}>
          <span>+</span> Agregar certificacion
        </button>
      </div>
    </div>
  );
};

export default Step3Education;
