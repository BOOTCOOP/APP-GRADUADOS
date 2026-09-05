<template>
  <ion-button
    class="cart-toggle"
    :fill="selected ? 'solid' : 'outline'"
    :color="selected ? 'success' : 'primary'"
    :size="size"
    shape="round"
    :aria-pressed="selected"
    :aria-label="`${label} ${item.title}`"
    @click.stop="onClick"
    @keydown.stop
  >
    <ion-icon
      :icon="selected ? checkmarkCircleOutline : addCircleOutline"
      slot="start"
      aria-hidden="true"
    ></ion-icon>
    {{ label }}
  </ion-button>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { addCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { computed } from "vue";
import { useStore } from "vuex";
import {
  MAX_CART_ITEMS,
  useEnrollmentCart,
  type CartItem,
} from "@/uses/enrollmentCart";

// `@keydown.stop` en el botón: dentro de una card tappable (Activity.vue,
// Course.vue) la raíz escucha enter/space para navegar al detalle. Sin frenar
// la propagación, activar el toggle con teclado hacía las dos cosas.
const props = withDefaults(
  defineProps<{
    item: CartItem;
    size?: "small" | "default" | "large";
  }>(),
  { size: "small" }
);

const store = useStore();
const { has, toggle } = useEnrollmentCart();

const selected = computed(() => has(props.item.type, props.item.id));
const label = computed(() =>
  selected.value ? "En mi selección" : "Agregar a mi selección"
);

function onClick() {
  // `null` = no entró porque la selección ya está en el tope de la API.
  if (toggle(props.item) === null) {
    store.dispatch(
      "ui/toastr/create",
      `Podés seleccionar hasta ${MAX_CART_ITEMS} actividades por vez.`
    );
  }
}
</script>

<style scoped>
.cart-toggle {
  margin: 0;
  min-height: var(--app-tap-target);
  font-weight: 600;
  font-size: 13px;
  text-transform: none;
}
</style>
