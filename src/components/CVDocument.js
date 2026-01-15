import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Paletas de colores por tema
const themes = {
  classic: {
    primary: '#1e40af',       // Azul fuerte
    secondary: '#2563eb',     // Azul brillante
    bgAccent: '#eff6ff',      // Azul muy claro
    text: '#374151',          // Gris oscuro (Slate)
    textLight: '#6b7280'      // Gris medio (Slate)
  },
  minimal: {                  // Corregido de 'minimalist' a 'minimal'
    primary: '#171717',       // Negro Neutro (Neutral 900)
    secondary: '#525252',     // Gris Neutro (Neutral 600)
    bgAccent: '#f5f5f5',      // Gris muy claro (Neutral 100)
    text: '#262626',          // Gris oscuro (Neutral 800)
    textLight: '#737373'      // Gris medio (Neutral 500)
  },
  modern: {
    primary: '#7c3aed',       // Púrpura
    secondary: '#8b5cf6',     // Violeta
    bgAccent: '#f5f3ff',      // Púrpura muy claro
    text: '#374151',
    textLight: '#6b7280'
  }
};

// Estilos Base (Neutros por defecto)
const baseStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#333333',
  },

  // Header / Info Personal
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  nombre: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 12,
    color: '#525252', // Neutral 600
    marginBottom: 8,
  },
  contactoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactoItem: {
    fontSize: 9,
    color: '#404040', // Neutral 700
  },

  // Secciones
  seccion: {
    marginBottom: 12,
  },
  seccionTitulo: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#e5e5e5', // Neutral 200
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  // Resumen
  resumen: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
    color: '#404040',
  },

  // Experiencia
  experienciaItem: {
    marginBottom: 10,
  },
  experienciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  puesto: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    // color se maneja dinámicamente o por defecto
  },
  fecha: {
    fontSize: 9,
    color: '#737373', // Neutral 500
  },
  empresa: {
    fontSize: 10,
    color: '#525252',
    marginBottom: 4,
  },
  logroItem: {
    fontSize: 9,
    marginLeft: 10,
    marginBottom: 2,
    color: '#404040',
  },

  // Educación
  educacionItem: {
    marginBottom: 6,
  },
  tituloEducacion: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  institucion: {
    fontSize: 9,
    color: '#525252',
  },

  // Habilidades
  habilidadesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  habilidadItem: {
    fontSize: 9,
    padding: '3 8',
    borderRadius: 3,
  },
  habilidadesSubtitulo: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#404040',
    marginBottom: 4,
    marginTop: 6,
  },

  // Certificaciones e Idiomas
  certificacionItem: {
    marginBottom: 4,
  },
  certificacionNombre: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  certificacionDetalle: {
    fontSize: 9,
    color: '#737373',
  },

  // Idiomas en fila
  idiomasContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  idiomaItem: {
    fontSize: 9,
  },

  // Dos columnas para la parte inferior
  dosColumnas: {
    flexDirection: 'row',
    gap: 20,
  },
  columnaIzquierda: {
    flex: 1,
  },
  columnaDerecha: {
    flex: 1,
  },
});

