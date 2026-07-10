import { alertController } from '@ionic/vue';

const defaultOptions = {
    cssClass: 'app-alert',
    header: '',
    subHeader: '',
    buttons: {
        confirm: {
            text: 'Confirmar',
        },
        cancel: {
            text: 'Cancelar',
            handler: () => undefined
        },
    },
};

export default {
    namespaced: true,
    actions: {
        confirm(ctx, config) {
            let confirmText = defaultOptions.buttons.confirm.text;
            if (config.buttons && config.buttons.confirm && config.buttons.confirm.text) {
                confirmText = config.buttons.confirm.text;
            }

            let cancelText = defaultOptions.buttons.cancel.text;
            if (config.buttons && config.buttons.cancel && config.buttons.cancel.text) {
                cancelText = config.buttons.cancel.text;
            }
            
            let handlerCancel = defaultOptions.buttons.cancel.handler
            if (config.buttons && config.buttons.cancel && config.buttons.cancel.handler) {
                handlerCancel = config.buttons.cancel.handler;
            }

            const options = {
                cssClass: config.cssClass || defaultOptions.cssClass,
                header: config.header || defaultOptions.header,
                subHeader: config.subHeader || defaultOptions.subHeader,
                buttons: [
                    {
                        text: cancelText,
                        role: 'cancel',
                        handler: handlerCancel
                    },
                    {
                        text: confirmText,
                        role: 'confirm',
                        handler: config.handler,
                    }
                ],
            };

            alertController.create(options).then(alert => alert.present());
        },
        // Alert bloqueante: sin backdrop dismiss, sin botón cancelar y el botón
        // de acción retorna false para que el alert NUNCA se cierre (force update).
        blocking(ctx, config) {
            const options = {
                cssClass: config.cssClass || defaultOptions.cssClass,
                header: config.header || defaultOptions.header,
                message: config.message || '',
                backdropDismiss: false,
                buttons: [
                    {
                        text: config.buttonText || 'Actualizar',
                        handler: () => {
                            config.handler?.();
                            return false;
                        },
                    }
                ],
            };

            alertController.create(options).then(alert => alert.present());
        }
    }
}
