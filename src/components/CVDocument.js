import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Paletas de colores por tema
const themes = {
  classic: {
    primary: '#1e40af',
    secondary: '#2563eb',
    bgAccent: '#eff6ff',
    text: '#374151',
    textLight: '#6b7280'
  },
  minimal: {
    primary: '#171717',
    secondary: '#525252',
    bgAccent: '#f5f5f5',
    text: '#262626',
    textLight: '#737373'
  },
  modern: {
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    bgAccent: '#f5f3ff',
    text: '#374151',
    textLight: '#6b7280'
  },
  executive: {
    primary: '#0f172a',
    secondary: '#334155',
    bgAccent: '#f8fafc',
    text: '#1e293b',
    textLight: '#64748b'
  },
  creative: {
    primary: '#0891b2',
    secondary: '#06b6d4',
    bgAccent: '#ecfeff',
    text: '#374151',
    textLight: '#6b7280'
  }
};

// Estilos base optimizados
const baseStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  // Header mejorado con foto
  header: {
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    paddingBottom: 8,
  },
  headerWithPhoto: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  headerPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    objectFit: 'cover',
  },
  headerInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titulo: {
    fontSize: 11,
    marginBottom: 6,
  },
  contactoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  contactoItem: {
    fontSize: 8,
    color: '#404040',
  },
  contactoSeparator: {
    fontSize: 8,
    color: '#9ca3af',
  },
  // Secciones
  seccion: {
    marginBottom: 10,
  },
  seccionTitulo: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Resumen
  resumen: {
    fontSize: 9,
    lineHeight: 1.5,
    textAlign: 'justify',
    color: '#404040',
  },
  // Experiencia
  experienciaItem: {
    marginBottom: 8,
  },
  experienciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  puestoContainer: {
    flex: 1,
  },
  puesto: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  empresaProyecto: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  fecha: {
    fontSize: 8,
    textAlign: 'right',
  },
  empresa: {
    fontSize: 9,
    marginBottom: 3,
  },
  logroItem: {
    fontSize: 8,
    marginLeft: 8,
    marginBottom: 1,
    color: '#404040',
    lineHeight: 1.4,
  },
  // Educación
  educacionItem: {
    marginBottom: 5,
  },
  tituloEducacion: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  institucion: {
    fontSize: 9,
  },
  cursosRelevantes: {
    fontSize: 8,
    color: '#525252',
    marginTop: 2,
    fontStyle: 'italic',
  },
  // Habilidades por categoría
  habilidadesCategoria: {
    marginBottom: 4,
  },
  habilidadesCategoriaLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  habilidadesCategoriaValor: {
    fontSize: 8,
    color: '#404040',
    lineHeight: 1.4,
  },
  // Proyectos
  proyectoItem: {
    marginBottom: 4,
  },
  proyectoNombre: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  proyectoDescripcion: {
    fontSize: 8,
    color: '#404040',
    lineHeight: 1.4,
  },
  // Info adicional
  infoAdicionalRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoAdicionalLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    width: 80,
  },
  infoAdicionalValor: {
    fontSize: 8,
    color: '#404040',
    flex: 1,
  },
  // Layout dos columnas
  dosColumnas: {
    flexDirection: 'row',
    gap: 15,
  },
  columnaIzquierda: {
    flex: 1,
  },
  columnaDerecha: {
    flex: 1,
  },
  // Idiomas inline
  idiomasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  idiomaItem: {
    fontSize: 8,
  },
});

