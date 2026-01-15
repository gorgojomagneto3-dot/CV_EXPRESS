import React from 'react';
import Icon from '../Icon';

const Step2Experience = ({ data, onChange }) => {
  const updateExperiencia = (index, field, value) => {
    const newExp = [...data.experiencia];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experiencia: newExp });
  };

  const updateLogro = (expIndex, logroIndex, value) => {
    const newExp = [...data.experiencia];
    newExp[expIndex].logros[logroIndex] = value;
    onChange({ ...data, experiencia: newExp });
  };

  const addExperiencia = () => {
    onChange({
      ...data,
      experiencia: [...data.experiencia, {
        puesto: "",
        empresa: "",
        ubicacion: "",
        fechaInicio: "",
        fechaFin: "",
        logros: [""]
      }]
    });
  };

  const removeExperiencia = (index) => {
    if (data.experiencia.length > 1) {
      const newExp = data.experiencia.filter((_, i) => i !== index);
      onChange({ ...data, experiencia: newExp });
    }
  };

  const addLogro = (expIndex) => {
    const newExp = [...data.experiencia];
    newExp[expIndex].logros.push("");
    onChange({ ...data, experiencia: newExp });
  };

  const removeLogro = (expIndex, logroIndex) => {
    if (data.experiencia[expIndex].logros.length > 1) {
      const newExp = [...data.experiencia];
      newExp[expIndex].logros = newExp[expIndex].logros.filter((_, i) => i !== logroIndex);
      onChange({ ...data, experiencia: newExp });
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>
          <span className="step-title-icon">
            <Icon name="briefcase" size={18} />
          </span>
          Experiencia profesional
        </h2>
        <p className="step-description">Agrega tus trabajos mas relevantes, empezando por el mas reciente</p>
      </div>

      <div className="experience-list">
        {data.experiencia.map((exp, index) => (
          <div key={index} className="experience-card">
            <div className="card-header-with-actions">
              <div className="card-number">{index + 1}</div>
              <h3>Experiencia {index + 1}</h3>
              {data.experiencia.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-card"
                  onClick={() => removeExperiencia(index)}
                  title="Eliminar experiencia"
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label>Puesto / Cargo <span className="required">*</span></label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="briefcase" size={16} />
                  </span>
                  <input
                    type="text"
                    value={exp.puesto}
                    onChange={(e) => updateExperiencia(index, 'puesto', e.target.value)}
                    placeholder="Ej: Desarrollador Senior"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Empresa <span className="required">*</span></label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="building" size={16} />
                  </span>
                  <input
                    type="text"
                    value={exp.empresa}
                    onChange={(e) => updateExperiencia(index, 'empresa', e.target.value)}
                    placeholder="Nombre de la empresa"
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
                    value={exp.ubicacion}
                    onChange={(e) => updateExperiencia(index, 'ubicacion', e.target.value)}
                    placeholder="Ciudad, Pais"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Fecha inicio</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="calendar" size={16} />
                  </span>
                  <input
                    type="text"
                    value={exp.fechaInicio}
                    onChange={(e) => updateExperiencia(index, 'fechaInicio', e.target.value)}
                    placeholder="Ej: Enero 2023"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Fecha fin</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Icon name="calendar" size={16} />
                  </span>
                  <input
                    type="text"
                    value={exp.fechaFin}
                    onChange={(e) => updateExperiencia(index, 'fechaFin', e.target.value)}
                    placeholder="Presente"
                    className="input-modern with-icon"
                  />
                </div>
              </div>
            </div>

            <div className="logros-section">
              <label>Logros y responsabilidades</label>
              <p className="field-hint">Usa verbos de accion: Desarrollo, Implemente, Lidere, Optimize...</p>

              {exp.logros.map((logro, logroIndex) => (
                <div key={logroIndex} className="logro-input-row">
                  <span className="logro-bullet" aria-hidden="true"></span>
                  <input
                    type="text"
                    value={logro}
                    onChange={(e) => updateLogro(index, logroIndex, e.target.value)}
                    placeholder="Describe un logro o responsabilidad clave"
                    className="input-modern logro-input"
                  />
                  {exp.logros.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-logro"
                      onClick={() => removeLogro(index, logroIndex)}
                    >
                      <Icon name="x" size={12} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn-add-logro"
                onClick={() => addLogro(index)}
              >
                <span className="btn-icon">+</span>
                Agregar logro
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-add-experience"
        onClick={addExperiencia}
      >
        <span className="btn-icon-large">+</span>
        <span>Agregar otra experiencia</span>
      </button>
    </div>
  );
};

export default Step2Experience;
