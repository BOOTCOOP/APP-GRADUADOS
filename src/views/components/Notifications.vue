<template>
    <ion-menu @ionDidOpen="markAsRead" :swipeGesture="false" side="end" content-id="main-content" type="overlay" menu-id="notification-content">
        <ion-text class="ion-padding">Notificaciones</ion-text>
        <ion-content>
          <ion-list class="notifications-container">
            <ion-item
              v-for="item in notifications"
              :key="item.id"
              class="notification"
              :class="[!item.read ? 'unread' : '']"
              @click="() => navigateTo(item.link)"
            >
              <ion-label class="ion-padding">
                <h3>{{item.subject}}</h3>
                <p class="content">{{item.message}}</p>
                <p class="date">{{item.date}}</p>

                <span v-if="!item.read" class="mark-as-read"></span>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
    </ion-menu>
</template>

<script setup lang="ts">
  import { IonMenu, IonList, IonItem, IonLabel, IonText, IonContent, useIonRouter, menuController} from '@ionic/vue';
  import { onMounted, ref, defineEmits } from 'vue';
  import { useStore } from 'vuex';
  import User from '@/utils/user';

  const notifications = ref([]);

  function markAsRead() {
    setTimeout(() => {
      notifications.value.forEach(n => n.read = true);
      const ids = notifications.value.map(n => n.id);
      store.dispatch("notifications/markAsRead", {ids});
    }, 1500)
  }

  const store = useStore();
  const emit = defineEmits(['notifications-fetched'])
  onMounted(() => {
    if (User.isSet()) {
      store.dispatch("notifications/fetchAll").then((response) => {
        notifications.value = response.data.data;
      }).catch((e)=>console.log(e.message));
    }
  });

  const router = useIonRouter();
  const navigateTo = link => {
    menuController.close('notification-content')
    router.push({name: link});
  }
</script>

<style scoped>
  ion-menu ion-text{
    background-color: white;
    color: black;
    display: flex;
    border-bottom: 1px solid #EDEDED;
    align-items: center;
  }

  ion-list.notifications-container{
    min-height: 100%;
    padding:0;
  }

  ion-list.notifications-container ion-item{
    --padding-start:0;
    --padding-end:0;
    --inner-padding-end: 0;
    --border-color: var(--ion-color-step-900);
    --ion-item-background: #fff;
    margin: 0;
  }

  ion-list.notifications-container ion-item ion-label{
    margin:0;
    position:relative;
    transition: all .5s .2s
  }

  ion-list.notifications-container ion-item ion-label p{
    text-overflow: unset;
    white-space: break-spaces;
  }

  ion-list.notifications-container ion-item ion-label p.content{
    font-weight: 500;
  }

  ion-list.notifications-container ion-item ion-label p.date{
    color: var(--ion-color-step-700);
  }

  ion-list.notifications-container ion-item ion-label h3{
    font-weight: 600;
    font-size: 16px;
  }

  ion-list.notifications-container ion-item ion-label span.mark-as-read{
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--ion-color-danger);
    width:10px;
    height:10px;
    border-radius: 50%;
    cursor: pointer;
    margin: 10px
  }

  ion-list.notifications-container .notification.unread ion-label{
    background-color: var(--ion-color-step-950);
  }
</style>