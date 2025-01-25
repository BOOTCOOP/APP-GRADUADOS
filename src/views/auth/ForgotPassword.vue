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
                    Te enviaremos un enlace que te permite establecer una nueva contraseña.
                </small>
            </ion-text>
            
            <Form ref="form" class="content">
                
                <Field v-model="email" class="ion-margin-top" name="email" v-slot="{ field }" rules="required|email">
                    <IonItem>
                        <IonLabel position="floating">Nombre</IonLabel>
                        <IonInput v-bind="field"/>
                    </IonItem>
                    <ErrorMessage name="email" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
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

    const email = ref('')
    const sent = ref(false)
    const form = ref(false);
    const sending = ref(false)

    function sendRecovery(){
        form.value.validate().then( v => {
            if(v.valid){
                sending.value = true;
                useAuth().forgotPassword(email.value).then(() => {
                    sent.value = true;
                }).catch(err => {
                    form.value.setErrors(err.response.data || {email: "Hubo un error"});
                    sending.value = false;
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