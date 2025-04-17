<template>
    <graduados-app header-title="Publicar Aviso" :header-show-back-button="true">
      <div class="ion-padding">
        <form @submit.prevent="submitForm" class="aviso-form full-height-container">
          <div class="form-header ion-margin-bottom">
            <h2>Publicar un nuevo aviso</h2>
            <p>
              Complete los siguientes datos para publicar su aviso. Recuerde que
              debe ser aprobado por un administrador antes de ser visible para
              todos los usuarios.
            </p>
          </div>
  
          <div class="form-group">
            <label for="title">Título <span class="required">*</span></label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="form-control"
              :class="{ 'is-invalid': errors.title }"
            />
            <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
          </div>
  
          <div class="form-group">
            <label for="description">Descripción <span class="required">*</span></label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="form-control"
              :class="{ 'is-invalid': errors.description }"
            ></textarea>
            <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
          </div>
  
          <div class="form-group">
            <label for="contact_phone">Teléfono de contacto <span class="required">*</span></label>
            <input
              id="contact_phone"
              v-model="form.contact_phone"
              type="tel"
              required
              class="form-control"
              :class="{ 'is-invalid': errors.contact_phone }"
            />
            <div v-if="errors.contact_phone" class="error-message">{{ errors.contact_phone }}</div>
          </div>
  
          <div class="form-group">
            <label for="contact_email">Email de contacto <span class="required">*</span></label>
            <input
              id="contact_email"
              v-model="form.contact_email"
              type="email"
              required
              class="form-control"
              :class="{ 'is-invalid': errors.contact_email }"
            />
            <div v-if="errors.contact_email" class="error-message">{{ errors.contact_email }}</div>
          </div>
  
          <div class="file-upload-section">
            <div class="file-upload-header">
              <h3>Archivo adjunto (opcional)</h3>
              <p>Suba una imagen o PDF con información adicional</p>
            </div>
            
            <div class="file-upload-container">
              <div
                class="file-upload-box"
                @click="triggerFileInput"
                :class="{ 'has-file': filePreview }"
              >
                <div v-if="!filePreview" class="upload-placeholder">
                  <ion-icon :icon="cloudUploadOutline" size="large"></ion-icon>
                  <p>Toque para seleccionar un archivo</p>
                </div>
  
                <div v-else class="file-preview">
                  <img
                    v-if="isImageFile(selectedFile)"
                    :src="filePreview"
                    alt="Vista previa"
                    class="preview-image"
                  />
                  <div v-else class="pdf-preview">
                    <ion-icon :icon="documentOutline" size="large"></ion-icon>
                    <p>{{ selectedFile?.name }}</p>
                  </div>
                </div>
              </div>
  
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*,application/pdf"
                style="display: none"
              />
  
              <button
                v-if="filePreview"
                type="button"
                class="remove-file-btn"
                @click.stop="removeFile"
              >
                <ion-icon :icon="trashOutline"></ion-icon>
              </button>
            </div>
  
            <div v-if="errors.file" class="error-message">{{ errors.file }}</div>
          </div>
  
          <div class="form-footer">
            <button
              type="button"
              class="submit-button"
              :disabled="loading"
              @click="submitForm"
            >
              <span v-if="loading">
                <span class="spinner"></span> Enviando...
              </span>
              <span v-else>Publicar Aviso</span>
            </button>
          </div>
        </form>
      </div>
    </graduados-app>
  </template>
  
  <script lang="ts" setup>
  import { alertController, toastController } from '@ionic/vue'
  import {
    cloudUploadOutline,
    documentOutline,
    trashOutline,
  } from 'ionicons/icons'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  
  const router = useRouter()
  const store = useStore()
  const fileInput = ref<HTMLInputElement | null>(null)
  
  const form = ref({
    title: '',
    description: '',
    contact_phone: '',
    contact_email: '',
  })
  
  const errors = ref({
    title: '',
    description: '',
    contact_phone: '',
    contact_email: '',
    file: '',
  })
  
  const selectedFile = ref<File | null>(null)
  const filePreview = ref<string | null>(null)
  const loading = computed(() => store.state.avisos.loading)
  
  function triggerFileInput() {
    fileInput.value?.click()
  }
  
  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) {
      return
    }
  
    const file = input.files[0]
    selectedFile.value = file
  
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.value.file = 'El archivo no debe superar los 5MB'
      selectedFile.value = null
      return
    }
  
    // Validar tipo (solo imágenes y PDF)
    if (!file.type.match('image.*') && file.type !== 'application/pdf') {
      errors.value.file = 'Solo se permiten imágenes y archivos PDF'
      selectedFile.value = null
      return
    }
  
    errors.value.file = ''
  
    // Crear vista previa
    if (file.type.match('image.*')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreview.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      // Para PDF, mostrar un icono genérico
      filePreview.value = 'pdf'
    }
  }
  
  function removeFile() {
    selectedFile.value = null
    filePreview.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
  
  function isImageFile(file: File | null) {
    if (!file) return false
    return file.type.match('image.*') !== null
  }
  
  function validateForm() {
    console.log('Valores del formulario:', form.value)
    let isValid = true
  
    // Resetear errores
    Object.keys(errors.value).forEach((key) => {
      errors.value[key as keyof typeof errors.value] = ''
    })
  
    // Validar título
    if (!form.value.title.trim()) {
      errors.value.title = 'El título es obligatorio'
      isValid = false
    } else if (form.value.title.length > 100) {
      errors.value.title = 'El título no debe exceder los 100 caracteres'
      isValid = false
    }
  
    // Validar descripción
    if (!form.value.description.trim()) {
      errors.value.description = 'La descripción es obligatoria'
      isValid = false
    }
  
    // Validar teléfono
    if (!form.value.contact_phone.trim()) {
      errors.value.contact_phone = 'El teléfono de contacto es obligatorio'
      isValid = false
    }
  
    // Validar email
    if (!form.value.contact_email.trim()) {
      errors.value.contact_email = 'El email de contacto es obligatorio'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(form.value.contact_email)) {
      errors.value.contact_email = 'Ingrese un email válido'
      isValid = false
    }
  
    console.log('Errores de validación:', errors.value)
    return isValid
  }
  
  async function submitForm() {
    console.log('Submitting form...')
  
    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }
  
    // Crear FormData para enviar el archivo
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('contact_phone', form.value.contact_phone)
    formData.append('contact_email', form.value.contact_email)
  
    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }
  
    try {
      console.log('Dispatching createAviso action...')
      const success = await store.dispatch('avisos/createAviso', formData)
      console.log('Action result:', success)
  
      if (success) {
        const toast = await toastController.create({
          message: 'Su aviso ha sido enviado y está pendiente de aprobación',
          duration: 3000,
          position: 'bottom',
          color: 'success',
        })
        await toast.present()
  
        // Use direct path navigation instead of named route
        router.push('/classifieds')
      }
    } catch (error) {
      console.error('Error al crear aviso:', error)
  
      const alert = await alertController.create({
        header: 'Error',
        message:
          'Ocurrió un error al publicar su aviso. Por favor, inténtelo de nuevo.',
        buttons: ['OK'],
      })
      await alert.present()
    }
  }
  
  onMounted(() => {
    console.log('CreateAviso component mounted')
  })
  </script>
  
  <style scoped>
  .full-height-container {
    min-height: calc(100vh - 150px); /* Ajustar según el tamaño del header */
  }
  
  input, textarea{
    background-color: #f8f9fa;
  }
  .aviso-form {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-header h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .form-header p {
    color: var(--ion-color-medium);
    margin-bottom: 16px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
  
  .required {
    color: #e74c3c;
  }
  
  .form-control {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .form-control:focus {
    outline: none;
    border-color: var(--ion-color-primary);
    box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb), 0.2);
  }
  
  .form-control.is-invalid {
    border-color: #e74c3c;
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .file-upload-section {
    margin: 30px 0;
  }
  
  .file-upload-header {
    margin-bottom: 15px;
  }
  
  .file-upload-header h3 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  
  .file-upload-header p {
    font-size: 14px;
    color: #666;
  }
  
  .file-upload-container {
    position: relative;
    margin: 16px 0;
  }
  
  .file-upload-box {
    border: 2px dashed var(--ion-color-medium);
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .file-upload-box:hover {
    border-color: var(--ion-color-primary);
    background-color: rgba(var(--ion-color-primary-rgb), 0.05);
  }
  
  .file-upload-box.has-file {
    border-style: solid;
    border-color: var(--ion-color-primary);
  }
  
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--ion-color-medium);
  }
  
  .upload-placeholder ion-icon {
    margin-bottom: 8px;
  }
  
  .file-preview {
    width: 100%;
  }
  
  .preview-image {
    max-height: 200px;
    max-width: 100%;
    border-radius: 4px;
  }
  
  .pdf-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--ion-color-primary);
  }
  
  .pdf-preview p {
    margin-top: 8px;
    font-size: 14px;
    word-break: break-all;
  }
  
  .remove-file-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #e74c3c;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  
  .remove-file-btn:hover {
    background: white;
    color: #c0392b;
  }
  
  .form-footer {
    margin-top: 30px;
  }
  
  .submit-button {
    width: 100%;
    padding: 14px;
    background-color: var(--ion-color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: var(--ion-color-primary-shade);
  }
  
  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  