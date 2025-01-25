<template>
    <graduados-app header-title="Mi cuenta" :header-show-back-button="true" body="white">  
        <template #header-end>
            <ion-button color="dark" @click="showOptions" v-show="profile.id">
                <ion-icon :ios="ellipsisHorizontalCircleOutline" :md="ellipsisHorizontalCircleOutline"></ion-icon>
                <ion-text class="ion-margin-start">Más</ion-text>
            </ion-button>
        </template>

        <div class="ion-text-center ion-margin-top ion-margin-bottom" v-if="!profile.id && loading">
            <ion-thumbnail>
              <ion-skeleton-text :animated="true"></ion-skeleton-text>
            </ion-thumbnail>
            <div class="ion-margin-top" v-for="i in [0,1,2]" :key="i">
                <ion-label>
                    <p>
                        <ion-skeleton-text :animated="true" style="height:10px;width: 20%;"></ion-skeleton-text>
                    </p>
                    <h1>
                        <ion-skeleton-text :animated="true" style="height:30px; width: 100%;"></ion-skeleton-text>
                    </h1>
                </ion-label>
            </div>
        </div>

        <Form ref="form" class="profile ion-text-center ion-margin-top ion-margin-bottom" v-if="profile.id">
            <profile-picture @image-changed="setImage" :thumb="profile.thumb">

            </profile-picture>

            <Field v-model="profile.firstname" label="nombre" name="firstname" v-slot="{ field }" rules="required">
                <IonItem>
                    <IonLabel position="floating">Nombre</IonLabel>
                    <IonInput v-bind="field"/>
                </IonItem>
                <ErrorMessage name="firstname" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
            </Field>
            
            <Field v-model="profile.lastname" label="nombre" name="lastname" v-slot="{ field }" rules="required">
                <IonItem>
                    <IonLabel position="floating">Nombre</IonLabel>
                    <IonInput v-bind="field"/>
                </IonItem>
                <ErrorMessage name="lastname" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
            </Field>
            
            <Field v-model="profile.email" label="nombre" name="email" v-slot="{ field }" rules="required|email">
                <IonItem>
                    <IonLabel position="floating">Nombre</IonLabel>
                    <IonInput v-bind="field"/>
                </IonItem>
                <ErrorMessage name="email" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
            </Field>
        </Form>
        
        <template #footer>  
            <ion-button :disabled="sending || !profile.id" @click="saveProfile" shape="round" expand="full" color="primary">{{ sending ? 'Guardando...' : 'Guardar' }}</ion-button>
        </template>
    </graduados-app>
</template>

<script setup lang="ts">

import { ellipsisHorizontalCircleOutline, lockClosedOutline } from 'ionicons/icons';
import { IonIcon, IonSkeletonText, IonThumbnail, IonButton, IonText, IonLabel, IonItem, IonInput, useIonRouter } from '@ionic/vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { Form, Field, ErrorMessage } from "vee-validate";
import { useProfile } from '@/uses/profile'
import ProfilePicture from './ProfilePicture.vue';

const sending = ref(false);
const loading = ref(true);
const router = useIonRouter();
const store = useStore();
const form = ref('');

const profile = ref({
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    thumb: '',
    images: [],
})

setTimeout(() => {
    loading.value = false;
    useProfile().get().then((p) => {
        profile.value = p
    })
}, 500);

function showOptions(){
    store.dispatch("ui/action/show", [
        {
            text: 'Cambiar contraseña',
            icon: lockClosedOutline,
            handler: ()=>{
                router.push({name:'profile.password'})
            }
        },
    ])
}

function saveProfile(){
    form.value.validate().then( r => {
        if(r.valid){
            sending.value = true;
            useProfile().update(profile.value).then(() => {
                sending.value = false;
                store.dispatch("ui/toastr/create", "Datos guardados.")
            })
        }
    })
}

function setImage(data){
    profile.value.thumb = data.thumb;
    profile.value.images = [data.id];
}

</script>

<style>
    .profile ion-thumbnail{
        margin-bottom: 40px;
        overflow:hidden;
        width:45vw;
        height: 45vw;
        margin: auto;
        border-radius: 50%;
    }
    
    .profile ion-thumbnail ion-img{
        max-width: 50%;
        margin:auto;
        border-radius: 50%;
    }

    .profile .thumb{
        position:relative;
        margin: auto;
        width: 180px;
        height: 180px;
        margin-bottom: 20px;
    }

    .profile .thumb .button{
        width: 35px;
        height: 35px;
        background-color: var(--ion-color-primary);
        border:1px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position:absolute;
        right: 3%;
        top: 76%;
    }
    .profile .thumb .button ion-icon{
        font-size: 20px
    }

    .profile .thumb ion-img{
        border-radius: 50%;
        overflow: hidden;
        object-fit: cover;
        object-position: center;
        height: 100%;
        width: 100%;
    }
</style>