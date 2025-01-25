<template>
    <ion-searchbar v-bind="$attrs" :debounce="debounce" :placeholder="placeholder" @ionChange="handle"></ion-searchbar>
</template>

<script setup lang="ts">
  import { IonSearchbar } from '@ionic/vue';
  import { defineProps } from 'vue';

  const emits = defineEmits(['updated'])

  defineProps({
    placeholder: {required: true, type: String},
    debounce: {required: false, default: 600}
  })

  function handle(event) {
    emits("updated", event.target.value)
  }
  
</script>