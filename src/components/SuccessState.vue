<template>
  <div class="success-state">
    <!--
      Animación hecha con SVG + CSS en vez de Lottie: no agrega runtime
      (lottie-web pesa ~250kB) ni un JSON que haya que bundlear, escala sin
      pixelarse en cualquier densidad, toma los colores del tema y funciona sin
      conexión dentro de la app nativa. Todo se anima con transform/opacity y
      stroke-dashoffset, que corren en la GPU.
    -->
    <div class="anim" :class="`anim--${variant}`" aria-hidden="true">
      <!-- Ondas que salen del centro: dan la sensación de "algo salió/llegó" -->
      <span class="pulse pulse--1"></span>
      <span class="pulse pulse--2"></span>

      <svg class="art" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Disco de fondo -->
        <circle class="disc" cx="64" cy="64" r="44" />

        <template v-if="variant === 'email'">
          <!-- Hoja que sale del sobre -->
          <g class="sheet">
            <rect x="42" y="30" width="44" height="34" rx="4" />
            <rect class="sheet-line sheet-line--1" x="49" y="39" width="30" height="3.2" rx="1.6" />
            <rect class="sheet-line sheet-line--2" x="49" y="47" width="22" height="3.2" rx="1.6" />
          </g>

          <!-- Cuerpo del sobre -->
          <g class="envelope">
            <path
              class="envelope-body"
              d="M32 56h64a6 6 0 0 1 6 6v30a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V62a6 6 0 0 1 6-6Z"
            />
            <!-- Solapa delantera: tapa la hoja, así parece que entró al sobre -->
            <path class="envelope-flap" d="M26 62l32 22a10 10 0 0 0 12 0l32-22v6L70 92a10 10 0 0 1-12 0L26 68v-6Z" />
          </g>
        </template>

        <!-- Tilde central para el caso genérico -->
        <path
          v-else
          class="check check--center"
          d="M45 65.5 58.5 79 84 51"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <!-- Chapita con el tilde (solo en la variante email) -->
      <svg
        v-if="variant === 'email'"
        class="badge"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="badge-disc" cx="20" cy="20" r="17" />
        <path
          class="check"
          d="M12.5 20.5 17.5 25.5 27.5 14.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <h2 class="success-title">{{ title }}</h2>
    <p v-if="message" class="success-message">{{ message }}</p>

    <!-- Datos extra (mail de contacto, fecha límite, etc.) -->
    <div v-if="$slots.details" class="success-details">
      <slot name="details"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  message?: string;
  /** `email` dibuja el sobre; `check` solo el tilde. */
  variant?: "email" | "check";
}

withDefaults(defineProps<Props>(), {
  message: "",
  variant: "check",
});
</script>

<style scoped>
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--app-spacing-lg) var(--app-spacing-sm);
}

/* ── Contenedor de la animación ──────────────────────────────────────────── */
.anim {
  position: relative;
  width: 168px;
  height: 168px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--app-spacing-xl);
}

.art {
  position: relative;
  width: 128px;
  height: 128px;
  z-index: 1;
}

/* Ondas concéntricas */
.pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 128px;
  height: 128px;
  margin: -64px 0 0 -64px;
  border-radius: 50%;
  background: var(--app-primary-soft);
  transform: scale(0.6);
  opacity: 0;
  animation: pulse-out 2.8s var(--app-ease) infinite;
}

.pulse--2 {
  animation-delay: 1.4s;
}

@keyframes pulse-out {
  0%   { transform: scale(0.62); opacity: 0; }
  25%  { opacity: 0.75; }
  100% { transform: scale(1.28); opacity: 0; }
}

/* Disco */
.disc {
  fill: var(--app-primary-soft);
  transform-origin: 64px 64px;
  animation: pop-in 620ms var(--app-ease) both;
}

/* ── Sobre ───────────────────────────────────────────────────────────────── */
.envelope-body {
  fill: var(--ion-color-primary);
}

.envelope-flap {
  fill: #fff;
  opacity: 0.22;
}

.envelope {
  transform-origin: 64px 80px;
  animation: pop-in 560ms var(--app-ease) 120ms both;
}

/* La hoja sube y se mete en el sobre: es el gesto de "enviado" */
.sheet rect:first-child {
  fill: #fff;
  stroke: var(--app-border-strong);
  stroke-width: 1.5;
}

.sheet-line {
  fill: var(--ion-color-primary);
  opacity: 0.55;
  transform-origin: left center;
}

.sheet {
  transform-origin: 64px 60px;
  animation: sheet-send 2.8s var(--app-ease) infinite;
}

@keyframes sheet-send {
  0%       { transform: translateY(16px) scale(0.94); opacity: 0; }
  14%, 46% { transform: translateY(0) scale(1); opacity: 1; }
  70%      { transform: translateY(22px) scale(0.9); opacity: 0; }
  100%     { transform: translateY(22px) scale(0.9); opacity: 0; }
}

.sheet-line--1 {
  animation: line-in 2.8s var(--app-ease) infinite;
}
.sheet-line--2 {
  animation: line-in 2.8s var(--app-ease) 120ms infinite;
}

@keyframes line-in {
  0%, 8%   { transform: scaleX(0); }
  22%, 60% { transform: scaleX(1); }
  100%     { transform: scaleX(1); }
}

/* ── Chapita del tilde ───────────────────────────────────────────────────── */
.badge {
  position: absolute;
  right: 12px;
  bottom: 16px;
  width: 46px;
  height: 46px;
  z-index: 2;
  transform-origin: center;
  /* Entra con un pequeño rebote, después de que la hoja "se envió" */
  animation: badge-in 520ms cubic-bezier(0.34, 1.56, 0.64, 1) 760ms both;
}

.badge-disc {
  fill: var(--ion-color-success);
  stroke: var(--app-surface);
  stroke-width: 3;
}

/* Tilde dibujado con stroke-dashoffset */
.check {
  stroke: #fff;
  stroke-width: 3.4;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw-check 460ms var(--app-ease) 1000ms both;
}

.check--center {
  stroke: var(--ion-color-primary);
  stroke-width: 7;
  stroke-dasharray: 70;
  stroke-dashoffset: 70;
  animation: draw-check 560ms var(--app-ease) 320ms both;
}

@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

@keyframes pop-in {
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

@keyframes badge-in {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* ── Texto ───────────────────────────────────────────────────────────────── */
.success-title {
  margin: 0 0 var(--app-spacing-sm);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--app-text-title);
  animation: rise-in 460ms var(--app-ease) 240ms both;
}

.success-message {
  margin: 0;
  max-width: 300px;
  /* 15px en vez del <small> anterior (~13px con color medium): el texto que
     explica qué hacer después no debería ser el más chico de la pantalla. */
  font-size: 15px;
  line-height: 1.55;
  color: var(--app-text-body);
  animation: rise-in 460ms var(--app-ease) 340ms both;
}

.success-details {
  width: 100%;
  margin-top: var(--app-spacing-xl);
  animation: rise-in 460ms var(--app-ease) 440ms both;
}

@keyframes rise-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Sin movimiento: se muestra el estado final, no la animación. */
@media (prefers-reduced-motion: reduce) {
  .pulse {
    display: none;
  }

  .disc,
  .envelope,
  .sheet,
  .sheet-line,
  .badge,
  .success-title,
  .success-message,
  .success-details {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .check,
  .check--center {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
