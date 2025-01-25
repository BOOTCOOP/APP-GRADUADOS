<template>
  <graduados-app class="blank-page" 
    :header-title="headerTitle" 
    :header-translucent="headerTranslucent" 
    :header-show-menu="headerShowMenu" 
    :header-show-back-button="headerShowBackButton" 
    :content-full-screen="contentFullscreen"
    :body="body"
  >
    <template #header><span></span></template>
    
    <slot></slot>

    <template #footer>
      <slot name="blank-footer"></slot>
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
  import GraduadosApp from "@/views/layout/GraduadosApp.vue";
  
  defineProps({
    headerTitle: {default: ''},
    headerTranslucent: {default: true},
    headerShowMenu: {default: true},
    headerShowBackButton: {default: false},
    contentFullscreen: {default: true},
    body: {default: ''},
  })  
</script>
