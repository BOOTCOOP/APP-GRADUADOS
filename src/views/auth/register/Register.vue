<template>
    <graduados-blank body="white" :hideFabButton="true">
        <ion-text class="ion-margin-bottom">
            <h5 style="display:flex; align-items: center;">
                <ion-icon @click="stepBack" class="ion-margin-end" v-show="step.step != 1" color="primary" :ios="arrowBackOutline" :md="arrowBackOutline"></ion-icon>
                <strong >Registro</strong>
            </h5>
        </ion-text>

        <Form ref="form">
            <div v-show="step.step == 1">
                <Field v-model="data.firstname" label="nombre" name="firstname" v-slot="{ field }" :rules="step.step == 1 ? 'required' : ''">
                    <IonItem>
                        <IonLabel position="floating">Nombre</IonLabel>
                        <IonInput v-bind="field"/>
                    </IonItem>
                    <ErrorMessage name="firstname" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>

                <Field v-model="data.lastname" label="apellido" name="lastname" v-slot="{ field }" :rules="step.step == 1 ? 'required' : ''">
                    <IonItem>
                        <IonLabel position="floating">Apellido</IonLabel>
                        <IonInput v-bind="field"/>
                    </IonItem>
                    <ErrorMessage name="lastname" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>
                <Field v-model="data.email" label="email" name="email" v-slot="{ field, meta }"  :rules="step.step == 1 ? 'required|email|notExists' : ''">
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput v-bind="field"/>
                        <span class="input-success-messsage" v-if="!meta.pending && meta.valid && meta.validated">Email disponible</span>
                    </IonItem>
                    <ErrorMessage name="email" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>                
                
                <Field label="contraseña" name="password" v-slot="{ field }" :rules="step.step == 1 ? 'passwordIsValid' : ''">
                    <FormPasswordValidation v-bind="field" v-model:password="data.password" v-model:password_confirmation="data.password_confirmation" @password-is-valid="(v) => passwordValidation = v"></FormPasswordValidation>
                    <ErrorMessage name="password" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>    
            </div>
            
            <div v-show="step.step == 2">
                <Field v-model="data.phone" label="teléfono" name="phone" v-slot="{ field }" :rules="step.step == 2 ? 'required' : ''">
                    <IonItem>
                        <IonLabel position="floating">Teléfono</IonLabel>
                        <IonInput v-bind="field"/>
                    </IonItem>
                    <ErrorMessage name="phone" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>
                <Field v-model="data.dni" label="DNI" name="dni" v-slot="{ field }" :rules="step.step == 2 ? 'required|numeric|length:8' : ''">
                    <IonItem>
                        <IonLabel position="floating">DNI</IonLabel>
                        <IonInput v-bind="field"/>
                    </IonItem>
                    <ErrorMessage name="dni" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
                </Field>
                <div class="image-upload ion-margin-top ion-padding-top">
                    <ion-label class="text-muted">Foto de cara</ion-label>
                    <!-- <ion-input ></ion-input> -->
                    <profile-picture 
                        main-color="primary" 
                        :icon="cloudUploadOutline" 
                        :thumb="data.thumb" 
                        :emptyImg="null" 
                        @image-changed="setImage"
                    />
                </div>
            </div>
            
            <div v-show="step.step == 3" class="graduate-type ion-margin-top">
                <ion-card :class="{'selected': data.type_id == 2}" @click="() => data.type_id = 2">
                    <ion-card-content>
                        <ion-text>Soy graduada/o de la Facultad de Derecho de la UBA - <strong>Tengo el título</strong></ion-text>
                        <ion-icon :md="schoolOutline" :ios="schoolOutline" size="large" color="primary"></ion-icon>
                    </ion-card-content>
                </ion-card>
                <ion-card :class="{'selected': data.type_id == 6}" @click="() => data.type_id = 6">
                    <ion-card-content>
                        <ion-text>Soy graduada/o de la Facultad de Derecho de la UBA - <strong>Mi título está en trámite</strong></ion-text>
                        <ion-icon :md="schoolOutline" :ios="schoolOutline" size="large" color="primary"></ion-icon>
                    </ion-card-content>
                </ion-card>
                <ion-card :class="{'selected': data.type_id == 4}" @click="() => data.type_id = 4">
                    <ion-card-content>
                        <ion-text>Soy graduada/o de otra Universidad</ion-text>
                        <ion-icon :md="schoolOutline" :ios="schoolOutline" size="large" color="primary"></ion-icon>
                    </ion-card-content>
                </ion-card>
                <ion-card :class="{'selected': data.type_id == 1}" @click="() => data.type_id = 1">
                    <ion-card-content>
                        <ion-text>Soy estudiante de la Facultad de Derecho de la UBA</ion-text>
                        <ion-icon :md="personOutline" :ios="personOutline" size="large" color="primary"></ion-icon>
                    </ion-card-content>
                </ion-card>
                <ion-card :class="{'selected': data.type_id == 3}" @click="() => data.type_id = 3">
                    <ion-card-content>
                        <ion-text>Soy estudiante de otra Universidad</ion-text>
                        <ion-icon :md="personOutline" :ios="personOutline" size="large" color="primary"></ion-icon>
                    </ion-card-content>
                </ion-card>
                <ion-card :class="{'selected': data.type_id == 5}" @click="() => data.type_id = 5">
                    <ion-card-content>
                        <ion-text>No pertenezco a ninguna de las categorías anteriores</ion-text>
                        <ion-icon :md="manOutline" :ios="manOutline" size="large" color="primary"></ion-icon>
                    </ion-card-content>
                </ion-card>
            </div>

            <label v-show="!file && data.type_id == 4" class="box" for="diploma">
                <form action="http://localhost:3000/upload" method="post" enctype="multipart/form-data" >
                    <input type="file" id="diploma" name="diploma" @change="uploadFile" />
                    <div class="container">
                        <ion-icon color="primary" size="large" :md="cloudUploadOutline" :ios="cloudUploadOutline"></ion-icon>
                        <ion-text>Cargar título</ion-text>
                    </div>
                </form>
            </label>
            <div v-show="file" class="box">
                <div class="container">
                    <ion-icon color="primary" size="large" :md="documentOutline" :ios="documentOutline"></ion-icon>
                    <ion-text>{{ file.name }}</ion-text>
                </div>
            </div>
        </Form>

        <template #blank-footer>
            <ion-button :disabled="sending" shape="round" color="primary" @click="nextStep" expand="full">{{sending ? 'Enviando...' : step.buttonText}}</ion-button>
        </template>
    </graduados-blank>
