<template>
  <graduados-app class="blank-page" 
    :header-title="headerTitle" 
    :header-translucent="headerTranslucent" 
    :header-show-menu="headerShowMenu" 
    :header-show-back-button="headerShowBackButton" 
    :content-full-screen="contentFullscreen"
    :body="body"
  >
    <!-- Sin back button ocultamos el header por completo (look "blank");
         con back button dejamos que GraduadosApp renderice su toolbar.
         El espaciador cubre la safe area superior: sin ion-header nadie
         absorbe la barra de estado en edge-to-edge (Android 15+ / notch iOS). -->
    <template v-if="!headerShowBackButton" #header>
      <div class="safe-area-spacer" aria-hidden="true"></div>
    </template>
    
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

<style scoped>
.safe-area-spacer {
  height: var(--ion-safe-area-top, 0px);
  flex-shrink: 0;
}
</style>
