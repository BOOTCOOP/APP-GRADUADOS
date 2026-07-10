import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { showForceUpdateAlert } from '@/uses/appUpdate';

// Resolvemos la versión instalada UNA sola vez (App.getInfo es async) para no
// penalizar cada request. En web no se envía el header.
let versionPromise: Promise<string | null> | null = null;

function getAppVersion(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) return Promise.resolve(null);

    if (!versionPromise) {
        versionPromise = App.getInfo()
            .then((info) => info.version)
            .catch(() => null);
    }

    return versionPromise;
}

function forceUpdate (instance) {
    instance.interceptors.request.use(async config => {
        const version = await getAppVersion();
        if (version) {
            config.headers['X-App-Version'] = version;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(response => {
        return response;
    }, error => {
        // Red de seguridad: si el backend responde 426 Upgrade Required,
        // mostramos el mismo alert bloqueante del chequeo de min_version.
        // La dedup (no apilar alerts si fallan N requests) la resuelve el
        // flag módulo-level de showForceUpdateAlert.
        if (error.response?.status === 426) {
            const body = error.response.data || {};
            showForceUpdateAlert(body.data || body);
        }

        return Promise.reject(error);
    });
}

export default forceUpdate;