const CVDocument = ({ data, template = 'classic' }) => {
  const {
    personalInfo,
    resumenProfesional,
    experiencia,
    proyectos,
    educacion,
    habilidades,
    habilidadesPorCategoria,
    certificaciones,
    idiomas,
    infoAdicional
  } = data;

  const theme = themes[template] || themes.classic;

  const dynamicStyles = useMemo(() => StyleSheet.create({
    nombre: { color: theme.primary },
    header: { borderBottomColor: theme.secondary },
    titulo: { color: theme.textLight },
    seccionTitulo: { color: theme.primary, borderBottomColor: theme.secondary },
    puesto: { color: theme.text },
    tituloEducacion: { color: theme.text },
    fecha: { color: theme.textLight },
    empresaProyecto: { color: theme.secondary },
  }), [theme]);

  const s = (base, dynamic) => [base, dynamic];

  // Construir línea de contacto (sin emojis para mejor compatibilidad PDF)
  const contactItems = [
    personalInfo.email,
    personalInfo.telefono && `+51 ${personalInfo.telefono}`,
    personalInfo.github,
    personalInfo.linkedin,
    personalInfo.ubicacion,
  ].filter(Boolean);

  const hasExperiencia = Array.isArray(experiencia) && experiencia.some((exp) => exp.puesto || exp.empresa);
  const hasProyectos = Array.isArray(proyectos) && proyectos.some((proy) => proy.nombre || proy.descripcion);
  const hasCertificaciones = Array.isArray(certificaciones) && certificaciones.some((cert) => cert.nombre || cert.institucion || cert.fecha);

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>

        {/* HEADER - Información Personal con Foto */}
        <View style={s(baseStyles.header, dynamicStyles.header)}>
          {personalInfo.foto ? (
            <View style={baseStyles.headerWithPhoto}>
              <Image src={personalInfo.foto} style={baseStyles.headerPhoto} />
              <View style={baseStyles.headerInfo}>
                <Text style={s(baseStyles.nombre, dynamicStyles.nombre)}>{personalInfo.nombre}</Text>
                <Text style={s(baseStyles.titulo, dynamicStyles.titulo)}>{personalInfo.titulo}</Text>
                <View style={baseStyles.contactoContainer}>
                  {contactItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <Text style={baseStyles.contactoItem}>{item}</Text>
                      {index < contactItems.length - 1 && (
                        <Text style={baseStyles.contactoSeparator}>|</Text>
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <>
              <Text style={s(baseStyles.nombre, dynamicStyles.nombre)}>{personalInfo.nombre}</Text>
              <Text style={s(baseStyles.titulo, dynamicStyles.titulo)}>{personalInfo.titulo}</Text>
              <View style={baseStyles.contactoContainer}>
                {contactItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <Text style={baseStyles.contactoItem}>{item}</Text>
                    {index < contactItems.length - 1 && (
                      <Text style={baseStyles.contactoSeparator}>|</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </>
          )}
        </View>

        {/* PERFIL PROFESIONAL */}
        {resumenProfesional && (
          <View style={baseStyles.seccion}>
            <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>PERFIL PROFESIONAL</Text>
            <Text style={baseStyles.resumen}>{resumenProfesional}</Text>
          </View>
        )}

        {/* EXPERIENCIA EN PROYECTOS / LABORAL */}
        {hasExperiencia && (
          <View style={baseStyles.seccion}>
            <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>
              EXPERIENCIA {proyectos && proyectos.length > 0 ? 'EN PROYECTOS' : 'LABORAL'}
            </Text>
            {experiencia.map((exp, index) => (
              <View key={index} style={baseStyles.experienciaItem}>
                <View style={baseStyles.experienciaHeader}>
                  <View style={baseStyles.puestoContainer}>
                    <Text style={s(baseStyles.puesto, dynamicStyles.puesto)}>
                      {exp.puesto} – {exp.empresa}
                    </Text>
                  </View>
                  <Text style={s(baseStyles.fecha, dynamicStyles.fecha)}>
                    {exp.fechaInicio} - {exp.fechaFin}
                  </Text>
                </View>
                {exp.logros && exp.logros.map((logro, i) => (
                  logro && <Text key={i} style={baseStyles.logroItem}>• {logro}</Text>
                ))}
                {exp.tecnologias && (
                  <Text style={[baseStyles.logroItem, { fontStyle: 'italic' }]}>
                    Stack: {exp.tecnologias}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* EDUCACIÓN */}
        {educacion && educacion.length > 0 && (
          <View style={baseStyles.seccion}>
            <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>EDUCACIÓN</Text>
            {educacion.map((edu, index) => (
              <View key={index} style={baseStyles.educacionItem}>
                <View style={baseStyles.experienciaHeader}>
                  <Text style={s(baseStyles.tituloEducacion, dynamicStyles.tituloEducacion)}>
                    {edu.titulo} ({edu.fechaInicio} - {edu.fechaFin})
                  </Text>
                </View>
                <Text style={baseStyles.institucion}>{edu.institucion}</Text>
                {edu.cursosRelevantes && (
                  <Text style={baseStyles.cursosRelevantes}>
                    Cursos relevantes: {edu.cursosRelevantes}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* HABILIDADES TÉCNICAS - Por categoría o lista simple */}
        {(() => {
          const hasHabilidadesSimple = Boolean(habilidades?.tecnicas?.length || habilidades?.blandas?.length);
          const hasHabilidadesCategoria = Boolean(
            habilidadesPorCategoria && Object.values(habilidadesPorCategoria).some((value) => value)
          );

          if (!hasHabilidadesSimple && !hasHabilidadesCategoria) return null;

          return (
            <View style={baseStyles.seccion}>
              <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>HABILIDADES TÉCNICAS</Text>

              {/* Priorizar habilidades simples si el usuario las editó */}
              {hasHabilidadesSimple && habilidades?.tecnicas?.length > 0 && (
                <View style={baseStyles.habilidadesCategoria}>
                  <Text style={baseStyles.habilidadesCategoriaLabel}>Técnicas: 
                    <Text style={baseStyles.habilidadesCategoriaValor}> {habilidades.tecnicas.join(', ')}</Text>
                  </Text>
                </View>
              )}
              {hasHabilidadesSimple && habilidades?.blandas?.length > 0 && (
                <View style={baseStyles.habilidadesCategoria}>
                  <Text style={baseStyles.habilidadesCategoriaLabel}>Soft Skills: 
                    <Text style={baseStyles.habilidadesCategoriaValor}> {habilidades.blandas.join(', ')}</Text>
                  </Text>
                </View>
              )}

              {/* Si no hay habilidades simples, mostrar por categorías */}
              {!hasHabilidadesSimple && habilidadesPorCategoria?.frontend && (
                <View style={baseStyles.habilidadesCategoria}>
                  <Text style={baseStyles.habilidadesCategoriaLabel}>Frontend: 
                    <Text style={baseStyles.habilidadesCategoriaValor}> {habilidadesPorCategoria.frontend}</Text>
                  </Text>
                </View>
              )}
              {!hasHabilidadesSimple && habilidadesPorCategoria?.backend && (
                <View style={baseStyles.habilidadesCategoria}>
                  <Text style={baseStyles.habilidadesCategoriaLabel}>Backend: 
                    <Text style={baseStyles.habilidadesCategoriaValor}> {habilidadesPorCategoria.backend}</Text>
                  </Text>
                </View>
              )}
              {!hasHabilidadesSimple && habilidadesPorCategoria?.basesdatos && (
                <View style={baseStyles.habilidadesCategoria}>
                  <Text style={baseStyles.habilidadesCategoriaLabel}>Bases de Datos: 
                    <Text style={baseStyles.habilidadesCategoriaValor}> {habilidadesPorCategoria.basesdatos}</Text>
                  </Text>
                </View>
              )}
              {!hasHabilidadesSimple && habilidadesPorCategoria?.herramientas && (
                <View style={baseStyles.habilidadesCategoria}>
                  <Text style={baseStyles.habilidadesCategoriaLabel}>Tools: 
                    <Text style={baseStyles.habilidadesCategoriaValor}> {habilidadesPorCategoria.herramientas}</Text>
                  </Text>
                </View>
              )}
              {!hasHabilidadesSimple && habilidadesPorCategoria?.metodologias && (
                <View style={baseStyles.habilidadesCategoria}>
                  <Text style={baseStyles.habilidadesCategoriaLabel}>Metodologías: 
                    <Text style={baseStyles.habilidadesCategoriaValor}> {habilidadesPorCategoria.metodologias}</Text>
                  </Text>
                </View>
              )}
            </View>
          );
        })()}

        {/* CERTIFICACIONES */}
        {hasCertificaciones && (
          <View style={baseStyles.seccion}>
            <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>CERTIFICACIONES</Text>
            {certificaciones.map((cert, index) => (
              <View key={index} style={baseStyles.habilidadesCategoria}>
                <Text style={baseStyles.logroItem}>
                  • {cert.nombre}{cert.institucion && ` - ${cert.institucion}`}{cert.fecha && ` (${cert.fecha})`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* PROYECTOS ADICIONALES */}
        {hasProyectos && (
          <View style={baseStyles.seccion}>
            <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>PROYECTOS ADICIONALES</Text>
            {proyectos.map((proy, index) => (
              <View key={index} style={baseStyles.proyectoItem}>
                <Text style={baseStyles.logroItem}>
                  • <Text style={baseStyles.proyectoNombre}>{proy.nombre}</Text>
                  {proy.descripcion && ` – ${proy.descripcion}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* INFORMACIÓN ADICIONAL */}
        <View style={baseStyles.seccion}>
          <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>INFORMACIÓN ADICIONAL</Text>
          
          {/* Idiomas */}
          {idiomas && idiomas.length > 0 && (
            <View style={baseStyles.infoAdicionalRow}>
              <Text style={baseStyles.infoAdicionalLabel}>Idiomas:</Text>
              <Text style={baseStyles.infoAdicionalValor}>
                {idiomas.map((i, idx) => `${i.idioma} (${i.nivel})`).join(', ')}
              </Text>
            </View>
          )}

          {/* Soft Skills */}
          {infoAdicional?.softSkills && (
            <View style={baseStyles.infoAdicionalRow}>
              <Text style={baseStyles.infoAdicionalLabel}>Soft Skills:</Text>
              <Text style={baseStyles.infoAdicionalValor}>{infoAdicional.softSkills}</Text>
            </View>
          )}

          {/* Disponibilidad */}
          {infoAdicional?.disponibilidad && (
            <View style={baseStyles.infoAdicionalRow}>
              <Text style={baseStyles.infoAdicionalLabel}>Disponibilidad:</Text>
              <Text style={baseStyles.infoAdicionalValor}>{infoAdicional.disponibilidad}</Text>
            </View>
          )}

          {/* Links */}
          {(personalInfo.github || personalInfo.linkedin) && (
            <View style={baseStyles.infoAdicionalRow}>
              <Text style={baseStyles.infoAdicionalLabel}>Portafolio:</Text>
              <Text style={baseStyles.infoAdicionalValor}>
                {personalInfo.github && `${personalInfo.github}`}
                {personalInfo.github && personalInfo.linkedin && ' | '}
                {personalInfo.linkedin && `LinkedIn: ${personalInfo.linkedin}`}
              </Text>
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
};

export default CVDocument;
