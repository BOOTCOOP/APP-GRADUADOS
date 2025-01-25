import router from '@/router';
import User from '@/utils/user';
import store from '@/store';

function authenticate (instance) {
    instance.interceptors.response.use(response => {
        return response;
    }, error => {
        if ([401].includes(error.response?.status)) {
            User.refresh();

            store.dispatch("ui/toastr/create", "Volvé a iniciar sesión");

            router.replace({name:"login"})
        }
        
        if ([403].includes(error.response?.status)) {
            store.dispatch("ui/toastr/create", "No tienes permiso para realizar esta acción");
        }

        return Promise.reject(error);
    });
}

export default authenticate;
