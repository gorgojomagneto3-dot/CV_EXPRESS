// Servicio de IA para sugerencias de CV usando Groq API
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_AI_USES = 5;
const STORAGE_KEY = 'cv_express_ai_uses';

// Obtener usos restantes del usuario
export const getAIUsesRemaining = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return MAX_AI_USES;
  
  const data = JSON.parse(stored);
  const today = new Date().toDateString();
  
  // Reset si es un nuevo día
  if (data.date !== today) {
    return MAX_AI_USES;
  }
  
  return Math.max(0, MAX_AI_USES - data.count);
};

// Registrar uso de IA
const registerAIUse = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const today = new Date().toDateString();
  
  let data = { date: today, count: 0 };
  
  if (stored) {
    data = JSON.parse(stored);
    if (data.date !== today) {
      data = { date: today, count: 0 };
    }
  }
  
  data.count += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Verificar si puede usar IA
export const canUseAI = () => {
  return getAIUsesRemaining() > 0;
};

// Generar sugerencias de habilidades basadas en el CV
export const suggestSkills = async (cvData) => {
  if (!canUseAI()) {
    throw new Error('Has alcanzado el límite de 5 sugerencias diarias. Vuelve mañana.');
  }

  const { personalInfo, experiencia, educacion, resumenProfesional } = cvData;

  // Construir contexto del CV
  const experienciaTexto = experiencia
    .filter(exp => exp.puesto || exp.empresa)
    .map(exp => `${exp.puesto} en ${exp.empresa}: ${exp.descripcion || ''} ${exp.logros?.join(', ') || ''}`)
    .join('. ');

  const educacionTexto = educacion
    .filter(edu => edu.titulo || edu.institucion)
    .map(edu => `${edu.titulo} - ${edu.institucion}`)
    .join(', ');

  const prompt = `Eres un experto en recursos humanos y desarrollo de CVs profesionales. 
Basándote en la siguiente información de un candidato, sugiere las mejores habilidades técnicas y blandas.

INFORMACIÓN DEL CANDIDATO:
- Título profesional: ${personalInfo.titulo || 'No especificado'}
- Resumen: ${resumenProfesional || 'No especificado'}
- Experiencia laboral: ${experienciaTexto || 'No especificada'}
- Educación: ${educacionTexto || 'No especificada'}

INSTRUCCIONES:
1. Sugiere 6-8 habilidades TÉCNICAS relevantes para su perfil
2. Sugiere 4-6 habilidades BLANDAS que complementen su experiencia
3. Sé específico y usa términos profesionales actuales
4. Las habilidades deben ser relevantes para el mercado laboral actual

RESPONDE SOLO en formato JSON exacto (sin markdown, sin explicaciones):
{"tecnicas": ["habilidad1", "habilidad2", ...], "blandas": ["habilidad1", "habilidad2", ...]}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente experto en recursos humanos. Respondes SOLO en formato JSON válido, sin texto adicional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error al comunicarse con la IA');
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No se recibió respuesta de la IA');
    }

    // Parsear JSON de la respuesta
    const cleanContent = content.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const skills = JSON.parse(cleanContent);

    // Registrar uso exitoso
    registerAIUse();

    return {
      tecnicas: skills.tecnicas || [],
      blandas: skills.blandas || [],
      usesRemaining: getAIUsesRemaining()
    };

  } catch (error) {
    console.error('Error en sugerencia de IA:', error);
    
    if (error.message.includes('límite')) {
      throw error;
    }
    
    throw new Error('Error al generar sugerencias. Intenta de nuevo.');
  }
};

// Mejorar resumen profesional
export const improveResumen = async (cvData) => {
  if (!canUseAI()) {
    throw new Error('Has alcanzado el límite de 5 sugerencias diarias. Vuelve mañana.');
  }

  const { personalInfo, experiencia, resumenProfesional } = cvData;

  const experienciaTexto = experiencia
    .filter(exp => exp.puesto || exp.empresa)
    .map(exp => `${exp.puesto} en ${exp.empresa}`)
    .join(', ');

  const prompt = `Mejora el siguiente resumen profesional para un CV. Hazlo más impactante, profesional y orientado a resultados.

DATOS:
- Título: ${personalInfo.titulo || 'Profesional'}
- Experiencia: ${experienciaTexto || 'No especificada'}
- Resumen actual: ${resumenProfesional || 'Sin resumen previo'}

INSTRUCCIONES:
- Máximo 3 oraciones
- Destaca logros y valor agregado
- Usa verbos de acción
- Hazlo en español

RESPONDE SOLO el resumen mejorado, sin explicaciones ni comillas.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al comunicarse con la IA');
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('No se recibió respuesta de la IA');
    }

    registerAIUse();

    return {
      resumen: content,
      usesRemaining: getAIUsesRemaining()
    };

  } catch (error) {
    console.error('Error mejorando resumen:', error);
    throw new Error('Error al mejorar el resumen. Intenta de nuevo.');
  }
};

export default {
  suggestSkills,
  improveResumen,
  getAIUsesRemaining,
  canUseAI
};
