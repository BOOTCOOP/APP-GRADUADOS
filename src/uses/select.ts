import axios from "@/libs/axios";

export const useSelect = () => {
    const provincias = (data = {}) => {
        return new Promise((resolve, reject) => {
            axios.get("providers/provincias", data)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    }

    const localidades = (data = {}) => {
        return new Promise((resolve, reject) => {
            axios.get("providers/localidades", data)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    }

    const modalities = (data = {}) => {
        return new Promise((resolve, reject) => {
            axios.get("providers/modalities", data)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    }

    const genders = (data = {}) => {
        return new Promise((resolve, reject) => {
            axios.get("providers/genders", data)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    }

    const educationalLevels = (data = {}) => {
        return new Promise((resolve, reject) => {
            axios.get("select/educationalLevels", data)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    }

    const languages = (data = {}) => {
        return new Promise((resolve, reject) => {
            axios.get("providers/languages", data)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    }

    return {
        provincias,
        localidades,
        modalities,
        genders,
        educationalLevels,
        languages,
    }
}