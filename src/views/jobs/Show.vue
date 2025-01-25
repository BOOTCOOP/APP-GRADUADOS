<template>
    <graduados-app header-title="Búsqueda laboral" :header-show-back-button="true" body="white"> 
        <div v-if="loading">
            <ion-thumbnail style="width:100%; height: 15vh;" class="ion-margin-bottom">
                <ion-skeleton-text :animated="true" style="width:100%; height: 15vh;"></ion-skeleton-text>
            </ion-thumbnail>
            
            <ion-skeleton-text :animated="true" style="width:100%; height:20px"></ion-skeleton-text>
            <ion-skeleton-text :animated="true" style="width:40%; height:20px"></ion-skeleton-text>

            <div class="ion-padding-top">
                <ion-skeleton-text :animated="true" style="width:100%" v-for="i in [1,2,3,4,5,6]" :key="i"></ion-skeleton-text>
                <ion-skeleton-text :animated="true" style="width:20%"></ion-skeleton-text>
            </div>
        </div>

        <div v-if="!loading && job">
            <ion-thumbnail class="ion-margin-bottom">
                <ion-img src="/assets/jobs/job.png"></ion-img>
            </ion-thumbnail>

            <ion-text><h3>A{{ job.title }}</h3></ion-text>

            <div class="tabs">
                <div class="tab" :class="{selected: tab == 'information'}" @click="tab = 'information'">Información</div>
                <div class="tab" :class="{selected: tab == 'requirements'}" @click="tab = 'requirements'">Requisitos</div>
                <div class="tab" :class="{selected: tab == 'about'}" @click="tab = 'about'">La empresa</div>
                <!-- <div class="tab" :class="{selected: tab == 'goals'}" @click="tab = 'goals'">Objetivos</div> -->
            </div>

            <div class="ion-padding-top ion-margin-top content">
                <template v-if="tab == 'information'">
                    <ion-text>
                        <!-- <p><strong>Posición: </strong> {{ job.title }}</p> -->
                        <p><strong>Compañía: </strong> {{ job.company }}</p>
                        <p><strong>Descripción: </strong> <span v-html="job.description"></span></p>
                        <p><strong>Duración: </strong> {{ job.duration }}</p>
                    </ion-text>
                </template>
                <template v-if="tab == 'requirements'">
                    <ion-text>
                        <p><strong>Sexo: </strong> {{ job.gender }}</p>
                        <p><strong>Edad: </strong> {{ job.age_from }} a {{ job.age_to }}</p>
                        <p><strong>Lugar de residencia: </strong> {{ job.residency }}</p>
                        <p><strong>Experiencia: </strong> {{ job.experience }}</p>
                        <p v-if="job.languages.length > 0"><strong>Idiomas: </strong> {{ job.languages_string }}</p>
                        <p><strong>Nivel educativo: </strong> {{ job.education_level }}</p>
                        <p v-if="job.show_salary"><strong>Salario: </strong> {{ job.salary_string }}</p>
                    </ion-text>
                </template>
                <template v-if="tab == 'about'">
                    <ion-text>
                        <!-- <p><strong>País: </strong> {{ job.country }}</p> -->
                        <p><strong>Provincia: </strong> {{ job.province }}</p>
                        <p><strong>Ciudad: </strong> {{ job.city }}</p>
                        <p><strong>Jerarquía: </strong> {{ job.position }}</p>
                        <p><strong>Modalidad: </strong> {{ job.modality }}</p>
                        <p><strong>Cant. vacantes: </strong> {{ job.vacancies_amount }}</p>
                    </ion-text>
                </template>
            </div>
        </div>

        <template #footer v-if="!loading && !job.from_auth">
            <ion-button class="ion-margin-bottom" color="primary" shape="round" expand="full" @click="contact">Contactar</ion-button>
            <ion-button v-if="!job.has_user_favorite" color="light-primary" shape="round" @click="saveFavorite" expand="full">Guardar en favoritos</ion-button>
            <ion-button v-else color="light-primary" shape="round" expand="full" @click="removeFavorite" >Eliminar de favoritos</ion-button>
        </template>
    </graduados-app>
</template>

<script setup lang="ts">
    import { IonThumbnail, IonText, IonImg, IonSkeletonText, IonButton} from '@ionic/vue';
    import { ref, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';

    const loading = ref(true);
    const route = useRoute();
    const store = useStore();
    const job = ref({})
    const tab = ref('information');

    onMounted(() => {
        const id = route.params.slug
        store.dispatch("jobs/fetch", id).then((response) => {
            job.value = response.data.data;
        }).finally(() => loading.value = false)
    })

    function contact(){
        let contact = "";

        if(job.value.email) contact = 'mailto:' + job.value.email;
        if(job.value.phone) contact = 'tel:' + job.value.phone;

        window.open(contact, '_system');
    }

    function saveFavorite(){
        store.dispatch("jobs/addFavorite", job.value.id).then(() => {
            job.value.has_user_favorite = true;
            store.dispatch("ui/toastr/create", "Búsqueda guardada.")
        })
    }

    function removeFavorite(){
        store.dispatch("jobs/removeFavorite", job.value.id).then(() => {
            job.value.has_user_favorite = false;
            store.dispatch("ui/toastr/create", "Búsqueda eliminada de tus favoritos.")
        })
    }
</script>

<style scoped>
    ion-thumbnail{
        --size: 100%;
    }

    .tabs{
        display: flex;
        border-bottom: 1px solid var(--ion-color-step-550);
    }

    .tabs .tab{
        font-size: 12px;
        color: var(--ion-color-step-550);
        padding:10px;
        position:relative
    }

    .tabs .tab.selected{
        color: var(--ion-color-primary);
        font-weight: 600;
    }

    .tabs .tab.selected::after{
        content:"";
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: var(--ion-color-primary);
        bottom:-1px;
        left:0
    }

    .content{
        font-size: 14px;
        color: var(--ion-color-step-550)
    }
</style>
