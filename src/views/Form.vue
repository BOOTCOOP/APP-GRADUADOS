<template>
  <graduados-blank>
    <Form ref="form" @submit="handleSubmit" v-slot="{ errors }">
      <Field v-model="data.firstname" label="nombre" name="firstname" v-slot="{ field }" rules="required">
        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput v-bind="field"/>
        </IonItem>
        <ErrorMessage name="firstname" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
      </Field>
      
      <Field v-model="data.lastname" label="apellido" name="lastname" v-slot="{ field }" rules="required">
        <IonItem>
          <IonLabel position="floating">Apellido</IonLabel>
          <IonInput v-bind="field"/>
        </IonItem>
        <ErrorMessage name="lastname" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
      </Field>
      
      <Field v-model="data.email" label="email" name="email" v-slot="{ field }" rules="required|email">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput v-bind="field"/>
        </IonItem>
        <ErrorMessage name="email" #default="{message}"> <ion-text color="danger"><small>{{message}}</small></ion-text></ErrorMessage>
      </Field>

      <IonButton type="button" @click="testVal">Login</IonButton>
      <!-- <IonButton type="submit">Login</IonButton> -->
      <pre>ERRORS:{{ JSON.stringify(errors, null, 2) }}</pre>
    </Form>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    
  </graduados-blank>
</template>
  
<script lang="ts" setup>
import { ref } from "vue";
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonText
} from "@ionic/vue";
import { Form, Field, ErrorMessage } from "vee-validate";

const data = ref({
    firstname:'',
    lastname:'',
    email:'',
});

const handleSubmit = (values: any) => {
  data.value = values;
};

const form = ref('');

function testVal(){
    form?.value.validate().then( r => console.log(r));
}
</script>
  