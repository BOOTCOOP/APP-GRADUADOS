import axios from "@/libs/axios";
import User from "@/utils/user";

export const useAuth = () => {
    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/login", {email, password}).then(r => {
                User.set(r.data)
                resolve(r.data.user)
            }).catch(error => {
                reject(error)
            }) 
        })
    }

    const logout = () => {
        return new Promise((resolve, reject) => {
            axios.post("auth/logout").then(() => {
                const user = User.get();
                
                User.refresh();

                resolve(user)
            }).catch(error => {
                reject(error)
            }) 
        })
    }

    const register = (data) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/register", data).then((response) => {
                console.log(response);
                
                resolve(response)
            }).catch(error => {
                reject(error)
            }) 
        })
    }

    const forgotPassword = (email) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/forgot-password", { email }).then((response) => {
                resolve(response)
            }).catch(error => {
                reject(error)
            }) 
        })
    }
    
    const changePassword = (data) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/reset-password", data).then((response) => {
                resolve(response)
            }).catch(error => {
                reject(error)
            }) 
        })
    }

    const emailAvailable = (email) => {
        return new Promise((resolve, reject) => {
            axios.post("users/email-available", {email}).then((response) => {      
                resolve(response)
            }).catch(error => {
                reject(error)
            }) 
        })
    }

    return {
        login,
        logout,
        register,
        forgotPassword,
        changePassword,
        emailAvailable
    }
}