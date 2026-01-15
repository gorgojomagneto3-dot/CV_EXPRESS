import React, { useMemo } from 'react';
import Icon from './Icon';

const ATSScoreWidget = ({ data }) => {
  const score = useMemo(() => {
    let points = 0;
    const maxPoints = 100;

    // Informacion personal (25 puntos)
    if (data.personalInfo.nombre) points += 5;
    if (data.personalInfo.titulo) points += 5;
    if (data.personalInfo.email) points += 5;
    if (data.personalInfo.telefono) points += 5;
    if (data.personalInfo.linkedin) points += 5;

    // Resumen profesional (15 puntos)
    if (data.resumenProfesional) {
      const wordCount = data.resumenProfesional.split(' ').length;
      if (wordCount >= 20) points += 15;
      else if (wordCount >= 10) points += 10;
      else if (wordCount > 0) points += 5;
    }

    // Experiencia (25 puntos)
    const validExp = data.experiencia.filter(e => e.puesto && e.empresa);
    if (validExp.length >= 2) points += 15;
    else if (validExp.length === 1) points += 10;

    const totalLogros = data.experiencia.reduce((acc, exp) =>
      acc + exp.logros.filter(l => l.trim()).length, 0
    );
    if (totalLogros >= 6) points += 10;
    else if (totalLogros >= 3) points += 5;

    // Educacion (10 puntos)
    const validEdu = data.educacion.filter(e => e.titulo && e.institucion);
    if (validEdu.length >= 1) points += 10;

    // Habilidades (15 puntos)
    if (data.habilidades.tecnicas.length >= 5) points += 10;
    else if (data.habilidades.tecnicas.length >= 3) points += 5;
    if (data.habilidades.blandas.length >= 3) points += 5;

    // Idiomas (5 puntos)
    if (data.idiomas.filter(i => i.idioma && i.nivel).length >= 1) points += 5;

    // Certificaciones (5 puntos)
    if (data.certificaciones.filter(c => c.nombre).length >= 1) points += 5;

    return Math.min(points, maxPoints);
  }, [data]);

  const getScoreColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Mejorable';
    return 'Basico';
  };

  const getTips = () => {
    const tips = [];
    if (!data.resumenProfesional || data.resumenProfesional.split(' ').length < 20) {
      tips.push('Anade un resumen profesional mas completo');
    }
    if (data.experiencia.filter(e => e.puesto).length < 2) {
      tips.push('Incluye al menos 2 experiencias laborales');
    }
    if (data.habilidades.tecnicas.length < 5) {
      tips.push('Anade mas habilidades tecnicas');
    }
    if (!data.personalInfo.linkedin) {
      tips.push('Agrega tu perfil de LinkedIn');
    }
    return tips.slice(0, 2);
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="ats-widget">
      <div className="ats-header">
        <span className="ats-icon">
          <Icon name="bar-chart" size={18} />
        </span>
        <span className="ats-title">Puntuacion ATS</span>
      </div>

      <div className="ats-score-container">
        <svg className="ats-circle" viewBox="0 0 100 100">
          <circle
            className="ats-circle-bg"
            cx="50"
            cy="50"
            r="45"
          />
          <circle
            className="ats-circle-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              stroke: getScoreColor()
            }}
          />
        </svg>
        <div className="ats-score-text">
          <span className="ats-score-number" style={{ color: getScoreColor() }}>
            {score}%
          </span>
          <span className="ats-score-label">{getScoreLabel()}</span>
        </div>
      </div>

      {getTips().length > 0 && (
        <div className="ats-tips">
          <span className="ats-tips-title">
            <Icon name="lightbulb" size={14} />
            Mejora tu CV:
          </span>
          {getTips().map((tip, index) => (
            <div key={index} className="ats-tip-item">
              <span className="ats-tip-bullet" aria-hidden="true"></span>
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSScoreWidget;
