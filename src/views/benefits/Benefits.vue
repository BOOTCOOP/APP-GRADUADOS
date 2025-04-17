<template>
  <graduados-app header-title="Beneficios">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando beneficios...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadBenefits" class="retry-button">Reintentar</button>
    </div>

    <div v-else-if="!benefits || benefits.length === 0" class="empty-container">
      <p>No hay beneficios disponibles en este momento.</p>
    </div>

    <div v-else class="benefits-container">
      <h1 class="benefits-title">Beneficios Exclusivos</h1>
      <p class="benefits-subtitle">
        Descuentos y promociones especiales para graduados
      </p>

      <div class="benefits-grid">
        <div v-for="benefit in benefits" :key="benefit.id" class="benefit-card">
          <router-link :to="`/beneficios/${benefit.id}`" class="benefit-link">
            <div class="benefit-image">
              <img :src="getImageUrl(benefit.logo)" alt="Logo" />
              <div class="benefit-badge">{{ benefit.type }}</div>
            </div>
            <div class="benefit-content">
              <h3 class="benefit-title">{{ benefit.title }}</h3>
              <div class="benefit-discount">
                <span class="discount-value"
                  >{{ benefit.discount_percentage }}%</span
                >
                <span class="discount-label">de descuento</span>
              </div>
              <p class="benefit-description">{{ benefit.description }}</p>
              <div class="benefit-dates">
                <div class="date-icon">📅</div>
                <div class="date-info">
                  <div class="date-label">Válido desde:</div>
                  <div class="date-value">
                    {{ formatDate(benefit.start_date) }} hasta
                    {{ formatDate(benefit.end_date) }}
                  </div>
                </div>
              </div>
              <div class="benefit-cta">
                <span class="cta-button">Ver detalles</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </graduados-app>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Benefits',
  setup() {
    const store = useStore()
    const loading = ref(true)
    const error = ref(null)

    function getImageUrl(logo) {
  if (!logo) return '/assets/img/imagen-no-disponible.jpg'
  
  const apiUrl = process.env.VUE_APP_API_URL
  const baseUrl = apiUrl.replace('/api', '')
  
  return `${baseUrl}/storage/${logo}`
}


    function formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES')
    }

    async function loadBenefits() {
      loading.value = true
      error.value = null

      try {
        await store.dispatch('benefits/fetchBenefits')
        console.log(
          'Benefits loaded in component:',
          store.state.benefits.benefits
        )
        loading.value = false
      } catch (err) {
        console.error('Error al cargar beneficios', err)
        loading.value = false
      }
    }

    // Dispatch the action to fetch benefits when the component mounts
    onMounted(() => {
      console.log('Benefits component mounted')
      loadBenefits()
    })

    // Define a computed property so it stays reactive
    const benefits = computed(() => {
      const result = store.state.benefits.benefits
      console.log('Computed benefits:', result)
      return result
    })

    return {
      benefits,
      loading,
      error,
      getImageUrl,
      formatDate,
      loadBenefits,
    }
  },
})
</script>

<style scoped>
.benefits-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.benefits-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.benefits-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.benefit-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.benefit-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.benefit-image {
  height: 180px;
  position: relative;
  overflow: hidden;
}

.benefit-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.benefit-card:hover .benefit-image img {
  transform: scale(1.05);
}

.benefit-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.benefit-content {
  padding: 20px;
}

.benefit-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.benefit-discount {
  display: flex;
  align-items: baseline;
  margin-bottom: 15px;
}

.discount-value {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
  margin-right: 5px;
}

.discount-label {
  font-size: 14px;
  color: #666;
}

.benefit-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.benefit-dates {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.date-icon {
  font-size: 20px;
  margin-right: 10px;
}

.date-info {
  flex: 1;
}

.date-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.date-value {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.benefit-cta {
  text-align: center;
  margin-top: 15px;
}

.cta-button {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.cta-button:hover {
  background: #2980b9;
}

.loading-container,
.error-container,
.empty-container {
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
@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  .benefits-title {
    font-size: 24px;
  }

  .benefit-image {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .benefit-image {
    height: 180px;
  }
}
</style>
