import ApiToken from "./apitoken";

const LOCAL_STORAGE_KEY = (process.env.VUE_APP_APPLICATION_NAME.toUpperCase()) + "_USER";

const User = {
    get() {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },
    set: (data) => {
        let user = data;
        let token = null;

        if(data.user){
            token = data.accessToken;
            user = data.user;
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
        if(token) ApiToken.set(token);
    },
    isSet: () => {
        return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
    },
    refresh: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        ApiToken.refresh()
    }
}

export default User;