# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Sin publicar]

### Changed
- Migración del build de Vue CLI 5 (webpack) a **Vite 8** y de Jest 27 a **Vitest 4**: `npm audit` queda en 0 vulnerabilidades (eran 28 sin fix posible en Vue CLI), el build baja de ~100 s a ~20 s y el bundle OTA de ~6.8 MB a ~2.8 MB (ya no se empaqueta bundle legacy duplicado)
- Variables de entorno renombradas `VUE_APP_*` → `VITE_*` (los valores no cambian; la sesión de los usuarios se preserva)
- CI en Node 22 (requisito de Vite 8)

## [1.1.4] - 2026-07-12

### Security
- `swiper` 9 → 12.2: corrige prototype pollution crítica (GHSA-hmx5-qpq5-p643), la única vulnerabilidad que viajaba en el bundle de la app
- Saneamiento de devDependencies: se eliminan `cypress` (sin tests e2e reales) y `@capacitor/assets` (usar `npx @capacitor/assets` on demand); `npm audit` pasa de 41 vulnerabilidades (3 críticas) a 28 (0 críticas); las restantes esperan la migración a Vite/Vitest

### Fixed
- El test unitario de ejemplo apuntaba a un componente inexistente; ahora testea `safeRedirect`

## [1.1.3] - 2026-07-12

### Fixed
- Botón de volver en las pantallas de login, registro y recupero de contraseña (el layout blank ocultaba el header y en iOS no había forma de salir)

### Changed
- Avatar del menú lateral: iniciales de nombre + apellido, e ícono de silueta cuando no hay sesión

## [1.1.2] - 2026-07-10

### Fixed
- El bundle OTA 1.1.1 se compiló con la URL de API del `.env` local (localhost) y rompía todas las llamadas a la API en los teléfonos; `make-bundle.js` ahora aborta si detecta una URL de desarrollo embebida en el build

## [1.1.1] - 2026-07-10

### Added
- Versión de la app visible al pie del menú lateral (primer bundle publicado por OTA)

### Changed
- Bundle ID definitivo unificado en `ar.uba.derecho.graduados` (se elimina `com.kamecode.graduados` de Android)
- `make-bundle.js` excluye `ota/` del zip (evita anidar bundles anteriores)
- Los bundles OTA también pueden servirse desde `public/ota/` vía Pages (alternativa a GitHub Releases)

## [1.1.0] - 2026-07-10

### Added
- Actualizaciones OTA self-hosted con `@capgo/capacitor-updater` (modo manual): manifiesto `public/ota/latest.json` en GitHub Pages, bundles en GitHub Releases (tag `bundle-x.y.z`), rollback automático vía `notifyAppReady()` y campo `min_native_version` en el manifiesto
- Force update: chequeo de `min_version` contra `GET /api/app/config` al arrancar y en resume, más manejo del status 426 de la API (alert bloqueante con botón a la tienda)
- Scripts `build:native` (build con base `/` para el shell Capacitor) y `ota:build` (build nativo + empaquetado del bundle OTA con `tools/ota/make-bundle.js`)
- Documentación del proceso de releases y actualizaciones en `docs/releases-y-actualizaciones.md`

### Changed
- Migración de Capacitor 5 a 7 (targetSdk 35)
- Versionado unificado en 1.1.0: `package.json` (bundle JS), Android `versionName` 1.1.0 / `versionCode` 14, iOS `MARKETING_VERSION` 1.1.0 / `CURRENT_PROJECT_VERSION` 3
- Fix de `publicPath` para builds nativos: flag `CAPACITOR_BUILD=1` en `vue.config.js` fuerza base `/` (los builds web siguen usando `/APP-GRADUADOS/`)
- CI actualizado a Node 20

## [Unreleased] - 2024-09-15

### Added
- Comprehensive search functionality across all main sections
- Advanced filtering systems for content categorization  
- Automatic content categorization based on keywords
- Modern card-based designs for all list components
- Responsive layouts optimized for mobile devices
- Conditional rendering based on actual API data structure
- Infinite pagination optimization
- Loading states and skeleton components
- Improved navigation between list and detail views

### Changed
- **Programas/Cursos**: Complete redesign with search, filters, and modern card layout
- **Noticias**: Intelligent automatic categorization system implemented  
- **Material Bibliográfico**: Enhanced search by title, author, and subject
- **Búsqueda Laboral**: Job filtering by type and improved salary display
- **Talleres/Actividades**: Workshop availability filtering and status indicators
- **Información de Interés**: Category-based organization and search
- **Notificaciones**: Type-based categorization and filtering system
- **Home**: Reorganized lateral menu and improved shortcuts

