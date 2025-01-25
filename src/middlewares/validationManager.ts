import store from '@/store';

// Todo: Probablemente por la validación de los forms no lo use
function validationManager (instance) {
    instance.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response?.status === 422) {
            let message = error.response.data.desc || 'Hubo un error';
            
            if(error.response.data.errors){
                const first = Object.keys(error.response.data.errors)[0];
                message = error.response.data.errors[first][0];
            }
            
            store.dispatch("ui/toastr/danger", message);
        }
        return Promise.reject(error);
    });
}

export default validationManager;
