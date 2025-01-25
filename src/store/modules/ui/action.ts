import { actionSheetController } from '@ionic/vue';

export default {
    namespaced: true,
    actions: {
        show(ctx, buttons) {
            actionSheetController.create({
                buttons
            }).then(a => a.present());
        },
    }
}