### Fixed
- Vue.js warnings and console errors throughout the application
- Navigation issues between course list and detail views (slug vs ID routing)
- Removed irrelevant sections from detail views (bibliography sections in courses)
- Unused imports and functions cleanup
- Responsive design issues on mobile devices
- API data structure mismatches with UI expectations

### Removed
- Hardcoded data that didn't match API responses
- Irrelevant UI components (unsubscribe buttons in course details)
- Deprecated component imports and unused functions
- Test/dummy data displays in production components

## Technical Details

### Architecture Improvements
- **Vue 3 Composition API**: Consistent usage across all components
- **TypeScript**: Enhanced type safety with proper interfaces
- **Ionic Components**: Modern mobile-first component library
- **Vuex State Management**: Centralized data fetching and state
- **Modular Components**: Reusable and maintainable component structure

### Performance Optimizations  
- **Computed Properties**: For expensive filtering operations
- **Conditional Rendering**: Only render components with valid data
- **Infinite Scroll**: Optimized loading for large datasets
- **Component Lazy Loading**: Reduced initial bundle size
- **Reactive Search**: Debounced search implementation

### Code Quality
- **ESLint Compliance**: Removed all linting warnings
- **TypeScript Strict Mode**: Enhanced type checking
- **Component Props Validation**: Proper prop definitions
- **Error Handling**: Comprehensive error states
- **Console Cleanup**: Removed debug logs from production

## File Changes Summary

### Modified Files (30+)
```
src/views/courses/Courses.vue              (+224, -0)
src/views/courses/Detail.vue               (+366, -0) 
src/views/courses/components/Course.vue    (+291, -0)
src/views/feeds/Feeds.vue                  (+590, -0)
src/views/jobs/Jobs.vue                    (+289, -0)
src/views/bibliography/Bibliography.vue    (+265, -0)
src/views/activities/Activities.vue        (+294, -0)
src/views/information-of-interest/InformationOfInterest.vue (+469, -36)
src/views/components/Notifications.vue     (+332, -0)
src/views/home/Shortcuts.vue              (+153, -0)
src/views/components/Menu.vue              (+42, -7)
```

### New Files
```
src/views/courses/Detail_old.vue           (backup)
MEJORAS_IMPLEMENTADAS.md                   (documentation) 
RESUMEN_TECNICO.md                         (technical summary)
CHANGELOG.md                               (this file)
mejoras.txt                                (requirements)
INFORME_PRUEBAS_BIBLIOGRAFIA.md           (testing report)
```

### Configuration Updates
```
vue.config.js                             (file download config)
android/app/src/main/AndroidManifest.xml  (permissions)
capacitor.config.ts                       (app settings)
```

## Statistics
- **Total Lines Added**: 4,387
- **Total Lines Removed**: 1,153  
- **Net Lines Added**: +3,234
- **Files Modified**: 30+
- **Commits**: 8 major commits
- **Development Time**: ~2 weeks
- **Sections Improved**: 8 main sections

## Deployment Notes

### Prerequisites
- Node.js 16+
- Ionic CLI
- Capacitor CLI (for mobile builds)

### Build Commands
```bash
# Install dependencies
npm install

# Development server
npm run serve

# Production build  
npm run build

# Mobile build
ionic capacitor build android
ionic capacitor build ios
```

### Environment Configuration
- API endpoints configured in `.env`
- Network security config updated for Android
- File download permissions configured

## Future Roadmap

### Phase 1: User Testing
- [ ] Beta testing with real users
- [ ] Performance monitoring setup  
- [ ] Analytics implementation
- [ ] Bug fixes based on feedback

### Phase 2: Advanced Features
- [ ] Push notifications integration
- [ ] Offline functionality
- [ ] Advanced search with filters
- [ ] User preferences and customization

### Phase 3: Platform Expansion  
- [ ] iOS App Store deployment
- [ ] Google Play Store optimization
- [ ] Web app PWA features
- [ ] Desktop application consideration

---

**Maintainer**: Miguel Maidana  
**Project**: APP-GRADUADOS  
**Client**: Centro de Graduados - Facultad de Derecho  
**Last Updated**: September 15, 2024
