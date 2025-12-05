<template>

<button class="btn btn-link text-decoration-none text-muted ms-3" data-bs-toggle="modal" data-bs-target="#sendFile">
    <i class="fas fa-paperclip"></i>
  </button>


  <div class="modal fade" id="sendFile" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="sendFileLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="sendFileLabel">Enviar Ficheiro</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="sendFile">
            <div class="container">
              <div class="row flex-center">
                <div class="col-xxl-9 py-7 text-center">
                  <label for="fileInput" class="file-upload">
                    <input type="file" id="fileInput" ref="fileInput" style="display: none" accept=".pdf, image/*"
                      @change="handleFileChange" />
                    <div class="card-img-overlay d-flex align-items-center justify-content-center">
                      <!-- Foto de perfil -->
                      <div v-if="!previewImage" class="upload-placeholder">
                        <i class="fas fa-camera fa-3x"></i>
                        <p style="font-size: 7pt;">Selecionar (PDF ou Imagem)</p>
                      </div>
                      <div v-else>
                        <img :src="previewImage" class="card-img-top rounded-circle border border-light"
                          alt="Foto de Perfil"
                          style="width: 160px; border: 5px solid #fff; border-radius: 50%; height: 160px; border-width: 5px; border-radius: 10px;" />
                        <button type="button" class="remove-button" @click="removeImage">
                          <i class="fas fa-times"></i>
                        </button>

                        <!-- <div class="d-flex justify-content-between mt-2">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" v-model="permitionDownload"
                              id="flexSwitchCheckChecked">
                            <label class="form-check-label" for="flexSwitchCheckChecked">
                              Aceitar baixar
                            </label>
                          </div>
                        </div> -->

                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn btn-primary" v-if="previewImage" @click="sendFile">Enviar</button> -->
          <button type="button" class="btn btn-primary" v-if="previewImage" :disabled="isSending" @click="sendFile">
            <span v-if="!isSending">Enviar</span>
            <span v-else>Enviando...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const apiBase = 'https://try-to-come-clown.nohere.online/api/v1';

const route = useRoute();

const chatContainer = ref(null);

const scrollToBottom = () => {
  const container = chatContainer.value as HTMLElement | null;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};


const MAX_FILE_SIZE_MB = 7;
const isFileModalOpen = ref<boolean>(false);
const permitionDownload = ref<boolean>(false);
const fileType = ref<string>('');
const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);


const handleFileChange = () => {

  const file = fileInput.value?.files?.[0];

  if (file) {

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("Somente é aceitável arquivos igual ou inferior a 7MB.", {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (file.type.startsWith('image/')) {
      fileType.value = 'image';
      const reader = new FileReader();
      reader.onload = () => {
        previewImage.value = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      fileType.value = 'pdf';
      previewImage.value = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Icon_pdf_file.svg/334px-Icon_pdf_file.svg.png';
    }
  }
};


const isSending = ref(false);

const sendFile = async () => {
  try {

    
    isSending.value = true;

    const formData = new FormData();
    const file = fileInput.value?.files?.[0];

    const noid = Cookies.get('noid') || '';
    const noidgro: any = Cookies.get('noidgro') ? Cookies.get('noidgro') : '';

    if (file) {

      formData.append('file', file);
      formData.append('permitionDownload', 'true');
      formData.append('sender_user_id', noid);
      formData.append('group_id', noidgro);


      // const response = await fetch(`${apiBase}/message/new/file`, {
      const response = await fetch(`${apiBase}/group/message/new/file`, {
        method: 'POST',
        body: formData
      });


      if (response.ok) {

        const sendFileModal = document.getElementById('sendFile');
        if (sendFileModal) {
          sendFileModal.style.display = 'none';
          const backdropElement = document.getElementsByClassName('modal-backdrop')[0];

          if (backdropElement) {
            backdropElement.remove();
          }
        }
        isSending.value = false;


        await scrollToBottom();

        toast.success("Arquivo enviado com sucesso!", {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error("Ocorreu um erro ao enviar o arquivo.", {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  } catch (error) {
    // console.error("Erro ao enviar o arquivo:", error);
    toast.error("Houve um erro ao enviar o arquivo. Tente novamente mais tarde.", {
      position: 'top-right',
      autoClose: 3000,
    });
    isSending.value = false;
  }
};


const removeImage = () => {
  // Lógica para remover a imagem
  previewImage.value = null;
  // Certifique-se de limpar também o valor do input file se necessário
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};


onMounted(() => {
  fileInput.value = document.querySelector('#fileInput');
});

</script>

<style scoped>
.file-upload {
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 5px solid #fff;
  color: #495057;
}

.upload-placeholder i {
  margin-bottom: 8px;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #fff;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}
</style>