<template>



      <button class="btn btn-link text-decoration-none text-muted" data-bs-toggle="modal" data-bs-target="#sendAudio">
                                                            <i class="fas fa-microphone"></i>
                                                        </button>



  <div class="modal fade" id="sendAudio" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="sendAudioLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="sendAudioLabel">Enviar Audio</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="sendAudioMessage">
            <div class="container">
              <div class="row flex-center">
                <div class="col-xxl-9 py-7 text-center">
                  <label for="fileInput" class="file-upload">


                    <div>
                      <button class="record-button" @click="toggleRecording">
                        {{ isRecording ? 'Parar Gravação' : 'Iniciar Gravação' }}
                      </button>
                      <button class="delete-button" @click="deleteAudio" :disabled="!audioData">
                        Excluir Áudio
                      </button>
                      <p v-if="isRecording">Tempo decorrido: {{ elapsedTime }}</p>
                      <p v-if="audioDuration">Duração do áudio: {{ audioDuration }}</p>


                      <audio ref="audioPlayer" :src="audioUrl" class="audio-player" controls v-if="audioData"
                        controlsList="nodownload"></audio>
                    </div>


                  </label>
                  <br>
                  <button type="button" class="btn btn-primary mt-5 text-center" @click="sendAudioMessage"
                    v-if="audioData">
                    <span v-if="!isSending">Enviar</span>
                    <span v-else>Enviando...</span>
                  </button>
                </div>

              </div>
            </div>
          </form>
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

const isRecording = ref(false);
const audioData = ref<Blob | null>(null);
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
const audioUrl = ref<string>('');
let startTime: Date | null = null;
let elapsedTime = ref<string>('');

const isFileModalOpen = ref<boolean>(false);
const previewAudio = ref<string | null>(null);
const isSending = ref(false);


const apiBase = 'https://try-to-come-clown.nohere.online/api/v1';

const toggleRecording = () => {
  if (!isRecording.value) {
    startTime = new Date();
    startRecording();
  } else {
    stopRecording();
  }
};

const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      isRecording.value = true;
      updateElapsedTime();
    })
    .catch(error => {
      // console.error('Erro ao iniciar a gravação:', error);
    });
};

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
  isRecording.value = false;
  startTime = null;

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    })
    .catch(error => {
      // console.error('Erro ao parar o acesso ao microfone:', error);
    });
};

const handleDataAvailable = (event: BlobEvent) => {
  audioChunks.push(event.data);
  const audioBlob = new Blob(audioChunks, { type: 'audio/m4a' });
  audioData.value = audioBlob;
  audioUrl.value = URL.createObjectURL(audioBlob);
};

const sendAudioMessage = async () => {
  if (audioChunks.length > 0) {
    const audioBlob = new Blob(audioChunks, { type: 'audio/m4a' });


    audioData.value = audioBlob;


    try {

      isSending.value = true;

      const formData = new FormData();
      const file = audioData.value;
      const noid = Cookies.get('noid') || '';
      const noidgro: any = Cookies.get('noidgro') ? Cookies.get('noidgro') : '';


      if (file) {

        formData.append('file', file);
        // formData.append('permitionDownload', permitionDownload.value.toString());
        formData.append('permitionDownload', 'false');
        formData.append('sender_user_id', noid);
        formData.append('extension_file', 'audio/m4a');
        formData.append('group_id', noidgro);


        // const response = await fetch(`${apiBase}/message/new/file`, {
        const response = await fetch(`${apiBase}/group/message/new/file`, {
          method: 'POST',
          body: formData
        });


        if (response.ok) {

          const sendAudioModal = document.getElementById('sendAudio');
          if (sendAudioModal) {
            sendAudioModal.style.display = 'none';
            const backdropElement = document.getElementsByClassName('modal-backdrop')[0];

            if (backdropElement) {
              await deleteAudio();
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

          isSending.value = false;
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






  } else {
    // console.error('Nenhum áudio gravado');
  }
};

const deleteAudio = () => {
  audioChunks = [];
  audioData.value = null;
  audioUrl.value = '';
  elapsedTime.value = '';
  startTime = null;
};


const chatContainer = ref(null);
const scrollToBottom = () => {
  const container = chatContainer.value as HTMLElement | null;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const updateElapsedTime = () => {
  setInterval(() => {
    const currentTime = new Date();
    const elapsedTimeInSeconds = startTime ? (currentTime.getTime() - startTime.getTime()) / 1000 : 0;
    elapsedTime.value = formatTime(elapsedTimeInSeconds);
  }, 1000);
};

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

let audioElement: HTMLAudioElement | null = null;
const audioDuration = ref<string>('');

onMounted(() => {
  audioElement = document.createElement('audio');
  audioElement.src = audioUrl.value;
  audioElement.onloadedmetadata = () => {
    audioElement?.play(); // Autoplay to get duration
    audioElement?.pause(); // Pause after getting duration
    audioDuration.value = formatTime(audioElement!.duration);
  };
});
</script>

<style scoped>
.record-button {
  background-color: #0a07ac;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px;
  cursor: pointer;
  border-radius: 5px;
}


.delete-button {
  background-color: #dc0101;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px;
  cursor: pointer;
  border-radius: 5px;
}

.record-button:hover,
.upload-button:hover,
.delete-button:hover {
  background-color: #0B615E;
}

.audio-player {
  width: 100%;
  margin-top: 10px;
}

.card {
  background-color: #f0f0f0;
  padding: 20px;
}

.container {
  margin-top: 20px;
}
</style>
