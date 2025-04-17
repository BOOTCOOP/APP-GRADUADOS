<template>
  <graduados-app
    :header-title="aviso?.title || 'Detalle del Aviso'"
    :header-show-back-button="true"
  >
    <div class="ion-padding">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando detalle...</p>
      </div>

      <div v-else-if="aviso" class="aviso-detail">
        <div class="aviso-header">
          <h1>{{ aviso.title }}</h1>
          <div v-if="isMyAviso" class="aviso-badge">Mi Aviso</div>
        </div>

        <!-- Archivo adjunto -->
        <div v-if="aviso.file" class="file-preview">
          <img
            v-if="isImageFile(aviso.file)"
            :src="getImageUrl(aviso.file)"
            alt="Imagen del aviso"
            class="aviso-image"
            @click="openFile(aviso.file)"
          />
          <button v-else class="document-button" @click="openFile(aviso.file)">
            <ion-icon :icon="documentOutline"></ion-icon>
            Ver documento adjunto
          </button>
        </div>

        <div class="description-section">
          <h2>Descripción</h2>
          <p>{{ aviso.description }}</p>
        </div>

        <div class="contact-section">
          <h2>Información de contacto</h2>
          <div class="contact-item">
            <div class="contact-icon">
              <ion-icon :icon="callOutline" color="primary"></ion-icon>
            </div>
            <div class="contact-info">
              <h3>Teléfono</h3>
              <p>{{ aviso.contact_phone }}</p>
            </div>
            <button
              class="contact-action"
              @click="callPhone(aviso.contact_phone)"
            >
              <ion-icon :icon="callOutline"></ion-icon>
            </button>
          </div>

          <div class="contact-item">
            <div class="contact-icon">
              <ion-icon :icon="mailOutline" color="primary"></ion-icon>
            </div>
            <div class="contact-info">
              <h3>Email</h3>
              <p>{{ aviso.contact_email }}</p>
            </div>
            <button
              class="contact-action"
              @click="sendEmail(aviso.contact_email)"
            >
              <ion-icon :icon="mailOutline"></ion-icon>
            </button>
          </div>
        </div>

        <div class="meta-section">
          <p class="date">Publicado: {{ formatDate(aviso.created_at) }}</p>
        </div>

        <!-- Botón para cancelar aviso (solo visible para el autor) -->
        <div v-if="isMyAviso" class="action-section">
          <button class="cancel-button" @click="cancelAviso">
            <ion-icon :icon="trashOutline"></ion-icon>
            Cancelar Aviso
          </button>
        </div>
      </div>

      <div v-else class="error-container">
        <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
        <p>No se pudo cargar el aviso o no existe.</p>
        <button class="back-button" @click="goBack">Volver a la lista</button>
      </div>
    </div>
  </graduados-app>
</template>

<script lang="ts" setup>
import { alertController } from '@ionic/vue'
import {
  alertCircleOutline,
  callOutline,
  documentOutline,
  mailOutline,
  trashOutline,
} from 'ionicons/icons'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

// Usamos computed para que los datos sean reactivos
const aviso = computed(() => store.state.avisos.currentAviso)
const loading = computed(() => store.state.avisos.loading)
const currentUser = computed(() => store.state.auth?.user || null)

const isMyAviso = computed(() => {
  return currentUser.value && aviso.value?.user_id === currentUser.value.id
})

async function loadAviso() {
  const id = route.params.id
  if (!id) return

  await store.dispatch('avisos/fetchAviso', id)
}

function getImageUrl(logo: string): string {
  if (!logo) {
    return '/assets/img/imagen-no-disponible.jpg'
  }

  // 1) Base de tu API: quita la parte “/api” si existe
  const raw = process.env.VUE_APP_API_URL || ''
  const apiBase =
    raw.replace(/\/api\/?$/, '') || 'https://api.graduados.kame-code.com'

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

function isImageFile(filePath: string) {
  if (!filePath) return false
  const extension = filePath.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
}

function openFile(filePath: string) {
  if (!filePath) return
  const url = getImageUrl(filePath)
  window.open(url, '_blank')
}

function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function callPhone(phone: string) {
  if (!phone) return
  window.open(`tel:${phone}`, '_system')
}

function sendEmail(email: string) {
  if (!email) return
  window.open(`mailto:${email}`, '_system')
}

async function cancelAviso() {
  const alert = await alertController.create({
    header: 'Confirmar',
    message:
      '¿Estás seguro de que deseas cancelar este aviso? Esta acción no se puede deshacer.',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Confirmar',
        role: 'confirm',
        handler: async () => {
          if (!aviso.value) return

          try {
            const success = await store.dispatch(
              'avisos/cancelAviso',
              aviso.value.id
            )
            if (success) {
              router.push('/classifieds')
            }
          } catch (error) {
            console.error('Error al cancelar aviso:', error)
          }
        },
      },
    ],
  })

  await alert.present()
}

function goBack() {
  router.push('/classifieds')
}

onMounted(() => {
  console.log('AvisoDetail component mounted')
  loadAviso()
})
</script>

<style scoped>
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 30px;
  text-align: center;
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

.aviso-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

.aviso-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.aviso-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.aviso-badge {
  background-color: var(--ion-color-success);
  color: white;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 15px;
}

.file-preview {
  margin: 20px 0;
}

.aviso-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.document-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 15px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: var(--ion-color-primary);
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.document-button:hover {
  background-color: #e9e9e9;
}

.document-button ion-icon {
  margin-right: 8px;
}

.description-section,
.contact-section,
.meta-section {
  margin: 25px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.description-section h2,
.contact-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.contact-icon {
  margin-right: 15px;
  font-size: 20px;
}

.contact-info {
  flex: 1;
}

.contact-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.contact-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.contact-action {
  background: none;
  border: none;
  color: var(--ion-color-primary);
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.date {
  font-size: 14px;
  color: #888;
  text-align: right;
  margin: 0;
}

.action-section {
  margin-top: 30px;
}

.cancel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background-color: var(--ion-color-danger);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: var(--ion-color-danger-shade);
}

.cancel-button ion-icon {
  margin-right: 8px;
}

.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--ion-color-primary);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: var(--ion-color-primary-shade);
}

.error-container ion-icon {
  font-size: 48px;
  color: var(--ion-color-danger);
  margin-bottom: 15px;
}
</style>
