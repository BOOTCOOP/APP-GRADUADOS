<template>
    <graduados-app header-title="Inscripción" :header-show-back-button="true" body="white">
        <label v-if="!file" class="box" for="comprobante">
            <form action="http://localhost:3000/upload" method="post" enctype="multipart/form-data" >
                <input type="file" id="comprobante" name="comprobante" @change="uploadFile" />
                <div class="container">
                    <ion-icon color="primary" size="large" :md="cloudUploadOutline" :ios="cloudUploadOutline"></ion-icon>
                    <ion-text>Cargar comprobante</ion-text>
                </div>
            </form>
        </label>
        <div v-else class="box">
            <div class="container">
                <ion-icon color="primary" size="large" :md="documentOutline" :ios="documentOutline"></ion-icon>
                <ion-text>{{ file.name }}</ion-text>
            </div>
        </div>
        <template #footer>
            <ion-button @click="sendFile" :disabled="!file || loading" shape="round" expand="full" color="primary">
                <ion-text v-show="!loading">Finalizar</ion-text>
                <ion-text v-show="loading">
                    <ion-spinner name="circular"></ion-spinner>
                </ion-text>
            </ion-button>
        </template>
    </graduados-app>
</template>

<script setup lang="ts">
    import { IonText, IonIcon, IonButton, IonSpinner, useIonRouter } from '@ionic/vue';
    import { cloudUploadOutline, documentOutline } from 'ionicons/icons';
    import { ref } from 'vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';

    const ionRouter = useIonRouter();
    const route = useRoute();
    const store = useStore();

    const loading = ref(false);
    const file = ref();

    const uploadFile = (event) => {
        file.value = event.target.files[0];
    }

    const sendFile = (event) => {
        const { id } = route.params;
        const formData = new FormData();
        formData.append('comprobante', file.value);

        store.dispatch("inscriptions/attachProof", {id, formData}).then((response) => {
            console.log('Inscripción exitosa')
            ionRouter.navigate('/cursos/inscripcion-exitosa', 'forward', 'replace');
        }).catch(response => {
            console.log(response)
        })
    }

</script>

<style scoped>
    #comprobante {
        display: none;
    }
    .box {
        padding: 50px 80px;
        border: dashed 1px #CACBCC;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>