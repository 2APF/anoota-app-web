<template>
  <NavbarComponent />

  <div class="notes-page">
    <div class="container">

      <header class="page-header">
        <h1>Minhas Anotações</h1>
        <p>Guarde ideias, lembretes ou pedidos especiais</p>
      </header>

      <div class="add-note">
        <textarea v-model="newNote" placeholder="Escreva sua anotação aqui..." rows="4"></textarea>
        <button @click="addNote" :disabled="!newNote.trim()" class="btn-primary">
          <i class="fas fa-plus"></i> Adicionar
        </button>
      </div>

      <div class="notes-list">
        <div v-for="note in notes" :key="note.id" class="note-card">
          <div class="note-content" :class="{ editing: editingId === note.id }">
            <p v-if="editingId !== note.id">{{ note.text }}</p>
            <textarea v-else v-model="editingText" rows="4"></textarea>
          </div>

          <div class="note-actions">
            <small>{{ formatDate(note.createdAt) }}</small>
            <div class="actions">
              <button v-if="editingId === note.id" @click="saveEdit(note.id)" class="icon-btn save">
                <i class="fas fa-check"></i>
              </button>
              <button v-else @click="startEdit(note)" class="icon-btn edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteNote(note.id)" class="icon-btn delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="!notes.length" class="empty">
          <i class="fas fa-sticky-note"></i>
          <p>Nenhuma anotação ainda</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

interface Note {
  id: number
  text: string
  createdAt: Date
}

const notes = ref<Note[]>([])
const newNote = ref('')
const editingId = ref<number | null>(null)
const editingText = ref('')

const addNote = () => {
  if (!newNote.value.trim()) return
  notes.value.unshift({
    id: Date.now(),
    text: newNote.value.trim(),
    createdAt: new Date()
  })
  newNote.value = ''
}

const deleteNote = (id: number) => {
  notes.value = notes.value.filter(n => n.id !== id)
}

const startEdit = (note: Note) => {
  editingId.value = note.id
  editingText.value = note.text
}

const saveEdit = (id: number) => {
  const note = notes.value.find(n => n.id === id)
  if (note && editingText.value.trim()) {
    note.text = editingText.value.trim()
  }
  editingId.value = null
  editingText.value = ''
}

const formatDate = (date: Date) => {
  return format(date, "dd MMM 'às' HH:mm", { locale: pt })
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.notes-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 100px 0 140px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 56px;
}

.page-header h1 {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b 0%, #0ea5e9 100%);
  
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
}

.page-header p {
  font-size: 1.2rem;
  color: #64748b;
}

.add-note {
  background: white;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 12px 48px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.add-note textarea {
  width: 100%;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  background: #fdfdfd;
  font-size: 1.1rem;
  font-family: inherit;
  resize: none;
  transition: all .3s;
}

.add-note textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.12);
}

.btn-primary {
  align-self: flex-end;
  padding: 16px 36px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.btn-primary:not(:disabled):hover {
  background: #059669;
  transform: translateY(-3px);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.note-card {
  background: white;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 12px 48px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  transition: all .3s;
}

.note-card:hover {
  transform: translateY(-4px);
}

.note-content p {
  font-size: 1.2rem;
  line-height: 1.7;
  color: #1e293b;
  margin: 0 0 20px;
}

.note-content textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #0ea5e9;
  border-radius: 16px;
  background: #f0f9ff;
  font-size: 1.1rem;
  font-family: inherit;
  resize: none;
}

.note-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;
}

.note-actions small {
  color: #94a3b8;
  font-size: .95rem;
}

.actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.edit {
  background: #fef3c7;
  color: #d97706;
}

.icon-btn.edit:hover {
  background: #f59e0b;
  color: white;
}

.icon-btn.save {
  background: #10b981;
  color: white;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.icon-btn.delete:hover {
  background: #dc2626;
  color: white;
}

.empty {
  text-align: center;
  padding: 100px 20px;
  color: #94a3b8;
}

.empty i {
  font-size: 4.5rem;
  margin-bottom: 24px;
  opacity: .5;
}

.empty p {
  font-size: 1.35rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .notes-page { padding: 80px 0 100px; }
  .container { padding: 0 20px; }
  .page-header h1 { font-size: 2.4rem; }
  .add-note, .note-card { padding: 28px; border-radius: 24px; }
  .btn-primary { align-self: stretch; justify-content: center; }
  .note-actions { flex-direction: column; align-items: flex-end; gap: 12px; }
  .note-actions small { align-self: flex-start; }
}
</style>