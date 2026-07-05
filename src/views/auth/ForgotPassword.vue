<template>
    <graduados-blank body="white" :hideFabButton="true">        
        <div v-if="!sent">
            <ion-text class="ion-margin-bottom">
                <h5 style="display:flex; align-items: center;">
                    <strong  >Recupero de contraseña</strong>
                </h5>
            </ion-text>
            <ion-text color="medium">
                <small>
                    Ingresá tu DNI y te enviaremos al correo registrado un enlace para establecer una nueva contraseña.
                </small>
            </ion-text>

            <Form ref="form" class="content">

                <Field v-model="dni" class="ion-margin-top" name="dni" v-slot="{ field }" rules="required|numeric">
                    <IonItem>
                        <IonLabel position="floating">DNI</IonLabel>
                        <IonInput v-bind="field" inputmode="numeric"/>
                    </IonItem>
                    <ErrorMessage name="dni" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>
            </Form>
        </div>
        
        <div v-if="sent" class="recovery-sent ion-text-center ion-padding">
            <ion-img src="/assets/auth/email-sent.png"/>
            <ion-text><h6><strong>Email enviado</strong></h6></ion-text>
            <ion-text color="medium"><p><small>Te enviamos un correo electrónico con un enlace que te permite establecer una nueva contraseña.</small></p></ion-text>
        </div>
        <template #blank-footer>
            <ion-button v-if="!sent" shape="round" expand="full" @click="sendRecovery">{{!sending ? 'Enviar' : 'Enviando...'}}</ion-button>
            <ion-button v-if="sent" shape="round" expand="full" @click="goToLogin">Listo</ion-button>
        </template>
    </graduados-blank>
</template>

<script setup lang="ts">
    import { IonButton, IonInput, IonItem, IonLabel, IonImg, IonText } from '@ionic/vue';
    import{ ref } from 'vue';
    import { useIonRouter } from '@ionic/vue';
    import { useAuth } from '@/uses/auth';
    import { Form, Field, ErrorMessage } from "vee-validate";

    const ionRouter = useIonRouter();

    function goToLogin(){
        ionRouter.navigate('/login', 'forward', 'replace');
    }

    const dni = ref('')
    const sent = ref(false)
    const form = ref(false);
    const sending = ref(false)

    function sendRecovery(){
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
    ion-img{
        margin:auto;
        max-width: 260px;
    }

    .recovery-sent{
        margin-top: 20%;
    }
</style>