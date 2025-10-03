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
              youtube.com/@centrodegraduadosDerechoUBA
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
  logoYoutube,
  playCircleOutline,
  libraryOutline,
  schoolOutline,
  linkOutline,
} from 'ionicons/icons'

// Función para abrir el canal de YouTube
function openYouTubeChannel() {
  window.open('https://www.youtube.com/@centrodegraduadosDerechoUBA', '_blank');
}
</script>

<style scoped>
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

/* Animaciones */
.youtube-card {
  animation: fadeInUp 0.6s ease-out;
}

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

.youtube-button:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>