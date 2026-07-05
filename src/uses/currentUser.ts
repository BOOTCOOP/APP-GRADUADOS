import { ref, computed } from "vue";

// Capa reactiva sobre el usuario logueado. La fuente de verdad sigue siendo
// localStorage (via src/utils/user.ts), pero exponemos un ref para que los
// badges de validación y el gate de inscripción reaccionen a los cambios.
//
// user.ts notifica a este módulo (setCurrentUser / clearCurrentUser) cada vez
// que guarda o borra. Para evitar un ciclo de imports, acá hidratamos leyendo
// localStorage directamente en lugar de importar User.

const LOCAL_STORAGE_KEY =
  (process.env.VUE_APP_APPLICATION_NAME as string).toUpperCase() + "_USER";

function hydrate() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

const currentUser = ref<any>(hydrate());

export function setCurrentUser(user: any) {
  currentUser.value = user;
}

export function clearCurrentUser() {
  currentUser.value = null;
}

export function useCurrentUser() {
  const profileComplete = computed(() => currentUser.value?.profile_complete ?? true);
  const canOperate = computed(() => currentUser.value?.can_operate ?? true);
  const operabilityIssue = computed(() => currentUser.value?.operability_issue ?? null);
  const typeValidationStatus = computed(
    () => currentUser.value?.type_validation_status ?? null
  );

  return {
    user: currentUser,
    profileComplete,
    canOperate,
    operabilityIssue,
    typeValidationStatus,
  };
}
