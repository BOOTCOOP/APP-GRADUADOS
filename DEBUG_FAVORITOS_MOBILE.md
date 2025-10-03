# 🔍 DEBUG: Botón Favoritos No Funciona en Móvil

## 📱 **PROBLEMA**
- ✅ **Funciona en:** Navegador web (desktop)
- ❌ **No funciona en:** Dispositivo móvil Android
- 📄 **Archivo:** `src/views/jobs/Show.vue`

---

## 🛠️ **LOGS AGREGADOS PARA DEBUGGEAR**

### **Logs en Click del Botón:**
```javascript
@click="(event) => { 
    console.log('🔍 [MOBILE DEBUG] Click event triggered:', event); 
    saveFavorite(); 
}"
```

### **Logs en Función saveFavorite:**
```javascript
console.log('🔍 [MOBILE DEBUG] Iniciando saveFavorite');
console.log('🔍 [MOBILE DEBUG] Job ID:', job.value.id);
console.log('🔍 [MOBILE DEBUG] Job object:', job.value);
console.log('🔍 [MOBILE DEBUG] Store disponible:', !!store);
```

### **Logs en Respuesta/Error:**
```javascript
.then((response) => {
    console.log('✅ [MOBILE DEBUG] Respuesta exitosa:', response);
    // ...
})
.catch((error) => {
    console.error('❌ [MOBILE DEBUG] Error capturado:', error);
    console.error('❌ [MOBILE DEBUG] Error details:', JSON.stringify(error));
});
```

---

## 📋 **PASOS PARA DEBUGGEAR EN ANDROID**

### **1. Habilitar Debug Remoto:**
1. **En Android:** Settings → Developer Options → USB Debugging ✅
2. **Conectar** dispositivo via USB
3. **En Chrome PC:** Ir a `chrome://inspect`
4. **Seleccionar** tu dispositivo
5. **Click "Inspect"** en la app

### **2. Abrir Console y Probar:**
1. **Ir a** una oferta laboral en la app
2. **Click** botón "Guardar en favoritos"
3. **Revisar Console** en DevTools

### **3. Posibles Escenarios:**

#### **Escenario A: No se ejecuta el click**
**Logs esperados:** ❌ No aparece `"Click event triggered"`
**Causa probable:** Problema de interfaz/touch en móvil
**Síntomas:** El botón no responde al toque

#### **Escenario B: Click OK, función no se ejecuta**
**Logs esperados:** 
- ✅ `"Click event triggered"`
- ❌ No aparece `"Iniciando saveFavorite"`
**Causa probable:** Error en la función antes del dispatch

#### **Escenario C: Función OK, error en API**
**Logs esperados:**
- ✅ `"Click event triggered"`
- ✅ `"Iniciando saveFavorite"`
- ❌ `"Error capturado"`
**Causa probable:** Problema de red/API/autenticación

#### **Escenario D: Todo OK, no actualiza UI**
**Logs esperados:**
- ✅ `"Click event triggered"`
- ✅ `"Iniciando saveFavorite"`
- ✅ `"Respuesta exitosa"`
- ❌ No cambia el botón
**Causa probable:** Problema de reactividad de Vue

---

## 🔍 **QUÉ REVISAR EN CADA ESCENARIO**

### **Si es Escenario A (No responde al toque):**
- Revisar si hay elementos superpuestos
- Verificar el CSS del botón
- Probar con un botón más simple

### **Si es Escenario B (Click OK, función no ejecuta):**
- Revisar si `job.value.id` existe
- Verificar que `store` esté disponible
- Revisar errores de JavaScript

### **Si es Escenario C (Error en API):**
- Revisar response del error
- Verificar autenticación/token
- Revisar conectividad de red
- Verificar headers de la request

### **Si es Escenario D (API OK, UI no actualiza):**
- Verificar que `job.value.has_user_favorite` cambie
- Revisar reactividad de Vue
- Verificar que el toast aparezca

---

## 📞 **PRÓXIMOS PASOS**

1. **Conectar Android** y abrir DevTools remotos
2. **Probar** botón de favoritos
3. **Capturar logs** de la consola
4. **Reportar** cuál de los 4 escenarios ocurre
5. **Enviar screenshots** de los logs

---

## 🚨 **INFORMACIÓN IMPORTANTE**

### **URLs de API que se llaman:**
- `POST /api/jobs/favorites/{id}` - Para agregar favorito
- `DELETE /api/jobs/favorites/{id}` - Para quitar favorito

### **Headers importantes:**
- Authorization: Bearer token
- Content-Type: application/json
- Cookies de sesión

### **Datos que se envían:**
- Solo el ID del trabajo (`job.value.id`)

---

*Debug preparado el 2 de Octubre de 2025*