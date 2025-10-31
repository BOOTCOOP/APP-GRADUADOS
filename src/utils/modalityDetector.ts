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
  console.log('\n🔍 ANÁLISIS DE MODALIDAD INICIADO...');
  console.log('=' .repeat(60));
  
  const result: ModalityAnalysis = {
    hasModalityFields: false,
    possibleModalityFields: [],
    modalityValues: {},
    textFieldsWithModality: {},
    suggestions: []
  };

  if (!courseData || typeof courseData !== 'object') {
    console.log('❌ Datos de curso inválidos');
    return result;
  }

  // 1. Buscar campos directos de modalidad
  const modalityKeywords = [
    'modality', 'modalidad', 'modalidade',
    'mode', 'modo', 
    'delivery', 'entrega', 'formato_entrega',
    'format', 'formato', 'format_delivery',
    'type', 'tipo', 'course_type', 'tipo_curso',
    'virtual', 'online', 'presencial', 'distance',
    'remote', 'remoto', 'hybrid', 'hibrido', 'híbrido',
    'classroom', 'aula', 'face_to_face', 'cara_a_cara'
  ];

  console.log('🔑 Campos disponibles en el curso:');
  Object.keys(courseData).forEach(key => {
    console.log(`  • ${key}: ${typeof courseData[key]} = ${courseData[key]}`);
  });

  // Analizar cada campo
  Object.keys(courseData).forEach(key => {
    const lowerKey = key.toLowerCase();
    const value = courseData[key];
    
    // Verificar si el nombre del campo sugiere modalidad
    const isModalityField = modalityKeywords.some(keyword => 
      lowerKey.includes(keyword.toLowerCase())
    );
    
    if (isModalityField) {
      result.hasModalityFields = true;
      result.possibleModalityFields.push(key);
      result.modalityValues[key] = value;
      console.log(`✅ CAMPO DE MODALIDAD ENCONTRADO: ${key} = ${value}`);
    }
    
    // Verificar si el valor contiene palabras relacionadas con modalidad
    if (typeof value === 'string' && value) {
      const lowerValue = value.toLowerCase();
      const modalityWords = [
        'virtual', 'online', 'presencial', 'distancia', 'distance',
        'remoto', 'remote', 'híbrido', 'hibrido', 'hybrid',
        'face to face', 'cara a cara', 'classroom', 'aula'
      ];
      
      const hasModalityWord = modalityWords.some(word => 
        lowerValue.includes(word)
      );
      
      if (hasModalityWord) {
        result.textFieldsWithModality[key] = value;
        console.log(`🔍 POSIBLE MODALIDAD EN TEXTO: ${key} = "${value}"`);
      }
    }
  });

  // Generar sugerencias
  if (!result.hasModalityFields && Object.keys(result.textFieldsWithModality).length === 0) {
    result.suggestions = [
      'El backend NO está enviando información explícita de modalidad',
      'Solicitar al equipo de backend que agregue campos como:',
      '  - modality o modalidad',
      '  - delivery_mode o modo_entrega', 
      '  - course_format o formato_curso',
      '  - is_virtual, is_online, is_presencial',
      'Verificar si la modalidad está en tablas relacionadas (joins faltantes)'
    ];
  } else if (result.hasModalityFields) {
    result.suggestions = [
      '¡Excelente! El backend SÍ está enviando campos de modalidad',
      'Implementar la visualización en el frontend usando los campos encontrados'
    ];
  } else {
    result.suggestions = [
      'Se encontró modalidad en campos de texto',
      'Considerar parsear los campos de texto o pedir campos estructurados'
    ];
  }

  // Mostrar resultados
  console.log('\n📊 RESUMEN DEL ANÁLISIS:');
  console.log(`❓ ¿Hay campos de modalidad? ${result.hasModalityFields ? '✅ SÍ' : '❌ NO'}`);
  console.log(`🔢 Campos de modalidad encontrados: ${result.possibleModalityFields.length}`);
  console.log(`📝 Campos de texto con modalidad: ${Object.keys(result.textFieldsWithModality).length}`);
  
  if (result.possibleModalityFields.length > 0) {
    console.log('\n✅ CAMPOS DE MODALIDAD CONFIRMADOS:');
    result.possibleModalityFields.forEach(field => {
      console.log(`  • ${field}: ${result.modalityValues[field]}`);
    });
  }
  
  if (Object.keys(result.textFieldsWithModality).length > 0) {
    console.log('\n🔍 MODALIDAD EN CAMPOS DE TEXTO:');
    Object.entries(result.textFieldsWithModality).forEach(([field, value]) => {
      console.log(`  • ${field}: "${value}"`);
    });
  }
  
  console.log('\n💡 SUGERENCIAS:');
  result.suggestions.forEach(suggestion => {
    console.log(`  ${suggestion}`);
  });
  
  console.log('=' .repeat(60));
  
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
  console.log('\n🎯 ANÁLISIS MASIVO DE MODALIDAD EN LISTA DE CURSOS');
  console.log('=' .repeat(60));
  
  if (!courses || courses.length === 0) {
    console.log('❌ No hay cursos para analizar');
    return;
  }
  
  console.log(`📊 Analizando ${courses.length} cursos...`);
  
  let coursesWithModality = 0;
  const allModalityFields = new Set<string>();
  
  courses.forEach((course, index) => {
    console.log(`\n🔍 Curso ${index + 1}: ${course.title || course.name || 'Sin título'}`);
    const analysis = analyzeCourseForModality(course);
    
    if (analysis.hasModalityFields || Object.keys(analysis.textFieldsWithModality).length > 0) {
      coursesWithModality++;
      analysis.possibleModalityFields.forEach(field => allModalityFields.add(field));
      Object.keys(analysis.textFieldsWithModality).forEach(field => allModalityFields.add(field));
    }
  });
  
  console.log('\n📈 RESUMEN GENERAL:');
  console.log(`✅ Cursos con información de modalidad: ${coursesWithModality}/${courses.length}`);
  console.log(`🔑 Campos únicos encontrados: ${Array.from(allModalityFields).join(', ')}`);
  
  if (coursesWithModality === 0) {
    console.log('❌ CONCLUSIÓN: El backend NO está enviando información de modalidad');
  } else {
    console.log('✅ CONCLUSIÓN: El backend SÍ tiene información de modalidad');
  }
  
  console.log('=' .repeat(60));
}