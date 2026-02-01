import React, { useRef } from 'react';
import Icon from '../Icon';

const Step1Profile = ({ data, onChange }) => {
  const fileInputRef = useRef(null);

  const updatePersonalInfo = (field, value) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const updateResumen = (value) => {
    onChange({ ...data, resumenProfesional: value });
  };

  // Manejar subida de foto
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen (JPG, PNG)');
        return;
      }
      // Validar tamaño (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }
      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('foto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('foto', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>
          <span className="step-title-icon">
            <Icon name="user" size={18} />
          </span>
          Informacion personal
        </h2>
        <p className="step-description">Comienza con tus datos de contacto basicos</p>
      </div>

      <div className="form-card">
        {/* Sección de foto de perfil */}
        <div className="photo-upload-section">
          <div className="photo-preview-container">
            {data.personalInfo.foto ? (
              <div className="photo-preview">
                <img src={data.personalInfo.foto} alt="Foto de perfil" />
                <button 
                  type="button" 
                  className="photo-remove-btn"
                  onClick={removePhoto}
                  title="Eliminar foto"
                >
                  <Icon name="x" size={14} />
                </button>
              </div>
            ) : (
              <div 
                className="photo-placeholder"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="camera" size={32} />
                <span>Agregar foto</span>
              </div>
            )}
          </div>
          <div className="photo-upload-info">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              id="photo-input"
            />
            <label htmlFor="photo-input" className="btn-upload-photo">
              <Icon name="upload" size={16} />
              {data.personalInfo.foto ? 'Cambiar foto' : 'Subir foto'}
            </label>
            <p className="photo-hint">JPG o PNG. Máximo 2MB. (Opcional)</p>
          </div>
        </div>

        <div className="form-grid-2col">
          <div className="form-group">
            <label>Nombre completo <span className="required">*</span></label>
            <input
              type="text"
              value={data.personalInfo.nombre}
              onChange={(e) => updatePersonalInfo('nombre', e.target.value)}
              placeholder="Ej: Juan Carlos Perez Garcia"
              className="input-modern"
            />
          </div>
          <div className="form-group">
            <label>Titulo profesional <span className="required">*</span></label>
            <input
              type="text"
              value={data.personalInfo.titulo}
              onChange={(e) => updatePersonalInfo('titulo', e.target.value)}
              placeholder="Ej: Desarrollador Full Stack Senior"
              className="input-modern"
            />
          </div>
        </div>

        <div className="form-grid-2col">
          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="mail" size={16} />
              </span>
              <input
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="tuemail@ejemplo.com"
                className="input-modern with-icon"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Telefono <span className="required">*</span></label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="phone" size={16} />
              </span>
              <input
                type="tel"
                value={data.personalInfo.telefono}
                onChange={(e) => updatePersonalInfo('telefono', e.target.value)}
                placeholder="+51 999 999 999"
                className="input-modern with-icon"
              />
            </div>
          </div>
        </div>

        <div className="form-grid-2col">
          <div className="form-group">
            <label>Ubicacion</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="map-pin" size={16} />
              </span>
              <input
                type="text"
                value={data.personalInfo.ubicacion}
                onChange={(e) => updatePersonalInfo('ubicacion', e.target.value)}
                placeholder="Lima, Peru"
                className="input-modern with-icon"
              />
            </div>
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="link" size={16} />
              </span>
              <input
                type="text"
                value={data.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/tuperfil"
                className="input-modern with-icon"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>GitHub / Portfolio (opcional)</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <Icon name="code" size={16} />
            </span>
            <input
              type="text"
              value={data.personalInfo.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              placeholder="github.com/tuusuario"
              className="input-modern with-icon"
            />
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="card-header-inline">
          <h3 className="section-title">
            <span className="section-title-icon">
              <Icon name="document" size={16} />
            </span>
            Resumen profesional
          </h3>
          <span className="char-count">
            {data.resumenProfesional.split(' ').filter(w => w).length} palabras
          </span>
        </div>
        <p className="field-hint">
          Escribe 2-3 oraciones destacando tu experiencia y fortalezas principales.
        </p>
        <textarea
          value={data.resumenProfesional}
          onChange={(e) => updateResumen(e.target.value)}
          placeholder="Profesional con X anos de experiencia en... Especializado en... Apasionado por..."
          className="textarea-modern"
          rows={5}
        />
      </div>
    </div>
  );
};

export default Step1Profile;
