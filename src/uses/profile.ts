import axios from "@/libs/axios";
import User from "@/utils/user";

export const useProfile = () => {
    const get = () => {
        return new Promise((resolve) => {
            resolve(User.get());
        })
    }

    const update = (data) => {
        return new Promise((resolve, reject) => {
            axios.put("profile", data)
                .then(response => {
                    User.set(response.data.data);
                    resolve(response.data.data)
                })
                .catch(error => reject(error))
        })
    }

    const password = (data) => {
        return new Promise((resolve, reject) => {
            axios.put("profile/password", data)
                .then(response => {
                    resolve(response)
                })
                .catch(error => reject(error))
        })
    }

    return {
        get,
        update,
        password
    }
}