<template>
  <graduados-app header-title="Inscripción" :header-show-back-button="true" body="white">
        <div v-if="!loaded">
            <ion-skeleton-text :animated="true" style="width:100%; height: 20px"></ion-skeleton-text>
            <ion-skeleton-text :animated="true" style="width:20%; height: 20px" class="ion-margin-bottom"></ion-skeleton-text>

            <ion-skeleton-text v-for="i in [1,2,3,4,5,6,7]" :key="i" :animated="true" style="width:100%"></ion-skeleton-text>
            <ion-skeleton-text :animated="true" style="width: 20%"></ion-skeleton-text>
        </div>
        <div v-if="inscription && loaded">
            <h4 class="ion-no-margin">{{ inscriptionable.title }}</h4>
            <div class="ion-margin-top">
                <ion-icon :md="journalOutline" :ios="journalOutline" color="primary"></ion-icon>
                <ion-text color="medium"><strong>Costo:</strong> {{ inscriptionable.price.value }}</ion-text>
            </div>
            <div class="content ion-margin-top">
                Una vez que realices la transferencia, adjuntá una foto del comprobante para completar la preinscripción. Te enviaremos una notificación cuando tu inscripción sea aprobada.
            </div>
            <h5>Datos para la transferencia</h5>
            <p v-for="dato in DATOS_TRANSFERENCIA" :key="dato.label">
                <strong>{{ dato.label }}:</strong> {{ dato.value }}
            </p>
            <p>Indicá tu nombre y el del curso en el concepto de la transferencia.</p>
            <p>
                Una vez efectuada la transferencia es obligatorio remitir copia del comprobante
                por mail a <a :href="`mailto:${EMAIL_COMPROBANTE}`">{{ EMAIL_COMPROBANTE }}</a>,
                de lo contrario el trámite no queda completo.
            </p>
        </div>
        <template v-if="inscription && loaded" #footer>
            <ion-button @click="goToAttachProof" shape="round" expand="full" color="primary">Realicé la transferencia</ion-button>
        </template>
    </graduados-app>
</template>

<script setup lang="ts">
  import {  IonText, IonIcon, IonButton, IonSkeletonText, useIonRouter } from '@ionic/vue';
  import { journalOutline } from 'ionicons/icons';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  // Los datos de la cuenta vivían hardcodeados acá; ahora salen de un único
  // módulo que comparte con el bloque de pasos pendientes del curso.
  import { DATOS_TRANSFERENCIA, EMAIL_COMPROBANTE } from '@/utils/transferencia';

  const route = useRoute();
  const store = useStore();
  const ionRouter = useIonRouter();

  const loaded = ref(false);
  const inscription = ref({id: ''});
  const inscriptionable = ref({
    id: '',
    title: '',
    price: {
      value: ''
    }
  });

  const goToAttachProof = () => {
    const { id } = route.params;
    ionRouter.navigate(`/inscripciones/${id}/subir-comprobante`, 'forward', 'replace');
  }

  onMounted(() => {
    const { id } = route.params;
    store.dispatch("inscriptions/fetch", id).then((response) => {
      inscription.value = response.data.data;
      inscriptionable.value = response.data.data.inscriptionable;
      loaded.value = true;
    })
  })
</script>
