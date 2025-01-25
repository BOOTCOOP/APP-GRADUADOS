import { toastController } from '@ionic/vue';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

const defaultOptions = {
    cssClass: '',
    duration: 1500,
    position: 'bottom',
    color: "dark",
    icon: undefined
};

export default {
    namespaced: true,
    actions: {
        create(ctx, config) {
            config = typeof config == 'object' ? config : {message:config};

            const options = {
                message: config.message,
                duration: config.duration || defaultOptions.duration,
                position: config.position || defaultOptions.position,
                icon: config.icon || defaultOptions.icon,
                color: config.color || defaultOptions.color,
            };

            toastController.create(options).then(alert => alert.present());
        },
        default(ctx, config){
            config = typeof config == 'object' ? config : {message: config};

            ctx.dispatch("create", config)
        },
        success(ctx, message){
            ctx.dispatch("create", {
                message,
                color: "success",
                icon: checkmarkOutline
            })
        },
        danger(ctx, message){
            ctx.dispatch("create", {
                message,
                color: "danger",
                icon: closeOutline
            })
        }
    }
}
