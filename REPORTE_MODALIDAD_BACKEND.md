# 🚨 REPORTE TÉCNICO: INCONSISTENCIA EN MODALIDAD

## **PROBLEMA DETECTADO**

El endpoint de **Jobs** SÍ envía modalidad, pero el endpoint de **Courses** NO.

---

## **✅ WORKING: Jobs Endpoint**

```
GET /api/jobs
```

**Response incluye modalidad:**

```json
{
  "id": 54,
  "title": "Procurador/a",
  "modality": "Presencial",  ← ✅ CAMPO PRESENTE
  "location": ", Ciudad Autónoma de Buenos Aires"
}
```

**Valores encontrados:**

- ✅ "Presencial"
- ✅ "Híbrido"
- ✅ "Home office"

---

## **❌ BROKEN: Courses Endpoint**

```
GET /api/courses
```

**Response SIN modalidad:**

```json
{
  "id": 32,
  "title": "DERECHO INFORMATICO E INTELIGENCIA ARTIFICIAL",
  "teachers": "Chadd Wisoky",
  "start": "19-10-2025",
  "beginning": "en 6 días",
  "is_only_for_graduado_uba": false
  // ❌ FALTA: "modality" field
}
```

---

## **🔧 SOLUCIÓN REQUERIDA**

### **Opción 1: Agregar campo modality a courses**

```sql
-- Migration needed
ALTER TABLE courses ADD COLUMN modality VARCHAR(50) NULL;
```

```php
// En Course Model/Resource
'modality' => $this->modality,
```

### **Opción 2: Usar mismos valores que Jobs**

```php
// Valores consistentes:
'modality' => 'Presencial|Híbrido|Home office|Virtual'
```

### **Opción 3: Relación con tabla modalities**

```php
// Si existe tabla modalities
'modality' => $this->modality->name,
```

---

## **🎯 ENDPOINTS A MODIFICAR**

1. `GET /api/courses` - Lista de cursos
2. `GET /api/courses/{id}` - Detalle de curso
3. `GET /api/courses/own` - Cursos propios
4. `GET /api/courses/history` - Historial

---

## **✅ VERIFICACIÓN**

Una vez implementado, verificar que la response incluya:

```json
{
  "id": 32,
  "title": "DERECHO INFORMATICO E INTELIGENCIA ARTIFICIAL",
  "modality": "Virtual",  ← ✅ CAMPO REQUERIDO
  "teachers": "Chadd Wisoky"
}
```

---

## **📋 PRIORIDAD**

**🔥 ALTA** - Feature request del cliente para mostrar modalidad en UI

## **📱 IMPACTO FRONTEND**

Sin este campo, no podemos mostrar si un curso es:

- ❌ Presencial
- ❌ Virtual/Online
- ❌ Híbrido

---

**Reportado por:** Equipo Frontend  
**Fecha:** 12 de octubre de 2025  
**Estado:** Pending Backend Implementation
