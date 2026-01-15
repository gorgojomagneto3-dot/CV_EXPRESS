import React from 'react';

const CVForm = ({ data, onChange }) => {
  
  const updatePersonalInfo = (field, value) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const updateResumen = (value) => {
    onChange({ ...data, resumenProfesional: value });
  };

  const updateExperiencia = (index, field, value) => {
    const newExp = [...data.experiencia];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experiencia: newExp });
  };

  const updateExperienciaLogros = (expIndex, logroIndex, value) => {
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
    const newExp = data.experiencia.filter((_, i) => i !== index);
    onChange({ ...data, experiencia: newExp });
  };

  const addLogro = (expIndex) => {
    const newExp = [...data.experiencia];
    newExp[expIndex].logros.push("");
    onChange({ ...data, experiencia: newExp });
  };

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
    const newEdu = data.educacion.filter((_, i) => i !== index);
    onChange({ ...data, educacion: newEdu });
  };

  const updateHabilidades = (tipo, value) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    onChange({
      ...data,
      habilidades: { ...data.habilidades, [tipo]: skills }
    });
  };

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
    const newIdiomas = data.idiomas.filter((_, i) => i !== index);
    onChange({ ...data, idiomas: newIdiomas });
  };

  return (
    <div className="cv-form">
      
      {/* Información Personal */}
      <section className="form-section-group">
        <h2> Información Personal</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={data.personalInfo.nombre}
              onChange={(e) => updatePersonalInfo('nombre', e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>
          <div className="form-group">
            <label>Título Profesional</label>
            <input
              type="text"
              value={data.personalInfo.titulo}
              onChange={(e) => updatePersonalInfo('titulo', e.target.value)}
              placeholder="Ej: Desarrollador Full Stack"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="tuemail@ejemplo.com"
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={data.personalInfo.telefono}
              onChange={(e) => updatePersonalInfo('telefono', e.target.value)}
              placeholder="+51 999 999 999"
            />
          </div>
          <div className="form-group">
            <label>Ubicación</label>
            <input
              type="text"
              value={data.personalInfo.ubicacion}
              onChange={(e) => updatePersonalInfo('ubicacion', e.target.value)}
              placeholder="Ciudad, País"
            />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="text"
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/tuperfil"
            />
          </div>
        </div>
      </section>

      {/* Resumen Profesional */}
      <section className="form-section-group">
        <h2> Resumen Profesional</h2>
        <div className="form-group">
          <textarea
            value={data.resumenProfesional}
            onChange={(e) => updateResumen(e.target.value)}
            placeholder="Describe brevemente tu perfil profesional, experiencia y objetivos..."
            rows={4}
          />
        </div>
      </section>

      {/* Experiencia */}
      <section className="form-section-group">
        <h2> Experiencia Laboral</h2>
        {data.experiencia.map((exp, index) => (
          <div key={index} className="card">
            <div className="card-header">
              <span>Experiencia {index + 1}</span>
              {data.experiencia.length > 1 && (
                <button 
                  type="button" 
                  className="btn-remove"
                  onClick={() => removeExperiencia(index)}
                >
                  x
                </button>
              )}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Puesto</label>
                <input
                  type="text"
                  value={exp.puesto}
                  onChange={(e) => updateExperiencia(index, 'puesto', e.target.value)}
                  placeholder="Título del puesto"
                />
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input
                  type="text"
                  value={exp.empresa}
                  onChange={(e) => updateExperiencia(index, 'empresa', e.target.value)}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  value={exp.ubicacion}
                  onChange={(e) => updateExperiencia(index, 'ubicacion', e.target.value)}
                  placeholder="Ciudad, País"
                />
              </div>
              <div className="form-group form-group-half">
                <label>Fecha Inicio</label>
                <input
                  type="text"
                  value={exp.fechaInicio}
                  onChange={(e) => updateExperiencia(index, 'fechaInicio', e.target.value)}
                  placeholder="Ej: Enero 2023"
                />
              </div>
              <div className="form-group form-group-half">
                <label>Fecha Fin</label>
                <input
                  type="text"
                  value={exp.fechaFin}
                  onChange={(e) => updateExperiencia(index, 'fechaFin', e.target.value)}
                  placeholder="Ej: Presente"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Logros / Responsabilidades</label>
              {exp.logros.map((logro, logroIndex) => (
                <input
                  key={logroIndex}
                  type="text"
                  value={logro}
                  onChange={(e) => updateExperienciaLogros(index, logroIndex, e.target.value)}
                  placeholder="Describe un logro o responsabilidad"
                  style={{ marginBottom: '8px' }}
                />
              ))}
              <button 
                type="button" 
                className="btn-add-small"
                onClick={() => addLogro(index)}
              >
                + Agregar logro
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addExperiencia}>
          + Agregar Experiencia
        </button>
      </section>

      {/* Educación */}
      <section className="form-section-group">
        <h2> Educación</h2>
        {data.educacion.map((edu, index) => (
          <div key={index} className="card">
            <div className="card-header">
              <span>Educación {index + 1}</span>
              {data.educacion.length > 1 && (
                <button 
                  type="button" 
                  className="btn-remove"
                  onClick={() => removeEducacion(index)}
                >
                  x
                </button>
              )}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Título / Carrera</label>
                <input
                  type="text"
                  value={edu.titulo}
                  onChange={(e) => updateEducacion(index, 'titulo', e.target.value)}
                  placeholder="Ej: Ingeniería de Sistemas"
                />
              </div>
              <div className="form-group">
                <label>Institución</label>
                <input
                  type="text"
                  value={edu.institucion}
                  onChange={(e) => updateEducacion(index, 'institucion', e.target.value)}
                  placeholder="Nombre de la universidad/instituto"
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  value={edu.ubicacion}
                  onChange={(e) => updateEducacion(index, 'ubicacion', e.target.value)}
                  placeholder="Ciudad, País"
                />
              </div>
              <div className="form-group form-group-half">
                <label>Año Inicio</label>
                <input
                  type="text"
                  value={edu.fechaInicio}
                  onChange={(e) => updateEducacion(index, 'fechaInicio', e.target.value)}
                  placeholder="2017"
                />
              </div>
              <div className="form-group form-group-half">
                <label>Año Fin</label>
                <input
                  type="text"
                  value={edu.fechaFin}
                  onChange={(e) => updateEducacion(index, 'fechaFin', e.target.value)}
                  placeholder="2021"
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addEducacion}>
          + Agregar Educación
        </button>
      </section>

      {/* Habilidades */}
      <section className="form-section-group">
        <h2>️ Habilidades</h2>
        <div className="form-group">
          <label>Habilidades Técnicas (separadas por coma)</label>
          <input
            type="text"
            value={data.habilidades.tecnicas.join(', ')}
            onChange={(e) => updateHabilidades('tecnicas', e.target.value)}
            placeholder="JavaScript, React, Node.js, Python..."
          />
        </div>
        <div className="form-group">
          <label>Habilidades Blandas (separadas por coma)</label>
          <input
            type="text"
            value={data.habilidades.blandas.join(', ')}
            onChange={(e) => updateHabilidades('blandas', e.target.value)}
            placeholder="Trabajo en equipo, Liderazgo, Comunicación..."
          />
        </div>
      </section>

      {/* Certificaciones */}
      <section className="form-section-group">
        <h2> Certificaciones</h2>
        {data.certificaciones.map((cert, index) => (
          <div key={index} className="card card-small">
            <div className="card-header">
              <span>Certificación {index + 1}</span>
              <button 
                type="button" 
                className="btn-remove"
                onClick={() => removeCertificacion(index)}
              >
                x
              </button>
            </div>
            <div className="form-grid-3">
              <input
                type="text"
                value={cert.nombre}
                onChange={(e) => updateCertificacion(index, 'nombre', e.target.value)}
                placeholder="Nombre certificación"
              />
              <input
                type="text"
                value={cert.institucion}
                onChange={(e) => updateCertificacion(index, 'institucion', e.target.value)}
                placeholder="Institución"
              />
              <input
                type="text"
                value={cert.fecha}
                onChange={(e) => updateCertificacion(index, 'fecha', e.target.value)}
                placeholder="Año"
              />
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addCertificacion}>
          + Agregar Certificación
        </button>
      </section>

      {/* Idiomas */}
      <section className="form-section-group">
        <h2> Idiomas</h2>
        {data.idiomas.map((idioma, index) => (
          <div key={index} className="card card-small">
            <div className="card-header">
              <span>Idioma {index + 1}</span>
              {data.idiomas.length > 1 && (
                <button 
                  type="button" 
                  className="btn-remove"
                  onClick={() => removeIdioma(index)}
                >
                  x
                </button>
              )}
            </div>
            <div className="form-grid-2">
              <input
                type="text"
                value={idioma.idioma}
                onChange={(e) => updateIdioma(index, 'idioma', e.target.value)}
                placeholder="Idioma"
              />
              <select
                value={idioma.nivel}
                onChange={(e) => updateIdioma(index, 'nivel', e.target.value)}
              >
                <option value="">Seleccionar nivel</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Nativo">Nativo</option>
              </select>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addIdioma}>
          + Agregar Idioma
        </button>
      </section>

    </div>
  );
};

export default CVForm;
