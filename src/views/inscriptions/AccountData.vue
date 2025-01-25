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
            <p>BANCO NACIÓN ARGENTINA.SUCURSAL AZCUENAGA N° 18</p>
            <p>AV.SANTA FE 2299.CAP.FED.BUENOS AIRES. ARGENTINA</p>
            <p>CUENTA CORRIENTE N° 141434/89 - FACULTAD DE DERECHO UBA</p>
            <p>CUIT N° 30-54666656-1</p>
            <p>CBU N° 01100037-20000141434894</p>
            <p>CÓDIGO SWIFT NACNARBA</p>
            <p>CONCEPTO POR EL CUAL SE EFECTUA TRANSFERENCIA.</p>
            <p>UNA VEZ EFECTUADA LA TRANSFERENCIA, ES OBLIGATORIO REMITIR COPIA DEL COMPROBANTE DE LA TRANSACCIÓN POR E-MAIL: contablepos@derecho.uba.ar, DE LO CONTRARIO NO QUEDARA COMPLETO EL TRAMITE.</p>
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