</template>

<script setup lang="ts">
    import { IonButton, IonCardContent, IonIcon, IonInput, IonItem, IonLabel, IonText, IonCard } from '@ionic/vue';
    import { useIonRouter } from '@ionic/vue';
    import FormPasswordValidation from "@/views/app/components/form/FormPasswordValidation.vue"; 
    import { reactive, ref } from 'vue';
    import { arrowBackOutline, personOutline, schoolOutline, cloudUploadOutline, documentOutline, manOutline } from 'ionicons/icons';
    import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
    import { useAuth } from '@/uses/auth';
    import { useStore } from 'vuex';
    import ProfilePicture from "../../profile/ProfilePicture.vue"

    defineRule("passwordIsValid",() =>{
        if(passwordValidation.value) return true;

        return "Revisa las contraseñas";
    })
    
    defineRule("notExists", (email) =>{
        return useAuth().emailAvailable(email).then(response => {
            return response.data.available ? true : "El correo ingresado ya se encuentra en uso"
        })
    })

    const ionRouter = useIonRouter();
    const form = ref(null);
    const sending = ref(false);
    const store = useStore();

    const data = reactive({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        dni: '',
        type_id: 1,
        images: [],
        thumb: ''
    });

    const steps = [
        {
            step:1,
            buttonText:"Siguiente"
        },
        {
            step:2,
            buttonText:"Siguiente"
        },
        {
            step:3,
            buttonText:"Finalizar"
        },
    ]

    const step = ref(steps[0]);

    const passwordValidation = ref(null);

    async function stepValid(){
        const valid = await form.value.validate();

        return valid.valid;
    }

    async function nextStep(){
        if(!await stepValid()) return;
        
        if(steps.length == step.value.step) return register()

        step.value = steps.filter((s) => s.step == step.value.step + 1)[0]

        setTimeout(() => form.value.setErrors({}), 0);
    }

    function stepBack(){
        if(step.value.step == 1) return;

        step.value = steps.filter((s) => s.step == step.value.step - 1)[0]
    }
    

    function register() {
        const formData = new FormData();
        formData.append('diploma', file.value);
        let i;
        for (i in data) {
            if (i == 'images') continue;
            formData.append(i, data[i])
        }
        formData.append('images[]', data.images[0]);

        form.value.validate().then(r => {
            sending.value = true
            if(r.valid){
                useAuth().register(formData).then(() => {
                    store.dispatch("ui/toastr/success", "Usuario credo correctamente");
                    goToLogin();
                }).catch((errors) => {
                    form.value.setErrors(errors);
                    sending.value = false;
                })
            }
        })
    }

    function goToLogin(){
        ionRouter.navigate('/login', 'forward', 'replace');
    }
    
    function setImage(response){
        data.thumb = response.thumb;
        data.images = [response.id];
    }

    // File
    const file = ref(false);

    const uploadFile = (event) => {
        file.value = event.target.files[0];
    }
</script>

<style scoped>
    ion-item ion-icon{align-self:end}
    .graduate-type{
        margin-top: 40px;
    }

    ion-card ion-card-content{
        border: 1px solid var(--ion-color-step-750);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    ion-card.selected  ion-card-content{
        border-color: var(--ion-color-primary)
    }

    ion-card ion-text{
        flex-grow:1;
        max-width: 60vw;
    }
</style>

<style>
    .image-upload .thumb .button{
        width: 100%;
        height:160px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 35px;
        border: 1px dashed;
        border-color: var(--ion-color-step-750);
    }

    .image-upload .thumb .button ion-icon{
        font-size: 40px;
    }

    .image-upload .thumb ion-img{
        margin:auto;
        margin-top: 20px;
        height:40vw !important;
        width:40vw !important;
        border-radius: 50%;
        overflow: hidden;
        object-fit: cover;
        object-position: center;
        height: 100%;
        width: 100%;
    }

    .image-upload .thumb.has-image .button{
        width: 35px !important;
        height: 35px !important;
        border: 2px solid var(--ion-color-step-750);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: calc(50% + 10vw);
        background: white;
        top: 76%;
    }
    
    .image-upload .thumb.has-image .button ion-icon{
        font-size: 20px;
    }

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