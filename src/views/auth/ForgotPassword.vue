<template>
    <graduados-blank body="white" :hideFabButton="true" :header-show-back-button="true">
        <div v-if="!sent" class="recovery-form">
            <div class="recovery-icon" aria-hidden="true">
                <ion-icon :icon="lockClosedOutline"></ion-icon>
            </div>

            <h1 class="recovery-title">Recuperá tu contraseña</h1>
            <p class="recovery-subtitle">
                Ingresá tu DNI y te enviamos al correo registrado un enlace para
                establecer una nueva contraseña.
            </p>

            <Form ref="form" class="content" @submit="sendRecovery">
                <Field v-model="dni" name="dni" v-slot="{ field }" rules="required|numeric">
                    <IonItem class="item-input">
                        <IonLabel position="floating">DNI</IonLabel>
                        <!-- enterkeyhint="send": el teclado de Android/iOS muestra
                             "Enviar" y permite mandar el formulario sin cerrarlo. -->
                        <IonInput
                            v-bind="field"
                            inputmode="numeric"
                            autocomplete="off"
                            enterkeyhint="send"
                        />
                    </IonItem>
                    <ErrorMessage name="dni" #default="{message}">
                        <span class="field-error">
                            <ion-icon :icon="alertCircleOutline" aria-hidden="true"></ion-icon>
                            {{ message }}
                        </span>
                    </ErrorMessage>
                </Field>

                <p class="recovery-hint">Sin puntos ni espacios.</p>
            </Form>
        </div>

        <!-- Estado de éxito con la animación compartida -->
        <SuccessState
            v-else
            variant="email"
            title="Revisá tu correo"
            message="Te enviamos un email con un enlace para crear una nueva contraseña. Puede tardar unos minutos en llegar."
        >
            <template #details>
                <div class="spam-note">
                    <ion-icon :icon="informationCircleOutline" aria-hidden="true"></ion-icon>
                    <span>Si no lo encontrás, revisá la carpeta de spam o correo no deseado.</span>
                </div>
            </template>
        </SuccessState>

        <template #blank-footer>
            <ion-button
                v-if="!sent"
                shape="round"
                expand="full"
                :disabled="sending"
                @click="sendRecovery"
            >
                <!-- Spinner en vez de solo cambiar el texto: se ve que está
                     trabajando y el botón queda deshabilitado para no mandar dos veces. -->
                <ion-spinner v-if="sending" name="crescent" class="btn-spinner"></ion-spinner>
                {{ sending ? 'Enviando…' : 'Enviar enlace' }}
            </ion-button>
            <ion-button v-else shape="round" expand="full" @click="goToLogin">
                Volver al inicio de sesión
            </ion-button>
        </template>
    </graduados-blank>
</template>

<script setup lang="ts">
    import { IonButton, IonInput, IonItem, IonLabel, IonIcon, IonSpinner } from '@ionic/vue';
    import { lockClosedOutline, alertCircleOutline, informationCircleOutline } from 'ionicons/icons';
    import{ ref } from 'vue';
    import { useIonRouter } from '@ionic/vue';
    import { useRoute } from 'vue-router';
    import { useAuth } from '@/uses/auth';
    import { Form, Field, ErrorMessage } from "vee-validate";
    import SuccessState from '@/components/SuccessState.vue';

    const ionRouter = useIonRouter();
    const route = useRoute();

    function goToLogin(){
        ionRouter.navigate({ name: 'login', query: { redirect: route.query.redirect } }, 'forward', 'replace');
    }

    const dni = ref('')
    const sent = ref(false)
    const form = ref<any>(null);
    const sending = ref(false)

    function sendRecovery(){
        if (sending.value) return;

        form.value.validate().then( v => {
            if(v.valid){
                sending.value = true;
                // forgot-password devuelve 200 siempre (no revela si el DNI existe).
                useAuth().forgotPassword(dni.value).then(() => {
                    sent.value = true;
                }).catch(() => {
                    form.value.setErrors({dni: "Hubo un error"});
                }).finally(() => {
                    sending.value = false;
                })
            }
        })
    }
</script>

<style scoped>
    .recovery-form {
        padding-top: var(--app-spacing-sm);
    }

    .recovery-icon {
        width: 56px;
        height: 56px;
        border-radius: var(--app-radius-md);
        background: var(--app-primary-soft);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--app-spacing-lg);
    }

    .recovery-icon ion-icon {
        font-size: 26px;
        color: var(--ion-color-primary);
    }

    .recovery-title {
        margin: 0 0 var(--app-spacing-sm);
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.4px;
        color: var(--app-text-title);
    }

    .recovery-subtitle {
        margin: 0 0 var(--app-spacing-xl);
        font-size: 15px;
        line-height: 1.55;
        color: var(--app-text-body);
    }

    .field-error {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-top: 2px;
        font-size: 13px;
        font-weight: 600;
        color: var(--ion-color-danger);
    }

    .recovery-hint {
        margin: var(--app-spacing-xs) 0 0 2px;
        font-size: 12px;
        color: var(--app-text-secondary);
    }

    .spam-note {
        display: flex;
        align-items: flex-start;
        gap: var(--app-spacing-sm);
        text-align: left;
        padding: var(--app-spacing-md);
        border-radius: var(--app-radius-sm);
        background: var(--app-surface-alt);
        border: 1px solid var(--app-border);
        font-size: 13px;
        line-height: 1.45;
        color: var(--app-text-body);
    }

    .spam-note ion-icon {
        font-size: 18px;
        color: var(--ion-color-primary);
        flex-shrink: 0;
        margin-top: 1px;
    }

    .btn-spinner {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }
</style>
