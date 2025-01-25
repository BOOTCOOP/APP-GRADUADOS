<template>
    <graduados-blank body="white" :hideFabButton="true">        
        <div v-if="!sent">
            <ion-text class="ion-margin-bottom">
                <h5 style="display:flex; align-items: center;">
                    <strong>Nueva contraseña</strong>
                </h5>
            </ion-text>
            <ion-text color="medium">
                <small>
                    Introduce una nueva contraseña para tu cuenta.
                </small>
            </ion-text>
            
            <Form ref="form">
                
                <Field label="nueva contraseña" name="password" v-slot="{ field }" rules="passwordIsValid">
                    <FormPasswordValidation v-bind="field" v-model:password="data.password" v-model:password_confirmation="data.password_confirmation" @password-is-valid="(v) => passwordValidation = v"></FormPasswordValidation>
                    <ErrorMessage name="password" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>
            </Form>
        </div>
        
        <div v-if="sent" class="password-changed ion-text-center ion-padding">
            <ion-img src="/assets/auth/password-changed.png"/>
            <ion-text><h6><strong>Contraseña reestablecida</strong></h6></ion-text>
            <ion-text color="medium"><p><small>Ya podés ingresar con tu nueva contraseña.</small></p></ion-text>
        </div>
        <template #blank-footer>
            <ion-button v-if="!sent" shape="round" expand="full" @click="changePassword">{{!sending ? 'Confirmar' : 'Enviando...'}}</ion-button>
            <ion-button v-if="sent" shape="round" expand="full" @click="goToLogin">Listo</ion-button>
        </template>
    </graduados-blank>
</template>

<script setup lang="ts">
    import { IonButton, IonImg, IonText } from '@ionic/vue';
    import FormPasswordValidation from "@/views/app/components/form/FormPasswordValidation.vue"; 
    import{ ref, reactive, onMounted } from 'vue';
    import { useIonRouter } from '@ionic/vue';
    import { useRoute } from 'vue-router';
    import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { useAuth } from '@/uses/auth';

    defineRule("passwordIsValid",() =>{
        if(passwordValidation.value) return true;

        return "Revisa las contraseñas";
    })

    const ionRouter = useIonRouter();
    const token = ref("");
    const email = ref("");
    const form = ref(false);
    const route = useRoute();
    const passwordValidation = ref(null);

    onMounted(() => {
        token.value = route.params.token;
        email.value = route.query.email;        
    })

    function goToLogin(){
        ionRouter.navigate('/login', 'forward', 'replace');
    }

    const data = reactive({
        password: '',
        password_confirmation: '',
    })

    const sent = ref(false)
    const sending = ref(false)

    function changePassword(){
        form.value.validate().then( r => {
            if(r.valid){
                sending.value = true;
                const payload = {
                    email: email.value,
                    token: token.value,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                }
                
                useAuth().changePassword(payload).then(() => {
                    sent.value = true;
                })
                .catch(error => {
                    form.value.setErrors(error.response.data.errors)
                })
                .finally( () => sending.value = false)
            }
        })
    }
</script>

<style scoped>
    ion-img{
        margin:auto;
        max-width: 260px;
    }

    .password-changed{
        margin-top: 20%;
    }
</style>