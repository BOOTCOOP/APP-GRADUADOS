import axios from "@/libs/axios";
import User from "@/utils/user";

// Normaliza la respuesta de perfil: el backend puede devolver el UserResource
// envuelto en { data: {...} } o plano. Guardamos el user y lo devolvemos.
function persistUser(response) {
    const user = response.data?.data ?? response.data;
    User.set(user);
    return user;
}

export const useProfile = () => {
    const get = () => {
        return new Promise((resolve) => {
            resolve(User.get());
        })
    }

    // PUT /api/profile — solo datos personales del legacy.
    // DNI y email NO se editan desde acá. El tipo tampoco (ver changeType).
    const update = (data) => {
        const payload: any = {
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            birth_date: data.birth_date,
        };
        if (data.password) {
            payload.password = data.password;
            payload.password_confirmation = data.password_confirmation;
        }

        return new Promise((resolve, reject) => {
            axios.put("profile", payload)
                .then(response => resolve(persistUser(response)))
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

    // POST /api/profile/type-validation — sube el documento (multipart) y crea la
    // validación pendiente para el tipo actual. También es el reintento tras rechazo.
    const typeValidation = (formData) => {
        return new Promise((resolve, reject) => {
            axios.post("profile/type-validation", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
                .then(response => resolve(persistUser(response)))
                .catch(error => reject(error))
        })
    }

    // PUT /api/profile/type — cambia el tipo declarado; el backend recalcula la validación.
    const changeType = (type_id) => {
        return new Promise((resolve, reject) => {
            axios.put("profile/type", { type_id })
                .then(response => resolve(persistUser(response)))
                .catch(error => reject(error))
        })
    }

    return {
        get,
        update,
        password,
        typeValidation,
        changeType,
    }
}
