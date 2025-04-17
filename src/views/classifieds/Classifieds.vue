<template>
  <graduados-app header-title="Avisos">
    <div class="ion-padding">
      <div class="refresh-container">
        <button @click="loadAvisos" class="refresh-button">
          <ion-icon :icon="refreshOutline"></ion-icon> Actualizar
        </button>
      </div>
      
      <!-- Botón para crear nuevo aviso -->
      <div class="action-container">
        <button @click="goToCreateAviso" class="create-button">
          <ion-icon :icon="addOutline"></ion-icon>
          Publicar Aviso
        </button>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando avisos...</p>
      </div>
      
      <div v-else class="avisos-container">
        <div v-if="avisos.length" class="avisos-list">
          <div
            v-for="aviso in avisos"
            :key="aviso.id"
            @click="goToDetail(aviso.id)"
            class="aviso-item"
          >
            <div class="aviso-thumbnail">
              <img v-if="aviso.file" :src="getFileUrl(aviso.file)" alt="Aviso thumbnail" />
              <div v-else class="placeholder-thumbnail">
                <ion-icon :icon="documentOutline" size="large"></ion-icon>
              </div>
            </div>
            
            <div class="aviso-content">
              <h2 class="aviso-title">{{ aviso.title }}</h2>
              <p class="aviso-description">{{ truncateText(aviso.description, 100) }}</p>
              <div class="aviso-contact">
                <ion-icon :icon="callOutline" size="small"></ion-icon>
                <span>{{ aviso.contact_phone }}</span>
              </div>
            </div>
            
            <div v-if="isMyAviso(aviso)" class="aviso-badge">Mi Aviso</div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
          <p>No hay avisos publicados en este momento.</p>
          <button @click="goToCreateAviso" class="create-button">
            Publicar mi primer aviso
          </button>
        </div>
      </div>
    </div>
  </graduados-app>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { 
  addOutline, 
  documentOutline, 
  callOutline, 
  alertCircleOutline,
  refreshOutline
} from 'ionicons/icons'

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

function goToDetail(id: number) {
  // Use direct path navigation instead of named route
  router.push(`/classifieds/${id}`)
}

function goToCreateAviso() {
  // Use direct path navigation instead of named route
  router.push('/classifieds/create')
}

function getFileUrl(filePath: string) {
  if (!filePath) return ''
  // Construir la URL completa para el archivo
  const baseUrl = process.env.VUE_APP_API_URL?.replace('/api', '') || ''
  return `${baseUrl}/storage/${filePath}`
}

function truncateText(text: string, maxLength: number) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

function isMyAviso(aviso: any) {
  return currentUser.value && aviso.user_id === currentUser.value.id
}

onMounted(() => {
  console.log('Classifieds component mounted');
  loadAvisos()
})
</script>

<style scoped>
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.aviso-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.aviso-thumbnail {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
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
  background-color: #f5f5f5;
}

.aviso-content {
  flex: 1;
  padding: 12px;
  overflow: hidden;
}

.aviso-title {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.aviso-description {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.aviso-contact {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #888;
}

.aviso-contact ion-icon {
  margin-right: 5px;
}

.aviso-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--ion-color-success);
  color: white;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
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
  .aviso-thumbnail {
    width: 60px;
    height: 60px;
  }
  
  .aviso-title {
    font-size: 14px;
  }
  
  .aviso-description {
    font-size: 12px;
  }
}
</style>

