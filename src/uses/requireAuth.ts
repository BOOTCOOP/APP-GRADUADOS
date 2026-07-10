import { useIonRouter } from "@ionic/vue";
import { useRoute } from "vue-router";
import { useCurrentUser } from "@/uses/currentUser";

// Valida que un ?redirect= sea un path interno de la app.
// Rechaza URLs absolutas (https://...) y protocol-relative (//evil.com).
export function safeRedirect(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return null;
  return raw;
}

// Helper para los "momentos puntuales" que requieren sesión: si no hay
// usuario, lleva al login con retorno a la ruta actual (o a returnTo).
export function useRequireAuth() {
  const { isLoggedIn } = useCurrentUser();
  const ionRouter = useIonRouter();
  const route = useRoute();

  function goToLogin(returnTo?: string) {
    ionRouter.push({
      name: "login",
      query: { redirect: returnTo ?? route.fullPath },
    });
  }

  function requireAuth(action: () => void, returnTo?: string) {
    if (isLoggedIn.value) {
      action();
    } else {
      goToLogin(returnTo);
    }
  }

  return { isLoggedIn, goToLogin, requireAuth };
}
