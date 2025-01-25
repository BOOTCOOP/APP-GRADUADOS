<template>
    <graduados-app header-title="Mi cuenta" :header-show-back-button="true" body="white">  
        <ion-text class="ion-margin-bottom">
            <h5><strong>Cambiar Contraseña</strong></h5>
        </ion-text>
        <ion-text color="medium">
            <small>Recordá que de ahora en más vas a tener que usar la nueva contraseña para acceder.</small>
        </ion-text>
        
        <div class="ion-margin-top">
            <Form ref="form">   
                <Field name="password" v-model="data.password" label="contraseña actual" v-slot="{ field }" rules="required">
                    <FormPassword v-model="data.password" v-bind="field" label="Contraseña actual"/>
                    <ErrorMessage name="password" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>

                
                <Field label="nueva contraseña" name="new_password" v-slot="{ field }" rules="passwordIsValid">
                    <FormPasswordValidation v-bind="field" v-model:password="data.new_password" v-model:password_confirmation="data.new_password_confirmation" @password-is-valid="(v) => passwordValidation = v"></FormPasswordValidation>
                    <ErrorMessage name="new_password" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>    
            </Form>
        </div>

        <template #footer>  
            <ion-button @click="savePassword" :disabled="sending" shape="round" expand="full" color="primary">{{ sending ? 'Guardando...' : 'Guardar' }}</ion-button>
        </template>
    </graduados-app>
</template>


<script setup lang="ts">

import { IonButton, IonText, useIonRouter } from '@ionic/vue';
import { ref, reactive } from 'vue';

import FormPasswordValidation from "@/views/app/components/form/FormPasswordValidation.vue"; 
import FormPassword from "@/views/app/components/form/FormPassword.vue"; 
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { useStore } from 'vuex';
import { useProfile } from '@/uses/profile';

defineRule("passwordIsValid",() =>{
    if(passwordValidation.value) return true;

    return "Revisa las contraseñas";
})

const sending = ref(false);
const router = useIonRouter();
const form = ref(null);
const passwordValidation = ref(null);
const store = useStore();

const data = reactive({
    password:'',
    new_password:'',
    new_password_confirmation:'',
});

function savePassword(){
    form.value.validate().then( r => {
        if(r.valid){
            sending.value = true;
            useProfile().password(data).then(() => {
                if(router.canGoBack()){
                    router.back()
                }else{
                    router.push({name: 'profile'})
                }

                store.dispatch("ui/toastr/create", "Contraseña modificada.")
            })
            .catch(error => {
                form.value.setErrors(error.response.data.errors)
            })
            .finally( () => sending.value = false)
        }
    })
}
</script>