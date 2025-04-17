<template>
  <graduados-app :header-title="benefit.title || 'Detalle de Beneficio'">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando detalles del beneficio...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadBenefit" class="retry-button">Reintentar</button>
    </div>

    <div v-else class="benefit-detail-container">
      <div class="benefit-header">
        <div class="benefit-image">
          <img :src="getImageUrl(benefit.logo)" alt="Logo" />
        </div>
        <div class="benefit-info">
          <div class="benefit-type">{{ benefit.type }}</div>
          <h1 class="benefit-title">{{ benefit.title }}</h1>
          <div class="benefit-discount">
            <span class="discount-value"
              >{{ benefit.discount_percentage }}%</span
            >
            <span class="discount-label">de descuento</span>
          </div>
        </div>
      </div>

      <div class="benefit-content">
        <div class="benefit-section">
          <h2 class="section-title">Descripción</h2>
          <p class="benefit-description">{{ benefit.description }}</p>
        </div>

        <div class="benefit-section">
          <h2 class="section-title">Período de validez</h2>
          <div class="validity-dates">
            <div class="date-item">
              <div class="date-label">Desde:</div>
              <div class="date-value">{{ formatDate(benefit.start_date) }}</div>
            </div>
            <div class="date-separator"></div>
            <div class="date-item">
              <div class="date-label">Hasta:</div>
              <div class="date-value">{{ formatDate(benefit.end_date) }}</div>
            </div>
          </div>
        </div>

        <div class="benefit-section">
          <h2 class="section-title">Cómo utilizar este beneficio</h2>
          <div class="usage-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3 class="step-title">Presenta tu credencial</h3>
                <p class="step-description">
                  Muestra tu credencial de graduado en el establecimiento.
                </p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3 class="step-title">Menciona el beneficio</h3>
                <p class="step-description">
                  Indica que deseas utilizar el beneficio para graduados.
                </p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3 class="step-title">Disfruta tu descuento</h3>
                <p class="step-description">
                  El descuento se aplicará automáticamente a tu compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="benefit-actions">
        <router-link to="/beneficios" class="back-button">
          Volver a beneficios
        </router-link>
      </div>
    </div>
  </graduados-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'BenefitDetail',
  setup() {
    const route = useRoute()
    const store = useStore()
    const benefit = ref({})
    const loading = ref(true)
    const error = ref(null)

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

    function formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES')
    }

    async function loadBenefit() {
      const id = route.params.id
      if (!id) return

      loading.value = true
      error.value = null

      try {
        await store.dispatch('benefits/fetchBenefit', id)
        benefit.value = store.state.benefits.currentBenefit
        console.log('Benefit detail loaded:', benefit.value)
        loading.value = false
      } catch (err) {
        console.error('Error al cargar el beneficio', err)
        loading.value = false
      }
    }

    onMounted(() => {
      loadBenefit()
    })

    return {
      benefit,
      loading,
      error,
      getImageUrl,
      formatDate,
      loadBenefit,
    }
  },
})
</script>

<style scoped>
.benefit-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.benefit-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.benefit-image {
  height: 250px;
  width: 100%;
  overflow: hidden;
}

.benefit-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.benefit-info {
  padding: 25px;
}

.benefit-type {
  display: inline-block;
  background: #f1c40f;
  color: #333;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
}

.benefit-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.3;
}

.benefit-discount {
  display: flex;
  align-items: baseline;
}

.discount-value {
  font-size: 32px;
  font-weight: 700;
  color: #e74c3c;
  margin-right: 8px;
}

.discount-label {
  font-size: 16px;
  color: #666;
}

.benefit-content {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.benefit-section {
  margin-bottom: 30px;
}

.benefit-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.benefit-description {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}

.validity-dates {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.date-item {
  flex: 1;
}

.date-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.date-value {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.date-separator {
  width: 1px;
  height: 40px;
  background: #ddd;
  margin: 0 20px;
}

.usage-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step {
  display: flex;
  align-items: flex-start;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  margin-right: 15px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.step-description {
  font-size: 14px;
  color: #555;
  margin: 0;
  line-height: 1.5;
}

.benefit-actions {
  display: flex;
  justify-content: center;
}

.back-button {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease;
}

.back-button:hover {
  background: #2980b9;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
  min-height: 300px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.retry-button:hover {
  background-color: #2980b9;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .benefit-header {
    flex-direction: row;
  }

  .benefit-image {
    width: 40%;
    height: auto;
  }

  .benefit-info {
    width: 60%;
  }
}

@media (max-width: 480px) {
  .benefit-title {
    font-size: 24px;
  }

  .discount-value {
    font-size: 28px;
  }

  .validity-dates {
    flex-direction: column;
    gap: 15px;
  }

  .date-separator {
    width: 100%;
    height: 1px;
    margin: 0;
  }
}
</style>
