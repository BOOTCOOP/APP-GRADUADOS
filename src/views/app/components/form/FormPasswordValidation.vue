<template>
    <div>
        <FormPassword autocomplete="new-password" name="password" :value="password" :label="label" @ionInput="passwordChanged($event)"/>
        <FormPassword autocomplete="new-password" name="password_confirmation" :value="password_confirmation" v-bind="{'modelValue': $attrs['password_confirmation']}" :label="labelConfirmation" v-if="hasPasswordConfirmation" @ionInput="passwordConfirmationChanged($event)"/>

        <div class="validations">
            <template v-for="(val, index) in validations" :key="index">
                <div class="ion-margin-bottom validation" v-if="!val.showIf || val.showIf()">
                    <ion-icon :color="val.valid ? 'success' : 'medium'" :md="val.valid ? checkmarkCircleOutline : ellipseOutline" :ios="val.valid ? checkmarkCircleOutline : ellipseOutline"></ion-icon>
                    <ion-text :color="val.valid ? '' : 'medium'">{{ val.text }}</ion-text>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { IonText, IonIcon } from '@ionic/vue';
    import { ref, watch, defineProps } from 'vue'
    import { ellipseOutline, checkmarkCircleOutline } from 'ionicons/icons';

    import FormPassword from "./FormPassword.vue";

    const emit = defineEmits(["passwordIsValid", "update:password", "update:password_confirmation"])
    const props = defineProps({
        label: { default: "Contraseña" },
        labelConfirmation: { default: "Repetir contraseña" },
        hasPasswordConfirmation: { default: true },
        password: {default:''},
        password_confirmation: {default: ''}
    })
    
    const passwordText = ref('')
    const passwordConfirmationText = ref('')

    const validations = ref([
        {
            text: 'Mínimo 8 caracteres',
            validation: () => {
                return passwordText.value.length >= 8;
            },
            valid: null,
        },
        {
            text: 'Una mayúscula',
            validation: () => {
                return !!passwordText.value.match(new RegExp("[A-Z]+"));
            },
            valid: null,
        },
        {
            text: 'Un número',
            validation: () => {
                return !!passwordText.value.match(new RegExp("[0-9]+"));
            },
            valid: null,
        },
        {
            text: 'Las contraseñas coinciden',
            validation: () => {
                return !props.hasPasswordConfirmation || (passwordText.value.length && passwordText.value == passwordConfirmationText.value)
            },
            valid: null,
            showIf: () => !!props.hasPasswordConfirmation
        },
    ])

    watch(
        () => validations,
        () => emit("passwordIsValid", passIsValid()),
        { deep: true }
    )

    function passwordChanged(e){
        passwordText.value = e.target.value;

        emit('update:password', e.target.value)

        evalValidation()
    }

    function passwordConfirmationChanged(e) {
        passwordConfirmationText.value = e.target.value;

        emit('update:password_confirmation', e.target.value)
        
        evalValidation()
    }

    function passIsValid(){
        let valid = true;
        validations.value.map(v => {
            if(!v.valid) return valid = false; 
        })

        return valid;
    }

    function evalValidation(){
        validations.value.map(v => v.valid = v.validation())
    }
</script>

<style scoped>
    .validations{
        margin-top: 30px;
    }

    .validation{
        display: flex;
        align-items: center;
    }
    .validation ion-icon{
        margin-right: 4px;
        font-size:20px;
    }
</style>