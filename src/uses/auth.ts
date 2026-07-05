import axios from "@/libs/axios";
import User from "@/utils/user";

export const useAuth = () => {
    // Login por DNI (ya no por email). Respuesta 200: { accessToken, token_type, user }.
    // 422 { dni: "..." } credenciales · 409 { pending:true, dni:"..." } registro sin confirmar.
    const login = (dni, password) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/login", { dni, password }).then(r => {
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

    // Paso 1 del wizard: a qué rama ir. Read-only, sin efectos.
    // Response: { case:"A", masked_email } | { case:"B" } | { case:"dispute", reason }.
    const checkDni = (dni) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/register/check-dni", { dni }).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // Inicia el registro. Acepta payload JSON (Caso A: {dni}; Caso B:
    // {dni,email,password,password_confirmation,type_id}) o FormData (Caso B con documento).
    const register = (data) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/register", data).then((response) => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // Reenvía el link del registro pendiente. Permite cambiar el mail (Caso B).
    // Response: { status:"sent", masked_email } | { status:"not_found" }.
    const resendRegistration = ({ dni, email }) => {
        const payload = email ? { dni, email } : { dni };
        return new Promise((resolve, reject) => {
            axios.post("auth/register/resend", payload).then((response) => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // Registra una disputa de DNI para resolución manual del admin.
    const dispute = ({ dni, contacto }) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/register/dispute", { dni, contacto }).then((response) => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // Reset por DNI: el link se manda al mail del legacy y se completa en la web del backend.
    const forgotPassword = (dni) => {
        return new Promise((resolve, reject) => {
            axios.post("auth/forgot-password", { dni }).then((response) => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    return {
        login,
        logout,
        checkDni,
        register,
        resendRegistration,
        dispute,
        forgotPassword,
    }
}
