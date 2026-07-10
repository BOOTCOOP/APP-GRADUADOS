import ApiToken from '@/utils/apitoken';

function token (instance) {
    instance.interceptors.request.use(config => {
        if (ApiToken.isSet()) {
            config.headers['Authorization'] = 'Bearer ' + ApiToken.get();
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });
}

export default token;
