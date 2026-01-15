/**
 * 🔍 DETECTOR DE MODALIDAD - Herramienta de diagnóstico
 *
 * Esta utilidad analiza las respuestas del API para detectar
 * si el backend está enviando información de modalidad de cursos
 */

export interface ModalityAnalysis {
  hasModalityFields: boolean;
  possibleModalityFields: string[];
  modalityValues: { [key: string]: any };
  textFieldsWithModality: { [key: string]: string };
  suggestions: string[];
}

/**
 * Analiza un objeto curso para detectar campos de modalidad
 */
export function analyzeCourseForModality(courseData: any): ModalityAnalysis {
  const result: ModalityAnalysis = {
    hasModalityFields: false,
    possibleModalityFields: [],
    modalityValues: {},
    textFieldsWithModality: {},
    suggestions: [],
  };

  if (!courseData || typeof courseData !== "object") {
    return result;
  }

  // 1. Buscar campos directos de modalidad
  const modalityKeywords = [
    "modality",
    "modalidad",
    "modalidade",
    "mode",
    "modo",
    "delivery",
    "entrega",
    "formato_entrega",
    "format",
    "formato",
    "format_delivery",
    "type",
    "tipo",
    "course_type",
    "tipo_curso",
    "virtual",
    "online",
    "presencial",
    "distance",
    "remote",
    "remoto",
    "hybrid",
    "hibrido",
    "híbrido",
    "classroom",
    "aula",
    "face_to_face",
    "cara_a_cara",
  ];

  // Analizar cada campo
  Object.keys(courseData).forEach((key) => {
    const lowerKey = key.toLowerCase();
    const value = courseData[key];

    // Verificar si el nombre del campo sugiere modalidad
    const isModalityField = modalityKeywords.some((keyword) =>
      lowerKey.includes(keyword.toLowerCase())
    );

    if (isModalityField) {
      result.hasModalityFields = true;
      result.possibleModalityFields.push(key);
      result.modalityValues[key] = value;
    }

    // Verificar si el valor contiene palabras relacionadas con modalidad
    if (typeof value === "string" && value) {
      const lowerValue = value.toLowerCase();
      const modalityWords = [
        "virtual",
        "online",
        "presencial",
        "distancia",
        "distance",
        "remoto",
        "remote",
        "híbrido",
        "hibrido",
        "hybrid",
        "face to face",
        "cara a cara",
        "classroom",
        "aula",
      ];

      const hasModalityWord = modalityWords.some((word) =>
        lowerValue.includes(word)
      );

      if (hasModalityWord) {
        result.textFieldsWithModality[key] = value;
      }
    }
  });

  // Generar sugerencias
  if (
    !result.hasModalityFields &&
    Object.keys(result.textFieldsWithModality).length === 0
  ) {
    result.suggestions = [
      "El backend NO está enviando información explícita de modalidad",
      "Solicitar al equipo de backend que agregue campos como:",
      "  - modality o modalidad",
      "  - delivery_mode o modo_entrega",
      "  - course_format o formato_curso",
      "  - is_virtual, is_online, is_presencial",
      "Verificar si la modalidad está en tablas relacionadas (joins faltantes)",
    ];
  } else if (result.hasModalityFields) {
    result.suggestions = [
      "¡Excelente! El backend SÍ está enviando campos de modalidad",
      "Implementar la visualización en el frontend usando los campos encontrados",
    ];
  } else {
    result.suggestions = [
      "Se encontró modalidad en campos de texto",
      "Considerar parsear los campos de texto o pedir campos estructurados",
    ];
  }

  return result;
}

/**
 * Función rápida para usar en console del navegador
 */
export function quickModalityCheck(courseData: any) {
  return analyzeCourseForModality(courseData);
}

/**
 * Función para analizar múltiples cursos
 */
export function analyzeCoursesListForModality(courses: any[]) {
  if (!courses || courses.length === 0) {
    return;
  }

  const allModalityFields = new Set<string>();

  courses.forEach((course) => {
    const analysis = analyzeCourseForModality(course);

    if (
      analysis.hasModalityFields ||
      Object.keys(analysis.textFieldsWithModality).length > 0
    ) {
      analysis.possibleModalityFields.forEach((field) =>
        allModalityFields.add(field)
      );
      Object.keys(analysis.textFieldsWithModality).forEach((field) =>
        allModalityFields.add(field)
      );
    }
  });
}
