<template>
    <graduados-app body="white" :header-title="job.id ? 'Editar búsqueda' : 'Publicar búsqueda'" :toolbar-no-shadow="isShowingForm">
        <template #header-start>
            <ion-button @click="goBack" v-if="step.step != 4">
                <ion-icon :md="arrowBackOutline" :ios="arrowBackOutline"></ion-icon>
            </ion-button>
        </template>

        <div class="step-progress-bar" v-if="isShowingForm"><span :style="'width:'+(100 * step.step / (steps.length-1))+'%'"></span></div>
        <div v-if="loading" class="ion-padding ion-text-center">
            Cargando...
        </div>
        <div v-else>
            <div v-if="initialize" class="ion-text-center initialize">
                <ion-img src="/assets/jobs/create.png"></ion-img>
                <ion-text><h3>Publicar una búsqueda laboral</h3></ion-text>
                <ion-text color="medium">Encontrá los profesionales que estás buscando.</ion-text>
            </div>

            <Form ref="form"  v-if="!initialize">
                <ion-text class="ion-margin-bottom">
                    <h5><strong>{{step.title}}</strong></h5>
                </ion-text>
                <div v-if="step.step == 1">
                    
                    <Field v-model="job.title" label="posición" name="title" v-slot="{ field }" :rules="step.step == 1 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Posición</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="title" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    
                    <Field v-model="job.company" label="compañía" name="company" v-slot="{ field }" :rules="step.step == 1 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Compañía</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="company" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    
                    <Field v-model="job.description" label="descripción" name="description" v-slot="{ field }" :rules="step.step == 1 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Descripción</IonLabel>
                            <ion-textarea :auto-grow="true" v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="description" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    
                    <Field v-model="job.duration" label="duración" name="duration" v-slot="{ field }" :rules="step.step == 1 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Duración</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="duration" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    
                    <Field v-model="job.phone" label="teléfono" name="phone" v-slot="{ field }" :rules="step.step == 1 ? 'requiredWithout:email' : ''">
                        <IonItem>
                            <IonLabel position="floating">Teléfono</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="phone" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    <Field v-model="job.email" label="email" name="email" v-slot="{ field }" :rules="step.step == 1 ? 'email' : ''">
                        <IonItem>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="email" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                </div>
                <div v-if="step.step == 2">
                    <Field v-model="job.provincia_id" label="Provincia" name="provincia_id" v-slot="{ field }" :rules="step.step == 2 ? 'required' : ''">
                        <IonItem>
                            <ion-label>Provincia</ion-label>
                            <ion-select v-bind="field" interface="popover">
                                <ion-select-option v-for="item in provincias" :key="item.value" :value="item.value">{{item.label}}</ion-select-option>
                            </ion-select>
                        </IonItem>

                        <ErrorMessage name="provincia_id" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>

                    <Field v-model="job.localidad_id" label="Localidad" name="localidad_id" v-slot="{ field }" :rules="step.step == 2 ? 'required' : ''">
                        <IonItem>
                            <ion-label>Localidad</ion-label>
                            <ion-select v-bind="field" interface="popover">
                                <ion-select-option v-for="item in localidades" :key="item.value" :value="item.value">{{item.label}}</ion-select-option>
                            </ion-select>
                        </IonItem>

                        <ErrorMessage name="localidad_id" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    
                    <!-- <Field v-model="job.city" label="ciudad" name="city" v-slot="{ field }" :rules="step.step == 2 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Ciudad</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="city" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field> -->
                    
                    <Field v-model="job.position" label="jerarquía" name="position" v-slot="{ field }" :rules="step.step == 2 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Jerarquía</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="position" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    
                    <Field v-model="job.modality_id" label="modalidad" name="modality_id" v-slot="{ field }" :rules="step.step == 2 ? 'required' : ''">
                        <IonItem>
                            <ion-label>Modalidad</ion-label>
                            <ion-select v-bind="field" interface="popover">
                                <ion-select-option v-for="item in modalities" :key="item.value" :value="item.value">{{item.label}}</ion-select-option>
                            </ion-select>
                        </IonItem>
                        <ErrorMessage name="modality_id" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>

                    
                    <Field v-model="job.vacancies_amount" label="cant. vacantes" name="vacancies_amount" v-slot="{ field }" :rules="step.step == 2 ? 'required|numeric' : ''">
                        <IonItem>
                            <IonLabel position="floating">Cant. Vacantes</IonLabel>
                            <IonInput type="number" v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="vacancies_amount" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                </div>
                <div v-if="step.step == 3">
                    <Field v-model="job.gender_id" label="sexo" name="gender_id" v-slot="{ field }">
                        <IonItem>
                            <ion-label>Sexo</ion-label>
                            <ion-select v-bind="field" interface="popover" >
                                <ion-select-option v-for="item in genders" :key="item.value" :value="item.value">{{item.label}}</ion-select-option>
                            </ion-select>
                        </IonItem>
                        <ErrorMessage name="gender" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>

                    <div class="ion-padding-top">
                        <ion-label color="medium">Edad</ion-label>
                        <div style="display:flex">
                            <div>
                                <Field v-model="job.age_from" label="edad desde" name="age_from" v-slot="{ field }" :rules="step.step == 3 ? 'required|numeric' : ''">
                                    <IonItem class="ion-margin-end">
                                        <IonLabel position="floating">Desde</IonLabel>
                                        <IonInput type="number" v-bind="field"/>
                                    </IonItem>
                                 
                                    <ErrorMessage name="age_from" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                                </Field>
                            </div>
                            <div>
                                <Field v-model="job.age_to" label="edad hasta" name="age_to" v-slot="{ field }" :rules="step.step == 3 ? 'required|numeric' : ''">
                                    <IonItem class="ion-margin-start">
                                        <IonLabel position="floating">Hasta</IonLabel>
                                        <IonInput type="number" v-bind="field"/>
                                    </IonItem>
                                    <ErrorMessage name="age_to" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                                </Field>
                            </div>
                        </div>
                    </div>
                    
                    <Field v-model="job.residency" label="lugar de residencia" name="residency" v-slot="{ field }" :rules="step.step == 3 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Lugar de residencia</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="residency" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>
                    
                    <Field v-model="job.experience" label="experiencia" name="experience" v-slot="{ field }" :rules="step.step == 3 ? 'required' : ''">
                        <IonItem>
                            <IonLabel position="floating">Experiencia</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="experience" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>

                    <Field label="idiomas" name="languages" v-slot="{ field }">
                        <IonItem>
                            <ion-label>Idiomas</ion-label>
                            <ion-select v-bind="field" :value="job.languages" @ionChange="job.languages = $event.target.value" :multiple="true" interface="popover">
                                <ion-select-option v-for="item in languages" :key="item.value" :value="item.value">{{item.label}}</ion-select-option>
                            </ion-select>
                        </IonItem>
                        <ErrorMessage name="languages" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>

                    <Field v-model="job.education_level" label="nivel educativo" name="education_level" v-slot="{ field }" :rules="step.step == 3 ? 'required' : ''">
                        <IonItem>
                            <ion-label>Nivel educativo</ion-label>
                            <ion-select v-bind="field" interface="popover">
                                <ion-select-option v-for="item in educationalLevels" :key="item.value" :value="item.value">{{item.label}}</ion-select-option>
                            </ion-select>
                        </IonItem>
                        <ErrorMessage name="education_level" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>

                    <ion-item class="item-checkbox">
                        <ion-checkbox :checked="showSalary" color="primary" slot="start" @ionChange="checkboxSalaryChanged"></ion-checkbox>
                        <ion-label>Mostrar salario</ion-label>
                    </ion-item>

                    <Field v-model="job.salary" label="salario" name="salary" v-slot="{ field }" :rules="step.step == 3 && job.show_salary ? 'required|numeric' : ''">
                        <IonItem v-show="job.show_salary">
                            <IonLabel position="floating">Salario</IonLabel>
                            <IonInput v-bind="field"/>
                        </IonItem>
                        <ErrorMessage name="salary" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                    </Field>

                </div>
                <div class="ion-text-center success" v-if="step.step == 4">
                    <div class="ion-margin-bottom">
                        <ion-img src="/assets/jobs/success.png"></ion-img>
                    </div>

                    <div v-if="job.id">
                        <ion-text><h3>Tu búsqueda fue actualizada</h3></ion-text>
                    </div>
                    <div v-else>
                        <ion-text><h3>Tu búsqueda está lista</h3></ion-text>
                        <ion-text color="medium"><small>Realizaremos una revisión de tu búsqueda y te enviaremos una notificación cuando sea publicada.</small></ion-text>
                    </div>
                </div>
            </Form>
        </div>
        
        <template #footer>
            <ion-button :disabled="loading" v-if="!loading && initialize" @click="() => initialize = false" color="primary" shape="round" expand="full">Publicar una búsqueda</ion-button>
            <ion-button :disabled="sending" v-if="!initialize" shape="round" color="primary" @click="nextStep" expand="full">{{sending ? "Guardando..." : step.buttonText}}</ion-button>
        </template>
        <hr>
    </graduados-app>
