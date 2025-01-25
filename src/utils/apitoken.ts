const LOCAL_STORAGE_KEY = (process.env.VUE_APP_APPLICATION_NAME.toUpperCase()) + "_API_TOKEN";

const ApiToken = {
    get() {
        return localStorage.getItem(LOCAL_STORAGE_KEY);
    },
    set: (token) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, token);
    },
    isSet: () => {
        return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
    },
    refresh: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
}

export default ApiToken;