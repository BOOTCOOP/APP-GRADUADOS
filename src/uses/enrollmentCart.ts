import { computed, ref, watch } from "vue";

// "Mi selección": el carrito de inscripciones a talleres y cursos.
//
// Es un carrito sólo en la forma: no reserva cupo, no cobra nada y no existe en
// el backend. Es una lista local de intenciones que recién al confirmar se
// manda entera a `POST enrollments/batch`. Por eso el cupo se revalida al abrir
// la pantalla de revisión (ver views/inscriptions/Cart.vue): entre que la
// persona agrega un taller y confirma, puede haberse llenado.
//
// Vive acá y no en Vuex porque los módulos del store son repositorios de API
// sin estado (ver CLAUDE.md); el patrón de estado reactivo compartido del
// proyecto es el de uses/currentUser.ts, que es el que seguimos.

const LOCAL_STORAGE_KEY =
  import.meta.env.VITE_APPLICATION_NAME.toUpperCase() + "_ENROLLMENT_CART";

/** Mismo tope que `BatchEnrollment::MAX_ITEMS` en la API. */
export const MAX_CART_ITEMS = 20;

export type CartItemType = "workshop" | "course";

export interface CartItem {
  type: CartItemType;
  id: number;
  /** Snapshot para pintar la revisión sin esperar la red; se refresca al revalidar. */
  title: string;
  teachers?: string;
  start?: string;
  modality?: string;
}

/** Resultado del último `enrollments/batch`, para pintar la pantalla de éxito. */
export interface BatchResult {
  enrolled: Array<{ id: number; inscriptionable?: { title?: string } | null }>;
  failed: Array<{ type: CartItemType; id: number; title?: string | null; reason: string }>;
}

function hydrate(): CartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    // Defensivo: la clave la puede haber dejado una versión anterior de la app.
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function isCartItem(value: any): value is CartItem {
  return (
    value &&
    (value.type === "workshop" || value.type === "course") &&
    Number.isFinite(Number(value.id))
  );
}

const items = ref<CartItem[]>(hydrate());

watch(
  items,
  (value) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Modo privado / cuota llena: la selección sigue viva en memoria.
    }
  },
  { deep: true }
);

// El resultado del batch no se persiste: es de un solo uso, para la pantalla
// de éxito inmediatamente después de confirmar.
const lastResult = ref<BatchResult | null>(null);

function indexOf(type: CartItemType, id: number | string): number {
  return items.value.findIndex(
    (item) => item.type === type && item.id === Number(id)
  );
}

export function useEnrollmentCart() {
  const count = computed(() => items.value.length);
  const isFull = computed(() => items.value.length >= MAX_CART_ITEMS);

  function has(type: CartItemType, id: number | string): boolean {
    return indexOf(type, id) !== -1;
  }

  /** `false` si ya se llegó al tope; el llamador avisa. */
  function add(item: CartItem): boolean {
    if (has(item.type, item.id)) return true;
    if (isFull.value) return false;

    items.value = [...items.value, { ...item, id: Number(item.id) }];

    return true;
  }

  function remove(type: CartItemType, id: number | string): void {
    items.value = items.value.filter(
      (item) => !(item.type === type && item.id === Number(id))
    );
  }

  /** `null` = no entró por tope lleno; `true`/`false` = quedó dentro/fuera. */
  function toggle(item: CartItem): boolean | null {
    if (has(item.type, item.id)) {
      remove(item.type, item.id);

      return false;
    }

    return add(item) ? true : null;
  }

  function clear(): void {
    items.value = [];
  }

  /** Reemplaza el snapshot guardado con datos frescos de la API. */
  function refresh(type: CartItemType, id: number | string, data: Partial<CartItem>): void {
    const index = indexOf(type, id);
    if (index === -1) return;

    const next = [...items.value];
    next[index] = { ...next[index], ...data };
    items.value = next;
  }

  function setLastResult(result: BatchResult | null): void {
    lastResult.value = result;
  }

  return {
    items,
    count,
    isFull,
    has,
    add,
    remove,
    toggle,
    clear,
    refresh,
    lastResult,
    setLastResult,
  };
}