</template>

<script lang="ts" setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { IonText, IonImg, IonItem, IonCheckbox, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, useIonRouter, IonSelect, IonSelectOption } from '@ionic/vue';
    import { arrowBackOutline } from 'ionicons/icons';
    import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
    import { useStore } from 'vuex';
    import { useSelect } from "@/uses/select"

    defineRule("requiredWithout", (value, params) => {
        let result = true;

        if(value === null || (!value.length && !job.value[params[0]].length)) result = "Este campo es obligatorio";

        return result;
    })

    const initialize = ref(true);
    const loading = ref(true);
    const sent = ref(false);
    const sending = ref(false);
    const showSalary = ref(true);
    const provincias = ref([])
    const localidades = ref([{value:"", label: "Selecciones una provincia"}])
    const educationalLevels = ref([{value:"Indistinto", label: "Indistinto"}])
    const languages = ref([])
    const genders = ref([{value: null, label: "Indistinto"}])
    const modalities = ref([])
    const form = ref(false);
    
    const route = useRoute();
    const router = useIonRouter();
    const store = useStore();

    const job = ref({
        id: null,
        title:'',
        company:'',
        description:'',
        duration:'',
        phone:'',
        email:'',
        provincia_id:'',
        province:'',
        city:'',
        position:'',
        modality_id:'',
        vacancies_amount:'',
        gender:'',
        age_from:'',
        age_to:'',
        residency:'',
        experience:'',
        languages:[],
        education_level:'',
        show_salary: showSalary.value,
        salary:'',
    })

    const steps = [
        {
            step: 1,
            title:"Información básica",
            buttonText:"Siguiente"
        },
        {
            step: 2,
            title:"Detalles",
            buttonText:"Siguiente"
        },
        {
            step: 3,
            title:"Requisitos del puesto",
            buttonText:"Finalizar"
        },
        {
            step: 4,
            title: "",
            buttonText:"Listo"
        },
    ]

    const step = ref(steps[0]);
    
    const isShowingForm = computed(() => initialize.value == false && step.value.step != 4 )

    onMounted(() => {
        if(route.params.slug){
            initialize.value = false;
            store.dispatch("jobs/fetch", route.params.slug).then((response) => {
                job.value = response.data.data;
                showSalary.value = job.value.show_salary;
                loading.value = false;
            })
        }else{
            loading.value = false;
        }

        useSelect().provincias().then( (response) => provincias.value = provincias.value.concat(response.data)); 
        useSelect().modalities().then( (response) => modalities.value = modalities.value.concat(response.data));
        useSelect().educationalLevels().then( (response) => educationalLevels.value = educationalLevels.value.concat(response.data));
        useSelect().genders().then( (response) => genders.value = response.data);
        useSelect().languages().then( (response) => languages.value = languages.value.concat(response.data));
    })

    function checkboxSalaryChanged(){
        job.value.show_salary = !job.value.show_salary;
    }
    
    async function stepValid(){
        const valid = await form.value.validate();

        return valid.valid;
    }

    async function nextStep(){
        if(!await stepValid()) return;

        if(step.value.step == steps.length) return router.replace({name: 'jobs.own'})

        if(step.value.step == steps.length - 1 && !sent.value) return saveJob();

        step.value = steps.filter((s) => s.step == step.value.step + 1)[0]

        setTimeout(() => form.value.setErrors({}), 0);
    }

    function saveJob(){
        sending.value = true;
        
        const action = job.value.id ? "jobs/update" : "jobs/store";

        store.dispatch(action, job.value).then(() => {
            sent.value = true;
            nextStep();
        }).catch((error) => {
            form.value.setErrors(error.response.data.errors)
            step.value = steps[0];
        }).finally(() => sending.value = false)
    }

    function goBack(){
        if(step.value.step == 1) {
            if(initialize.value) return redirectBack();

            return store.dispatch("ui/alert/confirm", {
                header: 'Volver atrás',
                subHeader: 'Se perderán los cambios realizados en el formulario',
                handler: () => {
                    redirectBack();
                }
            })
        }

        step.value = steps.filter((s) => s.step == step.value.step - 1)[0]
    }

    function redirectBack(){
        router.canGoBack() ? router.back() : router.replace({name: route.params.slug ? 'jobs.own' : 'jobs.index'});
    }

    // Update de localidades
    watch(() => job.value.provincia_id, async (newQuestion, oldQuestion) => {
        localidades.value = [{value:"", label: "Aguarde..."}];
        useSelect()
            .localidades({
                params: {provincia_id: job.value.provincia_id}
            })
            .then((response) => localidades.value = response.data)
        ; 
    })
</script>

<style scoped>
    .initialize,.success{
        margin-top: 15vh;
    }

    ion-img{
        max-width: 80%;
        margin:auto
    }

    .step-progress-bar{
        position: absolute;
        width: 100%;
        height:2px;
        top: 0;
        left:0;
        background-color: #F8C7D8;
    }
    .step-progress-bar span{
        position: absolute;
        width: 20%;
        height:2px;
        top: 0;
        left:0;
        background-color: var(--ion-color-primary);
        transition: all .3s
    }
</style>