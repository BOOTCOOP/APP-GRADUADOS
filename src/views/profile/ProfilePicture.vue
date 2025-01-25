<template>
    <div class="thumb" :class="[thumb ? 'has-image' : 'no-image']">
        <ion-img v-if="thumb || emptyImg !== null" :src="thumb || emptyImg" @click="takePicture"></ion-img>
        <span class="button" @click="takePicture">
            <ion-icon v-if="!imageLoading" :color="mainColor" :md="icon" :ios="icon"></ion-icon>
            <ion-spinner v-if="imageLoading" :color="mainColor" name="crescent"></ion-spinner>
        </span>
    </div>
</template>


<script setup lang="ts">
    import { cameraOutline } from 'ionicons/icons';
    import { IonImg, IonIcon, IonSpinner } from '@ionic/vue';
    import { computed, defineProps } from 'vue';
    import { useStore } from 'vuex';
    import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
    
    const store = useStore();

    const imageLoading = computed(() => store.getters["images/loading"])

    const emit = defineEmits(["imageChanged"])
    defineProps({
        thumb: { required: true },
        emptyImg: { default: "/assets/profile/avatar-empty.jpg" },
        icon: { default: cameraOutline},
        mainColor: {default: "light"}
    })

    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            source: CameraSource.Camera,
            resultType: CameraResultType.Uri
        });

        store.dispatch("images/upload", {resource: "users", column:"avatar", image}).then((response) => {
            // props.thumb = image.webPath;
            console.log(response.data.image.id);
            // props.images = [response.data.image.id]

            emit("imageChanged", {id:response.data.image.id, thumb: image.webPath});
        })
    };
</script>
<style scoped>
    .thumb{
        position: relative;
    }
</style>
<!-- 
<style scoped>
    ion-thumbnail{
        margin-bottom: 40px;
        overflow:hidden;
        width:45vw;
        height: 45vw;
        margin: auto;
        border-radius: 50%;
    }
    
    ion-thumbnail ion-img{
        max-width: 50%;
        margin:auto;
        border-radius: 50%;
    }

    .thumb{
        position:relative;
        margin: auto;
        width: 180px;
        height: 180px;
        margin-bottom: 20px;
    }

    .thumb .button{
        width: 35px;
        height: 35px;
        background-color: var(--ion-color-primary);
        border:1px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position:absolute;
        right: 3%;
        top: 76%;
    }
    .thumb .button ion-icon{
        font-size: 20px
    }

    .thumb ion-img{
        border-radius: 50%;
        overflow: hidden;
        object-fit: cover;
        object-position: center;
        height: 100%;
        width: 100%;
    }
</style> -->