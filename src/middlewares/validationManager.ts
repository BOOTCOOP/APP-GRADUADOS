import store from '@/store';

// Todo: Probablemente por la validación de los forms no lo use
function validationManager (instance) {
    instance.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response?.status === 422) {
            const data = error.response.data || {};
            // Solo mostramos el toast global cuando el 422 trae un cuerpo de
            // validación real (errors) o un mensaje explícito (desc). Los 422
            // "shape de campo" (p.ej. login: { dni: "..." }) los maneja la
            // vista inline, sin toast espurio "Hubo un error".
            if (data.errors) {
                const first = Object.keys(data.errors)[0];
                store.dispatch("ui/toastr/danger", data.errors[first][0]);
            } else if (data.desc) {
                store.dispatch("ui/toastr/danger", data.desc);
            } else if (data.message) {
                // Rechazos de reglas de negocio (p.ej. enroll: "El taller ya
                // finalizó."). No pisa los casos anteriores: los 422 de
                // validación Laravel traen errors y entran por esa rama.
                store.dispatch("ui/toastr/danger", data.message);
            }
        }
        return Promise.reject(error);
    });
}

export default validationManager;