const CVDocument = ({ data, template = 'classic' }) => {
  const {
    personalInfo,
    resumenProfesional,
    experiencia,
    educacion,
    habilidades,
    certificaciones,
    idiomas
  } = data;

  const theme = themes[template] || themes.classic;

  // Estilos dinámicos basados en el tema
  const dynamicStyles = useMemo(() => StyleSheet.create({
    nombre: {
      color: theme.primary,
    },
    header: {
      borderBottomColor: theme.secondary,
    },
    titulo: {
      color: theme.textLight,
    },
    seccionTitulo: {
      color: theme.primary,
    },
    puesto: {
      color: theme.text, // Usa el color de texto principal del tema
    },
    tituloEducacion: {
      color: theme.text,
    },
    certificacionNombre: {
      color: theme.text,
    },
    habilidadItem: {
      backgroundColor: theme.bgAccent,
      color: theme.primary,
    }
  }), [theme]);

  // Styles merging helpers
  const s = (base, dynamic) => [base, dynamic];

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>

        {/* Header - Información Personal */}
        <View style={s(baseStyles.header, dynamicStyles.header)}>
          <Text style={s(baseStyles.nombre, dynamicStyles.nombre)}>{personalInfo.nombre}</Text>
          <Text style={s(baseStyles.titulo, dynamicStyles.titulo)}>{personalInfo.titulo}</Text>
          <View style={baseStyles.contactoContainer}>
            <Text style={baseStyles.contactoItem}>{personalInfo.email}</Text>
            <Text style={baseStyles.contactoItem}>|</Text>
            <Text style={baseStyles.contactoItem}>{personalInfo.telefono}</Text>
            <Text style={baseStyles.contactoItem}>|</Text>
            <Text style={baseStyles.contactoItem}>{personalInfo.ubicacion}</Text>
            <Text style={baseStyles.contactoItem}>|</Text>
            <Text style={baseStyles.contactoItem}>{personalInfo.linkedin}</Text>
          </View>
        </View>

        {/* Resumen Profesional */}
        <View style={baseStyles.seccion}>
          <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>Resumen Profesional</Text>
          <Text style={baseStyles.resumen}>{resumenProfesional}</Text>
        </View>

        {/* Experiencia Laboral */}
        <View style={baseStyles.seccion}>
          <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>Experiencia Laboral</Text>
          {experiencia.map((exp, index) => (
            <View key={index} style={baseStyles.experienciaItem}>
              <View style={baseStyles.experienciaHeader}>
                <Text style={s(baseStyles.puesto, dynamicStyles.puesto)}>{exp.puesto}</Text>
                <Text style={baseStyles.fecha}>{exp.fechaInicio} - {exp.fechaFin}</Text>
              </View>
              <Text style={baseStyles.empresa}>{exp.empresa} | {exp.ubicacion}</Text>
              {exp.logros.map((logro, i) => (
                <Text key={i} style={baseStyles.logroItem}>• {logro}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Educación */}
        <View style={baseStyles.seccion}>
          <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>Educación</Text>
          {educacion.map((edu, index) => (
            <View key={index} style={baseStyles.educacionItem}>
              <View style={baseStyles.experienciaHeader}>
                <Text style={s(baseStyles.tituloEducacion, dynamicStyles.tituloEducacion)}>{edu.titulo}</Text>
                <Text style={baseStyles.fecha}>{edu.fechaInicio} - {edu.fechaFin}</Text>
              </View>
              <Text style={baseStyles.institucion}>{edu.institucion} | {edu.ubicacion}</Text>
            </View>
          ))}
        </View>

        {/* Habilidades */}
        <View style={baseStyles.seccion}>
          <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>Habilidades</Text>
          <Text style={baseStyles.habilidadesSubtitulo}>Técnicas</Text>
          <View style={baseStyles.habilidadesContainer}>
            {habilidades.tecnicas.map((hab, index) => (
              <Text key={index} style={s(baseStyles.habilidadItem, dynamicStyles.habilidadItem)}>{hab}</Text>
            ))}
          </View>
          <Text style={baseStyles.habilidadesSubtitulo}>Blandas</Text>
          <View style={baseStyles.habilidadesContainer}>
            {habilidades.blandas.map((hab, index) => (
              <Text key={index} style={s(baseStyles.habilidadItem, dynamicStyles.habilidadItem)}>{hab}</Text>
            ))}
          </View>
        </View>

        {/* Certificaciones e Idiomas en dos columnas */}
        <View style={baseStyles.dosColumnas}>
          <View style={baseStyles.columnaIzquierda}>
            <View style={baseStyles.seccion}>
              <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>Certificaciones</Text>
              {certificaciones.map((cert, index) => (
                <View key={index} style={baseStyles.certificacionItem}>
                  <Text style={s(baseStyles.certificacionNombre, dynamicStyles.certificacionNombre)}>{cert.nombre}</Text>
                  <Text style={baseStyles.certificacionDetalle}>{cert.institucion} | {cert.fecha}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={baseStyles.columnaDerecha}>
            <View style={baseStyles.seccion}>
              <Text style={s(baseStyles.seccionTitulo, dynamicStyles.seccionTitulo)}>Idiomas</Text>
              <View style={baseStyles.idiomasContainer}>
                {idiomas.map((idioma, index) => (
                  <Text key={index} style={baseStyles.idiomaItem}>
                    {idioma.idioma}: {idioma.nivel}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default CVDocument;
