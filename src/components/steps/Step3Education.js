import React, { useState } from 'react';
import Icon from '../Icon';
import { suggestSkills, getAIUsesRemaining, canUseAI } from '../../services/aiService';

// Sugerencias rápidas predefinidas (universales para todo tipo de profesionales)
const QUICK_SKILLS = {
  tecnicas: [
    'Microsoft Office', 'Excel Avanzado', 'Google Workspace', 'Análisis de datos', 
    'Gestión de proyectos', 'Atención al cliente', 'Redacción', 'Investigación',
    'Presentaciones', 'SAP', 'CRM', 'ERP', 'Power BI', 'SQL'
  ],
  blandas: [
    'Liderazgo', 'Trabajo en equipo', 'Comunicación', 'Resolución de problemas',
    'Adaptabilidad', 'Gestión del tiempo', 'Creatividad', 'Pensamiento crítico',
    'Negociación', 'Empatía', 'Proactividad', 'Organización'
  ]
};

const Step3Education = ({ data, onChange }) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccess, setAiSuccess] = useState('');
  const [usesRemaining, setUsesRemaining] = useState(getAIUsesRemaining());
  const [newSkillTecnica, setNewSkillTecnica] = useState('');
  const [newSkillBlanda, setNewSkillBlanda] = useState('');
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

  // Proyectos Adicionales
  const updateProyecto = (index, field, value) => {
    const newProyectos = [...(data.proyectos || [])];
    newProyectos[index] = { ...newProyectos[index], [field]: value };
    onChange({ ...data, proyectos: newProyectos });
  };

  const addProyecto = () => {
    const currentProyectos = data.proyectos || [];
    onChange({
      ...data,
      proyectos: [...currentProyectos, {
        nombre: "",
        descripcion: "",
        tecnologias: ""
      }]
    });
  };

  const removeProyecto = (index) => {
    const currentProyectos = data.proyectos || [];
    if (currentProyectos.length > 1) {
      const newProyectos = currentProyectos.filter((_, i) => i !== index);
      onChange({ ...data, proyectos: newProyectos });
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

  // Agregar una habilidad individual
  const addSkill = (tipo, skill) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) return;
    
    const currentSkills = data.habilidades[tipo] || [];
    // Evitar duplicados (case insensitive)
    if (currentSkills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) return;
    
    onChange({
      ...data,
      habilidades: { ...data.habilidades, [tipo]: [...currentSkills, trimmedSkill] }
    });
  };

  // Eliminar una habilidad
  const removeSkill = (tipo, index) => {
    const newSkills = data.habilidades[tipo].filter((_, i) => i !== index);
    onChange({
      ...data,
      habilidades: { ...data.habilidades, [tipo]: newSkills }
    });
  };

  // Manejar Enter en input de habilidades
  const handleSkillKeyDown = (e, tipo, value, setValue) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(tipo, value);
      setValue('');
    }
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
                    placeholder="2021 o Presente"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
            </div>

            {/* Campo nuevo: Cursos Relevantes */}
            <div className="form-group">
              <label>Cursos relevantes (opcional)</label>
              <div className="input-with-icon">
                <span className="input-icon">
                  <Icon name="book-open" size={16} />
                </span>
                <input
                  type="text"
                  value={edu.cursosRelevantes || ''}
                  onChange={(e) => updateEducacion(index, 'cursosRelevantes', e.target.value)}
                  placeholder="Ej: POO, Bases de Datos, Ingeniería de Software, Estructuras de Datos"
                  className="input-modern with-icon"
                />
              </div>
              <p className="field-hint">Separa los cursos con comas. Esto destaca en CVs de practicantes.</p>
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

          {/* Habilidades Técnicas */}
          <div className="form-group">
            <label>Habilidades técnicas</label>
            <div className="skill-input-wrapper">
              <input
                type="text"
                value={newSkillTecnica}
                onChange={(e) => setNewSkillTecnica(e.target.value)}
                onKeyDown={(e) => handleSkillKeyDown(e, 'tecnicas', newSkillTecnica, setNewSkillTecnica)}
                placeholder="Escribe y presiona Enter para agregar..."
                className="input-modern"
              />
              <button
                type="button"
                className="btn-add-skill"
                onClick={() => {
                  addSkill('tecnicas', newSkillTecnica);
                  setNewSkillTecnica('');
                }}
                disabled={!newSkillTecnica.trim()}
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
            
            {/* Tags de habilidades actuales */}
            <div className="skills-tags-container">
              {data.habilidades.tecnicas.map((skill, i) => (
                <span key={i} className="skill-tag technical removable">
                  {skill}
                  <button
                    type="button"
                    className="skill-remove-btn"
                    onClick={() => removeSkill('tecnicas', i)}
                    title="Eliminar"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </span>
              ))}
              {data.habilidades.tecnicas.length === 0 && (
                <span className="skills-empty">Agrega habilidades técnicas...</span>
              )}
            </div>

            {/* Sugerencias rápidas */}
            <div className="quick-skills">
              <span className="quick-skills-label">Sugerencias:</span>
              <div className="quick-skills-list">
                {QUICK_SKILLS.tecnicas
                  .filter(s => !data.habilidades.tecnicas.some(t => t.toLowerCase() === s.toLowerCase()))
                  .slice(0, 6)
                  .map((skill, i) => (
                    <button
                      key={i}
                      type="button"
                      className="quick-skill-btn"
                      onClick={() => addSkill('tecnicas', skill)}
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Habilidades Blandas */}
          <div className="form-group">
            <label>Habilidades blandas</label>
            <div className="skill-input-wrapper">
              <input
                type="text"
                value={newSkillBlanda}
                onChange={(e) => setNewSkillBlanda(e.target.value)}
                onKeyDown={(e) => handleSkillKeyDown(e, 'blandas', newSkillBlanda, setNewSkillBlanda)}
                placeholder="Escribe y presiona Enter para agregar..."
                className="input-modern"
              />
              <button
                type="button"
                className="btn-add-skill"
                onClick={() => {
                  addSkill('blandas', newSkillBlanda);
                  setNewSkillBlanda('');
                }}
                disabled={!newSkillBlanda.trim()}
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
            
            {/* Tags de habilidades actuales */}
            <div className="skills-tags-container">
              {data.habilidades.blandas.map((skill, i) => (
                <span key={i} className="skill-tag soft removable">
                  {skill}
                  <button
                    type="button"
                    className="skill-remove-btn"
                    onClick={() => removeSkill('blandas', i)}
                    title="Eliminar"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </span>
              ))}
              {data.habilidades.blandas.length === 0 && (
                <span className="skills-empty">Agrega habilidades blandas...</span>
              )}
            </div>

            {/* Sugerencias rápidas */}
            <div className="quick-skills">
              <span className="quick-skills-label">Sugerencias:</span>
              <div className="quick-skills-list">
                {QUICK_SKILLS.blandas
                  .filter(s => !data.habilidades.blandas.some(t => t.toLowerCase() === s.toLowerCase()))
                  .slice(0, 5)
                  .map((skill, i) => (
                    <button
                      key={i}
                      type="button"
                      className="quick-skill-btn soft"
                      onClick={() => addSkill('blandas', skill)}
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
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

      {/* PROYECTOS ADICIONALES - Nueva sección */}
      <div className="step-section">
        <div className="step-header">
          <h2>
            <span className="step-title-icon">
              <Icon name="code" size={18} />
            </span>
            Proyectos Adicionales
          </h2>
          <p className="step-description">Ideal para practicantes y juniors. Muestra tus proyectos personales o académicos.</p>
        </div>

        <div className="projects-list">
          {(data.proyectos || []).map((proy, index) => (
            <div key={index} className="project-card">
              <div className="card-header-with-actions">
                <div className="card-number">{index + 1}</div>
                <h3>Proyecto {index + 1}</h3>
                {(data.proyectos || []).length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-card"
                    onClick={() => removeProyecto(index)}
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Nombre del proyecto <span className="required">*</span></label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="code" size={16} />
                  </span>
                  <input
                    type="text"
                    value={proy.nombre}
                    onChange={(e) => updateProyecto(index, 'nombre', e.target.value)}
                    placeholder="Ej: Sistema de Facturación, Plataforma E-commerce, etc."
                    className="input-modern with-icon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción breve</label>
                <input
                  type="text"
                  value={proy.descripcion || ''}
                  onChange={(e) => updateProyecto(index, 'descripcion', e.target.value)}
                  placeholder="Ej: Sistema de gestión para restaurantes con carta digital QR y pedidos en tiempo real"
                  className="input-modern"
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="btn-add-item compact" onClick={addProyecto}>
          <span>+</span> Agregar proyecto
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

      {/* INFORMACIÓN ADICIONAL - Soft Skills y Disponibilidad */}
      <div className="step-section">
        <div className="step-header">
          <h2>
            <span className="step-title-icon">
              <Icon name="info" size={18} />
            </span>
            Información Adicional
          </h2>
          <p className="step-description">Completa tu perfil con soft skills y disponibilidad</p>
        </div>

        <div className="form-card">
          <div className="form-group">
            <label>Soft Skills</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="users" size={16} />
              </span>
              <input
                type="text"
                value={data.infoAdicional?.softSkills || ''}
                onChange={(e) => onChange({
                  ...data,
                  infoAdicional: { ...data.infoAdicional, softSkills: e.target.value }
                })}
                placeholder="Ej: Trabajo en equipo, Comunicación efectiva, Liderazgo, Proactividad"
                className="input-modern with-icon"
              />
            </div>
            <p className="field-hint">Separa las habilidades blandas con comas</p>
          </div>

          <div className="form-group">
            <label>Disponibilidad</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="clock" size={16} />
              </span>
              <select
                value={data.infoAdicional?.disponibilidad || ''}
                onChange={(e) => onChange({
                  ...data,
                  infoAdicional: { ...data.infoAdicional, disponibilidad: e.target.value }
                })}
                className="input-modern with-icon"
              >
                <option value="">Selecciona tu disponibilidad</option>
                <option value="Inmediata - Tiempo completo">Inmediata - Tiempo completo</option>
                <option value="Inmediata - Medio tiempo">Inmediata - Medio tiempo</option>
                <option value="Inmediata - Tiempo completo o medio tiempo">Inmediata - Tiempo completo o medio tiempo</option>
                <option value="A partir de 2 semanas">A partir de 2 semanas</option>
                <option value="A partir de 1 mes">A partir de 1 mes</option>
                <option value="Solo fines de semana">Solo fines de semana</option>
                <option value="Freelance / Por proyectos">Freelance / Por proyectos</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Education;
