<template>
    <ion-menu @ionDidOpen="markAsRead" :swipeGesture="false" side="end" content-id="main-content" type="overlay" menu-id="notification-content">
        <ion-header>
          <ion-toolbar>
            <ion-title>Notificaciones</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="markAllAsRead" fill="clear">
                <ion-icon :icon="checkmarkDoneOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div v-if="notifications.length === 0" class="empty-state">
            <ion-icon :icon="notificationsOffOutline" size="large"></ion-icon>
            <h3>No hay notificaciones</h3>
            <p>Cuando tengas nuevas notificaciones, aparecerán aquí.</p>
          </div>
          
          <ion-list v-else class="notifications-container">
            <ion-item
              v-for="item in notifications"
              :key="item?.id || Math.random()"
              class="notification"
              :class="[
                !item?.read ? 'unread' : '', 
                `notification-type-${getNotificationType(item)}`
              ]"
              @click="() => handleNotificationClick(item)"
              button
            >
              <div class="notification-icon" slot="start">
                <ion-icon 
                  :icon="getNotificationIcon(item)" 
                  :color="getNotificationColor(item)"
                  size="large"
                ></ion-icon>
              </div>
              
              <ion-label class="ion-padding">
                <div class="notification-header">
                  <h3>{{ item?.subject || item?.title || 'Sin título' }}</h3>
                  <span class="notification-type-badge" :class="`badge-${getNotificationType(item)}`">
                    {{ getNotificationTypeLabel(item) }}
                  </span>
                </div>
                
                <p class="content">{{ truncateText(item?.message || item?.content || '', 100) }}</p>
                
                <div class="notification-meta">
                  <p class="date">{{ formatDate(item?.created_at || item?.date) }}</p>
                  <p v-if="item?.priority" class="priority" :class="`priority-${item.priority}`">
                    {{ getPriorityLabel(item.priority) }}
                  </p>
                </div>

                <span v-if="!item?.read" class="mark-as-read"></span>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
    </ion-menu>
</template>

<script setup lang="ts">
  import { 
    IonMenu, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonContent, 
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    useIonRouter, 
    menuController
  } from '@ionic/vue';
  import { onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import User from '@/utils/user';
  import { 
    checkmarkDoneOutline,
    notificationsOffOutline,
    newspaperOutline,
    calendarOutline,
    megaphoneOutline,
    schoolOutline,
    informationCircleOutline
  } from 'ionicons/icons';

  const notifications = ref<any[]>([]);

  function markAsRead() {
    setTimeout(() => {
      notifications.value.forEach((n: any) => n.read = true);
      const ids = notifications.value.map((n: any) => n.id);
      store.dispatch("notifications/markAsRead", {ids});
    }, 1500)
  }

  const store = useStore();
  
  onMounted(() => {
    if (User.isSet()) {
      store.dispatch("notifications/fetchAll").then((response) => {
        // Verificación más segura de la respuesta
        if (response && response.data && Array.isArray(response.data.data)) {
          notifications.value = response.data.data;
        } else if (response && Array.isArray(response.data)) {
          notifications.value = response.data;
        } else {
          notifications.value = [];
          console.warn('Respuesta de notificaciones no tiene el formato esperado:', response);
        }
      }).catch((e) => {
        console.error('Error cargando notificaciones:', e.message);
        notifications.value = []; // Asegurar que sea un array vacío en caso de error
      });
    }
  });

  const router = useIonRouter();

  // NUEVAS FUNCIONES PARA NOTIFICACIONES
  
  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (notification) => {
    if (!notification) return informationCircleOutline;
    const type = notification.type || 'general';
    switch(type) {
      case 'news': return newspaperOutline;
      case 'workshop': return calendarOutline;
      case 'classified': return megaphoneOutline;
      case 'course': return schoolOutline;
      default: return informationCircleOutline;
    }
  };

  // Obtener color según el tipo
  const getNotificationColor = (notification) => {
    if (!notification) return 'medium';
    const type = notification.type || 'general';
    switch(type) {
      case 'news': return 'primary';
      case 'workshop': return 'secondary';
      case 'classified': return 'warning';
      case 'course': return 'success';
      default: return 'medium';
    }
  };

  // Obtener tipo simplificado
  const getNotificationType = (notification) => {
    if (!notification) return 'general';
    return notification.type || 'general';
  };

  // Obtener etiqueta del tipo
  const getNotificationTypeLabel = (notification) => {
    if (!notification) return 'General';
    const type = notification.type || 'general';
    switch(type) {
      case 'news': return 'Noticia';
      case 'workshop': return 'Taller';
      case 'classified': return 'Aviso';
      case 'course': return 'Curso';
      default: return 'General';
    }
  };

  // Truncar texto
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener etiqueta de prioridad
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return '';
    }
  };

  // Mejorar navegación
  const handleNotificationClick = async (notification) => {
    if (!notification) return;
    
    // Marcar como leída
    if (!notification.read) {
      await markAsRead();
    }
    
    // Cerrar menú
    await menuController.close();
    
    // Navegar según el tipo
    const type = notification.type || 'general';
    try {
      switch(type) {
        case 'news':
          router.push('/feeds');
          break;
        case 'workshop':
          router.push('/activities');
          break;
        case 'classified':
          router.push('/classifieds');
          break;
        case 'course':
          router.push('/courses');
          break;
        default:
          if (notification.link) {
            router.push(notification.link);
          }
      }
    } catch (error) {
      console.error('Error navegando:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      if (!notifications.value || !Array.isArray(notifications.value)) {
        console.warn('No hay notificaciones para marcar como leídas');
        return;
      }

      notifications.value.forEach((n: any) => {
        if (n && typeof n === 'object') {
          n.read = true;
        }
      });
      
      const ids = notifications.value
        .filter((n: any) => n && n.id)
        .map((n: any) => n.id);
      
      if (ids.length > 0) {
        await store.dispatch('notifications/markAsRead', {ids});
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
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

  /* NUEVOS ESTILOS PARA NOTIFICACIONES MEJORADAS */
  .notification-icon {
    margin-right: 8px;
    margin-top: 2px;
    min-width: 24px;
  }

  .notification-type-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 8px;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .badge-news {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  .badge-workshop {
    background-color: #f3e5f5;
    color: #7b1fa2;
  }

  .badge-classified {
    background-color: #fff3e0;
    color: #f57c00;
  }

  .badge-course {
    background-color: #e8f5e8;
    color: #388e3c;
  }

  .badge-general {
    background-color: #f5f5f5;
    color: #666;
  }

  .notification-type-news {
    border-left-color: #1976d2 !important;
  }

  .notification-type-workshop {
    border-left-color: #7b1fa2 !important;
  }

  .notification-type-classified {
    border-left-color: #f57c00 !important;
  }

  .notification-type-course {
    border-left-color: #388e3c !important;
  }

  .priority {
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    display: inline-block;
    margin-top: 4px;
  }

  .priority-high {
    background-color: #ffebee;
    color: #c62828;
  }

  .priority-medium {
    background-color: #fff3e0;
    color: #ef6c00;
  }

  .priority-low {
    background-color: #f3e5f5;
    color: #8e24aa;
  }
</style>