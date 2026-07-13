<template>
  <graduados-app header-title="Actividades Online">
    <div class="ion-padding">
      <div class="youtube-redirect-container">
        <div class="youtube-card">
          <div class="youtube-header">
            <ion-icon :icon="logoYoutube" class="youtube-icon"></ion-icon>
            <h2>Canal Oficial de YouTube</h2>
          </div>
          
          <div class="youtube-content">
            <p class="youtube-description">
              Accede a todas nuestras <strong>actividades online</strong>, seminarios, conferencias 
              y contenido exclusivo del Centro de Graduados de la Facultad de Derecho de la UBA.
            </p>
            
            <div class="youtube-features">
              <div class="feature-item">
                <ion-icon :icon="playCircleOutline"></ion-icon>
                <span>Conferencias en vivo</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="libraryOutline"></ion-icon>
                <span>Material académico</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="schoolOutline"></ion-icon>
                <span>Seminarios especializados</span>
              </div>
            </div>
          </div>
          
          <div class="youtube-actions">
            <ion-button 
              expand="block" 
              color="danger" 
              size="large"
              @click="openYouTubeChannel"
              class="youtube-button"
            >
              <ion-icon :icon="logoYoutube" slot="start"></ion-icon>
              Ver Canal de YouTube
            </ion-button>
            
            <p class="youtube-url">
              <ion-icon :icon="linkOutline"></ion-icon>
              youtube.com/playlist?list=PL9y1i2ILzxlDxl8KFJHJrG294F2ert4Qy
            </p>
          </div>
        </div>
      </div>
    </div>
  </graduados-app>
</template>

<script lang="ts" setup>
import { IonIcon, IonButton } from '@ionic/vue'
import {
  // addOutline, // Comentado temporalmente - No funciona la funcionalidad
  alertCircleOutline,
  callOutline,
  documentOutline,
  refreshOutline,
  timeOutline,
  logoYoutube,
  playCircleOutline,
  libraryOutline,
  schoolOutline,
  linkOutline,
} from 'ionicons/icons'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

// Usamos computed para que la lista de avisos sea reactiva
const avisos = computed(() => store.state.avisos.avisos || [])
const loading = computed(() => store.state.avisos.loading)
const currentUser = computed(() => store.state.auth?.user || null)

async function loadAvisos() {
  try {
    await store.dispatch('avisos/fetchAvisos')
    console.log('Avisos cargados:', avisos.value)
  } catch (err) {
    console.error('Error al cargar avisos:', err)
  }
}

// Función para abrir el canal de YouTube
function openYouTubeChannel() {
  window.open('https://www.youtube.com/playlist?list=PL9y1i2ILzxlDxl8KFJHJrG294F2ert4Qy', '_system');
}

function goToDetail(id: number) {
  // Use direct path navigation instead of named route
  router.push(`/classifieds/${id}`)
}

// FUNCIÓN COMENTADA TEMPORALMENTE - No funciona la funcionalidad de crear avisos
/*
function goToCreateAviso() {
  // Use direct path navigation instead of named route
  router.push('/classifieds/create')
}
*/

function getImageUrl(logo: string): string {
  if (!logo) {
    return '/assets/img/imagen-no-disponible.jpg'
  }

  // 1) Base de tu API: quita la parte “/api” si existe
  const raw = import.meta.env.VITE_API_URL || ''
  const apiBase =
    raw.replace(/\/api\/?$/, '') || 'https://graduados.derecho.uba.ar'

  // 2) Asegúrate de que la ruta venga sin slash repetido
  //    benefit.logo podría venir como "benefits/originals/…"
  //    o "/storage/benefits/…", o incluso "storage/benefits/…"
  let path = logo
  // Si ya incluye "storage", no lo dupliques
  if (!/^\/?storage\//.test(path)) {
    // quita cualquier "/" al inicio y añade "/storage/"
    path = '/storage/' + path.replace(/^\/+/, '')
  } else {
    // si empieza con "/storage", mantenlo y solo quita "/" de más
    path = '/' + path.replace(/^\/+/, '')
  }

  return `${apiBase}${path}`
}

function truncateText(text: string, maxLength: number) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

function isMyAviso(aviso: any) {
  return currentUser.value && aviso.user_id === currentUser.value.id
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  console.log('Classifieds component mounted')
  loadAvisos()
})
</script>

<style scoped>
/* Estilos para la sección de YouTube */
.youtube-redirect-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
}

.youtube-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out;
}

.youtube-header {
  margin-bottom: 24px;
}

.youtube-icon {
  font-size: 64px;
  color: #ff0000;
  margin-bottom: 16px;
}

.youtube-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.youtube-content {
  margin-bottom: 32px;
}

.youtube-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.youtube-features {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin: 24px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.feature-item ion-icon {
  font-size: 20px;
  color: var(--ion-color-primary);
}

.youtube-actions {
  margin-top: 32px;
}

.youtube-button {
  --border-radius: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 16px;
  --box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
  transition: transform 0.2s ease;
}

.youtube-button:hover {
  transform: translateY(-2px);
}

.youtube-url {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.youtube-url ion-icon {
  font-size: 16px;
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .youtube-redirect-container {
    padding: 16px 0;
  }
  
  .youtube-card {
    padding: 24px 20px;
    margin: 0 8px;
  }
  
  .youtube-header h2 {
    font-size: 24px;
  }
  
  .youtube-icon {
    font-size: 48px;
  }
  
  .youtube-features {
    flex-direction: column;
    gap: 16px;
  }
  
  .youtube-description {
    font-size: 15px;
  }
}

/* Estilos originales para otros elementos */
.refresh-container {
  margin-bottom: 15px;
}

.refresh-button {
  background: none;
  border: none;
  color: var(--ion-color-primary);
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
}

.refresh-button ion-icon {
  margin-right: 5px;
}

.action-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.create-button {
  display: flex;
  align-items: center;
  background-color: var(--ion-color-primary);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: var(--ion-color-primary-shade);
}

.create-button ion-icon {
  margin-right: 5px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--ion-color-primary);
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.avisos-container {
  min-height: calc(100vh - 200px);
}

.avisos-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.aviso-item {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.aviso-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.aviso-thumbnail {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  margin: 16px;
}

.aviso-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #9ca3af;
}

.aviso-content {
  flex: 1;
  padding: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.aviso-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.aviso-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-grow: 1;
}

.aviso-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.contact-info ion-icon {
  font-size: 16px;
  color: #9ca3af;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
}

.date-info ion-icon {
  font-size: 14px;
}

.aviso-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #10b981;
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  text-align: center;
}

.empty-state ion-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 15px;
}

.empty-state p {
  margin-bottom: 20px;
  color: #666;
}

@media (max-width: 480px) {
  .aviso-item {
    margin-bottom: 12px;
  }

  .aviso-thumbnail {
    width: 90px;
    height: 90px;
    margin: 12px;
  }

  .aviso-content {
    padding: 16px 16px 16px 0;
  }

  .aviso-title {
    font-size: 16px;
    margin-bottom: 6px;
  }

  .aviso-description {
    font-size: 13px;
    margin-bottom: 12px;
  }

  .aviso-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .contact-info {
    font-size: 12px;
  }

  .date-info {
    font-size: 11px;
  }
}
</style>
