import ApiToken from '@/utils/apitoken';

function token (instance) {
    instance.interceptors.request.use(config => {
        config.headers['Authorization'] = 'Bearer ' + ApiToken.get();
        return config;
    }, error => {
        return Promise.reject(error);
    });
}

export default token;
