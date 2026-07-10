import router from '@/router';
import User from '@/utils/user';
import ApiToken from '@/utils/apitoken';
import store from '@/store';

function authenticate (instance) {
    instance.interceptors.response.use(response => {
        return response;
    }, error => {
        // Solo expulsar si había sesión (token expirado/revocado).
        // Un 401 sin token corresponde a un anónimo: se rechaza en silencio.
        if ([401].includes(error.response?.status) && ApiToken.isSet()) {
            User.refresh();

            store.dispatch("ui/toastr/create", "Volvé a iniciar sesión");

            const current = router.currentRoute.value;
            if (current.name !== "login") {
                router.replace({ name: "login", query: { redirect: current.fullPath } });
            }
        }
        
        if ([403].includes(error.response?.status)) {
            store.dispatch("ui/toastr/create", "No tienes permiso para realizar esta acción");
        }

        return Promise.reject(error);
    });
}

export default authenticate;
