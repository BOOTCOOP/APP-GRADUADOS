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
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Benefits",
  setup() {
    const store = useStore();
    const loading = ref(true);
    const error = ref(null);

    function getImageUrl(logo: string): string {
      if (!logo) {
        return "/assets/img/imagen-no-disponible.jpg";
      }

      // 1) Base de tu API: quita la parte “/api” si existe
      const raw = import.meta.env.VITE_API_URL || "";
      const apiBase =
        raw.replace(/\/api\/?$/, "") || "https://graduados.derecho.uba.ar";

      // 2) Asegúrate de que la ruta venga sin slash repetido
      //    benefit.logo podría venir como "benefits/originals/…"
      //    o "/storage/benefits/…", o incluso "storage/benefits/…"
      let path = logo;
      // Si ya incluye "storage", no lo dupliques
      if (!/^\/?storage\//.test(path)) {
        // quita cualquier "/" al inicio y añade "/storage/"
        path = "/storage/" + path.replace(/^\/+/, "");
      } else {
        // si empieza con "/storage", mantenlo y solo quita "/" de más
        path = "/" + path.replace(/^\/+/, "");
      }

      return `${apiBase}${path}`;
    }

    function formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES");
    }

    async function loadBenefits() {
      loading.value = true;
      error.value = null;

      try {
        await store.dispatch("benefits/fetchBenefits");
        loading.value = false;
      } catch (err) {
        loading.value = false;
      }
    }

    // Dispatch the action to fetch benefits when the component mounts
    onMounted(() => {
      loadBenefits();
    });

    // Define a computed property so it stays reactive
    const benefits = computed(() => {
      const result = store.state.benefits.benefits;
      return result;
    });

    return {
      benefits,
      loading,
      error,
      getImageUrl,
      formatDate,
      loadBenefits,
    };
  },
});
</script>

<style scoped>
/* El padding horizontal lo pone el layout (.page-body): acá solo el ancho máximo
   para que en tablet/web no se estire a lo ancho de la pantalla. */
.benefits-container {
  max-width: 1200px;
  margin: 0 auto;
}

.benefits-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--app-text-title);
  margin-bottom: var(--app-spacing-xs);
  text-align: center;
  letter-spacing: -0.3px;
}

.benefits-subtitle {
  font-size: 14px;
  color: var(--app-text-secondary);
  margin-bottom: var(--app-spacing-xl);
  text-align: center;
}

.benefits-grid {
  display: grid;
  /* 300px de mínimo no entra en un celular de 360px menos gutters: la card
     desbordaba el ancho. 260px sí, y en pantallas grandes sigue armando varias
     columnas. */
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
  gap: var(--app-spacing-lg);
}

.benefit-card {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  overflow: hidden;
  box-shadow: var(--app-shadow-sm);
  transition: box-shadow var(--app-duration) var(--app-ease),
              transform var(--app-duration-fast) var(--app-ease);
}

.benefit-card:hover {
  box-shadow: var(--app-shadow-md);
}

/* Feedback de tap: el hover de -5px no existe en un celular. */
.benefit-link:active .benefit-card {
  transform: scale(0.99);
  box-shadow: var(--app-shadow-xs);
}

.benefit-link {
  text-decoration: none;
  color: inherit;
  display: block;
  -webkit-tap-highlight-color: transparent;
}

.benefit-link:focus-visible {
  outline: none;
}

.benefit-link:focus-visible .benefit-card {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

/* Relación de aspecto en lugar de altura fija, igual que en Noticias. */
.benefit-image {
  aspect-ratio: 16 / 9;
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

/*
 * Paleta alineada a la marca. Esta pantalla venía con colores sueltos que no
 * salían de ningún token: #333/#666/#555 para el texto y, sobre todo, un CTA
 * AZUL (#3498db) y un descuento ROJO (#e74c3c) dentro de una app violeta.
 */
.benefit-content {
  padding: var(--app-spacing-lg);
}

.benefit-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text-title);
  margin: 0 0 var(--app-spacing-sm) 0;
  line-height: 1.35;
  letter-spacing: -0.2px;
}

.benefit-discount {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: var(--app-spacing-md);
}

.discount-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-primary);
}

.discount-label {
  font-size: 13px;
  color: var(--app-text-secondary);
}

.benefit-description {
  font-size: 14px;
  color: var(--app-text-body);
  margin-bottom: var(--app-spacing-md);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.benefit-dates {
  display: flex;
  align-items: center;
  margin-bottom: var(--app-spacing-md);
  padding: var(--app-spacing-sm) var(--app-spacing-md);
  background: var(--app-surface-alt);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);
}

.date-icon {
  font-size: 18px;
  margin-right: var(--app-spacing-sm);
}

.date-info {
  flex: 1;
}

.date-label {
  font-size: 11px;
  color: var(--app-text-secondary);
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 700;
}

.date-value {
  font-size: 13px;
  color: var(--app-text-title);
  font-weight: 600;
}

.benefit-cta {
  text-align: center;
  margin-top: var(--app-spacing-md);
}

/* Es un <span> decorativo dentro del <a> que envuelve la card, no un botón
   propio: sin pointer-events para que el tap siempre lo tome el enlace. */
.cta-button {
  display: inline-block;
  background: var(--app-primary-soft);
  color: var(--ion-color-primary);
  padding: 9px 20px;
  border-radius: var(--app-radius-pill);
  font-size: 13px;
  font-weight: 700;
  pointer-events: none;
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
  border: 4px solid var(--app-border-strong);
  border-radius: 50%;
  border-top: 4px solid var(--ion-color-primary);
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
  margin-top: var(--app-spacing-md);
  /* Llega a los 44px de alto mínimo (antes ~38px) */
  min-height: var(--app-tap-target);
  padding: 0 22px;
  background-color: var(--ion-color-primary);
  color: #fff;
  border: none;
  border-radius: var(--app-radius-pill);
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  transition: opacity var(--app-duration) var(--app-ease);
}

.retry-button:active {
  opacity: 0.85;
}

/*
 * Se quitaron las dos media queries de alturas: se contradecían entre sí
 * (150px a <=768px y de vuelta 180px a <=480px, o sea la pantalla MÁS chica
 * tenía la imagen MÁS alta). Ahora `aspect-ratio` resuelve todos los anchos y
 * `auto-fill minmax(min(260px,100%))` las columnas, sin breakpoints.
 */
</style>
