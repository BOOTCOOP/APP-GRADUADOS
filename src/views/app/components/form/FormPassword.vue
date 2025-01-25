<template>
    <div>
        <ion-item>
            <ion-label position="floating">{{ label }}</ion-label>
            <ion-input :autocomplete="autocomplete" v-bind="$attrs" @ionInput="($event) => emit('ionInput', $event)" :type="type"></ion-input>
            <ion-icon @click="() => type = type == 'password' ? 'text' : 'password'" color="medium" :md="type == 'password' ? eyeOutline : eyeOffOutline" :ios="type == 'password' ? eyeOutline : eyeOffOutline" slot="end"></ion-icon>
        </ion-item>
    </div>
</template>

<script setup lang="ts">
    import { IonInput, IonItem, IonLabel, IonIcon } from '@ionic/vue';
    import {
        eyeOutline,
        eyeOffOutline
    } from 'ionicons/icons';
    import { ref, defineProps } from 'vue'

    const emit = defineEmits(["ionInput"])
    const type = ref("password")
    
    defineProps({
        label: { default: "Contraseña" },
        autocomplete: { default: ''}
    })
</script>

<style scoped>
    ion-item ion-icon{align-self:end}
</style>