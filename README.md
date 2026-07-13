# 🎓 APP GRADUADOS - Centro de Graduados Facultad de Derecho UBA

<div align="center">
  <img src="src/assets/derecho.png" alt="Facultad de Derecho UBA" width="120">
  
  **Aplicación móvil oficial del Centro de Graduados**  
  *Facultad de Derecho - Universidad de Buenos Aires*
  
  [![Vue 3](https://img.shields.io/badge/Vue-3.5.13-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![Ionic](https://img.shields.io/badge/Ionic-6.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.3.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-5.7.0-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

</div>

---

## 📋 Descripción

**APP GRADUADOS** es la aplicación móvil oficial del Centro de Graduados de la Facultad de Derecho de la Universidad de Buenos Aires. Desarrollada para proporcionar a los graduados un acceso integral y centralizado a todos los servicios, programas, recursos y oportunidades disponibles en la institución.

### 🎯 **Propósito**
Facilitar la conexión continua entre la Facultad y sus graduados, ofreciendo una plataforma digital moderna que centraliza:
- Programas de perfeccionamiento y formación continua
- Oportunidades laborales y profesionales
- Material bibliográfico y recursos académicos
- Beneficios exclusivos para graduados
- Comunicación institucional y eventos

---

## ✨ Características Principales

### 🔐 **Autenticación y Perfiles**
- **Sistema de registro diferenciado**:
  - Graduados con título obtenido
  - Graduados con título en trámite
  - Otras categorías de usuarios
- **Autenticación segura** con gestión de tokens
- **Perfiles personalizables** con información académica y profesional

### 🎓 **Programas de Perfeccionamiento**
- **Catálogo completo** de programas de formación continua
- **Búsqueda inteligente** por nombre, materia o palabra clave
- **Filtros avanzados**: modalidad, disponibilidad, graduados UBA
- **Inscripción integrada** con proceso de pago cuando corresponde
- **Historial de inscripciones** y certificaciones

### 🎯 **Talleres y Actividades**
- **Programación completa** de talleres y seminarios
- **Categorización automática** por temática
- **Estados de inscripción** en tiempo real
- **Gestión de cupos** y listas de espera
- **Notificaciones** de fechas importantes

### 💼 **Búsqueda Laboral**
- **Portal de empleos** especializado para graduados en derecho
- **Filtros especializados**: modalidad, ubicación, área legal
- **Publicación de búsquedas** para graduados empleadores
- **Sistema de favoritos** y seguimiento de aplicaciones
- **Integración con empresas** del sector legal

### 📚 **Biblioteca Digital**
- **Repositorio completo** de material bibliográfico
- **Descarga de documentos** PDF, presentaciones, videos
- **Organización por cursos** y programas
- **Buscador avanzado** por título, autor, materia
- **Acceso exclusivo** según nivel de inscripción

### 📰 **Centro de Comunicación**
- **Noticias institucionales** con categorización automática
- **Avisos clasificados** entre graduados
- **Información de interés** para la comunidad legal
- **Sistema de notificaciones** push para móviles

### 🎁 **Beneficios Exclusivos**
- **Descuentos** en establecimientos asociados
- **Promociones especiales** para graduados
- **Credencial digital** para acreditar beneficios
- **Guías de uso** paso a paso

---

## 🛠️ Stack Tecnológico

### **Frontend Framework**
- **Vue.js 3.5.13** - Framework progresivo con Composition API
- **Ionic Framework 6.0** - UI móvil nativa multiplataforma
- **TypeScript 4.3.5** - Tipado estático y mejor DX
- **Vue Router 4.0** - Enrutamiento SPA avanzado

### **Mobile Development**
- **Capacitor 5.7.0** - Runtime nativo para iOS y Android
- **Cordova Plugins** - Acceso a funcionalidades nativas
- **PWA Support** - Funcionalidad offline y web app

### **State Management & HTTP**
- **Vuex 4.1.0** - Gestión de estado centralizada
- **Axios 1.3.4** - Cliente HTTP con interceptores
- **Pinia 3.0.0** - Estado reactivo complementario

### **UI/UX & Styling**
- **Ionicons 6.0.3** - Librería de iconos oficial
- **FontAwesome 6.7.2** - Iconografía extendida
- **Swiper 9.1.1** - Carruseles y componentes táctiles
- **CSS Custom Properties** - Theming dinámico

### **Development & Build**
- **Vue CLI 5.0** - Toolchain de desarrollo
- **ESLint + TypeScript** - Linting y calidad de código
- **Jest** - Testing unitario
- **Cypress** - Testing E2E
- **Vee-Validate** - Validación de formularios

---

## 📱 Funcionalidades Móviles

### **Capacitor Plugins Integrados**
```typescript
// Funcionalidades nativas disponibles
- @capacitor/camera       // Cámara y galería
- @capacitor/filesystem   // Sistema de archivos
- @capacitor/share        // Compartir contenido
- @capacitor/haptics      // Feedback táctil
- @capacitor/status-bar   // Personalización status bar
- @capacitor/keyboard     // Gestión teclado virtual
```

### **PWA Features**
- ✅ **Offline functionality** con service workers
- ✅ **Add to homescreen** en dispositivos móviles  
- ✅ **Push notifications** para actualizaciones
- ✅ **Background sync** para datos críticos

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**
```bash
Node.js >= 16.0.0
npm >= 8.0.0
Ionic CLI >= 7.0.0
```

### **Instalación Local**
```bash
# Clonar el repositorio
git clone https://github.com/BOOTCOOP/APP-GRADUADOS.git

# Navegar al directorio
cd APP-GRADUADOS

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
npm run serve
```

### **Configuración de Entorno**
```bash
# .env
VUE_APP_API_URL=https://graduados.derecho.uba.ar/api
VUE_APP_ENVIRONMENT=development
```

---

## 📱 Builds y Deployment

### **Desarrollo Web**
```bash
# Servidor de desarrollo
npm run serve

# Build de producción
npm run build

# Preview del build
npm run preview
```

### **Apps Móviles**
```bash
# Agregar plataformas
ionic capacitor add android
ionic capacitor add ios

# Build y sync
ionic capacitor build android
ionic capacitor build ios

# Abrir en IDE nativo
ionic capacitor open android
ionic capacitor open ios
```

### **Deploy Web**
```bash
# GitHub Pages (configurado)
npm run deploy

# Build optimizado
npm run build
npm run postbuild  # Copia index.html a 404.html
```

---

## 📁 Estructura del Proyecto

```
src/
├── 📱 views/                    # Páginas principales
│   ├── 🏠 home/                # Página de inicio
│   ├── 🔐 auth/                # Autenticación y registro
│   ├── 🎓 courses/             # Programas de perfeccionamiento
│   ├── 🎯 activities/          # Talleres y seminarios
│   ├── 💼 jobs/                # Búsqueda laboral
│   ├── 📚 bibliography/        # Material bibliográfico
│   ├── 📰 feeds/               # Noticias institucionales
│   ├── 📋 classifieds/         # Avisos clasificados
│   ├── ℹ️  information-of-interest/ # Información relevante
│   ├── 🎁 benefits/            # Beneficios para graduados
│   └── 🎨 layout/              # Componentes de layout
│
├── 🧩 components/              # Componentes reutilizables
├── 🗃️  store/                  # Gestión de estado (Vuex)
├── 🛣️  router/                 # Configuración de rutas
├── 🎨 theme/                   # Estilos y variables CSS
├── 🔧 utils/                   # Utilidades y helpers
├── 📡 libs/                    # Configuraciones de librerías
└── 🛡️  middlewares/            # Middleware de autenticación
```

---

## 🎨 Arquitectura y Patrones

### **Composición de Componentes**
```vue
<!-- Ejemplo: Estructura típica de vista -->
<template>
  <graduados-app header-title="Título">
    <!-- Búsqueda y filtros -->
    <search-filters v-model="filters" />
    
    <!-- Lista con paginación infinita -->
    <infinite-pagination 
      :fetch-data-store="storeAction"
      :filters="filters"
    >
      <template #default="{ items }">
        <item-card 
          v-for="item in items" 
          :key="item.id" 
          :item="item" 
        />
      </template>
    </infinite-pagination>
  </graduados-app>
</template>
```

### **Gestión de Estado**
```typescript
// Store modular por funcionalidad
store/
├── modules/
│   ├── auth/           # Autenticación de usuarios
│   ├── courses/        # Programas y cursos
│   ├── jobs/           # Ofertas laborales
│   ├── feeds/          # Noticias y comunicación
│   └── bibliography/   # Material académico
```

### **Patrones Implementados**
- ✅ **Repository Pattern** para acceso a datos
- ✅ **Component Composition** con Vue 3
- ✅ **Reactive State Management** con Vuex
- ✅ **Route-based Code Splitting** para performance
- ✅ **Progressive Enhancement** para experiencia móvil

---

## 🔒 Autenticación y Seguridad

### **Sistema de Autenticación**
```typescript
// Flujo de autenticación implementado
1. Registro → Verificación por email → Activación de cuenta
2. Login → Generación de JWT → Almacenamiento seguro
3. Middleware → Verificación de tokens → Renovación automática
4. Logout → Limpieza de datos → Redirección segura
```

### **Niveles de Acceso**
- **👤 Usuario no registrado**: Información pública limitada
- **🎓 Graduado verificado**: Acceso completo a servicios
- **👨‍🏫 Graduado docente**: Funcionalidades de gestión
- **🔧 Administrador**: Panel de administración completo

---

## 🧪 Testing

### **Testing Unitario**
```bash
# Ejecutar tests
npm run test:unit

# Coverage report
npm run test:unit -- --coverage
```

### **Testing E2E**
```bash
# Cypress tests
npm run test:e2e

# Interactive mode
npm run cypress:open
```

### **Testing de Componentes**
```typescript
// Ejemplo: Test de componente Course
import { mount } from '@vue/test-utils'
import Course from '@/views/courses/components/Course.vue'

describe('Course.vue', () => {
  it('displays course information correctly', () => {
    const wrapper = mount(Course, {
      props: { course: mockCourseData }
    })
    expect(wrapper.find('.course-title').text()).toBe('Curso de Prueba')
  })
})
```

---

## 📊 Performance y Optimización

### **Métricas Implementadas**
- ✅ **Code Splitting** por rutas
- ✅ **Lazy Loading** de componentes pesados
- ✅ **Image Optimization** con WebP
- ✅ **Bundle Analysis** con webpack-bundle-analyzer
- ✅ **PWA Caching** strategies

### **Optimizaciones Móviles**
- ✅ **Virtual Scrolling** para listas grandes
- ✅ **Infinite Pagination** para reducir carga inicial
- ✅ **Touch Gestures** optimizados
- ✅ **Offline Mode** para contenido crítico

---

## 🤝 Contribución

### **Flujo de Desarrollo**
```bash
# Feature branches
git checkout -b feature/nueva-funcionalidad

# Commits semánticos
git commit -m "feat: agregar búsqueda avanzada en cursos"

# Pull requests
git push origin feature/nueva-funcionalidad
```

### **Convenciones de Código**
- **Vue Style Guide**: Seguir guía oficial de Vue.js
- **TypeScript Strict**: Tipado estricto habilitado
- **ESLint Rules**: Configuración estándar extendida
- **Component Naming**: PascalCase para componentes

---

## 📚 Documentación Adicional

### **Documentos Técnicos**
- 📄 [**MEJORAS_IMPLEMENTADAS.md**](./MEJORAS_IMPLEMENTADAS.md) - Documentación ejecutiva completa
- 🛠️ [**RESUMEN_TECNICO.md**](./RESUMEN_TECNICO.md) - Guía técnica para desarrolladores  
- 📋 [**CHANGELOG.md**](./CHANGELOG.md) - Control de versiones detallado
- 👥 [**GUIA_USUARIO_MEJORAS.md**](./GUIA_USUARIO_MEJORAS.md) - Guía de mejoras para usuarios

### **APIs y Servicios**
- **API Base**: `https://graduados.derecho.uba.ar/api`
- **Documentación API**: Disponible para desarrolladores autorizados
- **Swagger/OpenAPI**: Endpoints documentados

---

## 🌐 Deploy y Distribución

### **Entornos**
- **🧪 Desarrollo**: `http://localhost:8080`
- **🔄 Staging**: `https://staging.graduados.derecho.uba.ar`
- **🚀 Producción**: `https://graduados.derecho.uba.ar`
- **📱 App Stores**: Google Play Store, Apple App Store

### **CI/CD Pipeline**
```yaml
# GitHub Actions configurado para:
- Build automático en push a main
- Testing automático en PRs  
- Deploy automático a staging
- Release manual a producción
```

---

## 📞 Soporte y Contacto

### **Equipo de Desarrollo**
- **👨‍💻 Developer**: Miguel Maidana
- **🏢 Organización**: BOOTCOOP
- **📧 Email**: desarrollo@bootcoop.com

### **Soporte Institucional**
- **🏛️ Centro de Graduados**: Facultad de Derecho UBA
- **📞 Teléfono**: +54 11 4371-3500
- **📧 Email**: graduados@derecho.uba.ar

---

## 📄 Licencia y Términos

### **Propiedad Intelectual**
- **©️ 2024 Centro de Graduados** - Facultad de Derecho UBA
- **⚖️ Uso**: Exclusivo para la comunidad de graduados
- **🔒 Datos**: Protegidos bajo normativas de privacidad argentina

### **Tecnologías Open Source**
Este proyecto utiliza tecnologías de código abierto bajo sus respectivas licencias:
- Vue.js (MIT License)
- Ionic Framework (MIT License)
- TypeScript (Apache 2.0 License)

---

<div align="center">
  
  **🎓 Desarrollado con ❤️ para la comunidad de graduados de la Facultad de Derecho UBA**
  
  ---
  
  [![Universidad de Buenos Aires](https://img.shields.io/badge/UBA-Facultad%20de%20Derecho-1B396A?style=for-the-badge)](https://www.derecho.uba.ar/)
  [![BOOTCOOP](https://img.shields.io/badge/Desarrollado%20por-BOOTCOOP-FF6B35?style=for-the-badge)](https://github.com/BOOTCOOP)

</div>
