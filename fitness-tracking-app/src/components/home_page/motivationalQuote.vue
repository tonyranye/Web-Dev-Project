<script setup>
import { ref, onMounted } from 'vue'

const quote = ref('')
const author = ref('')
const loading = ref(true)

async function fetchQuote() {
  try {
    const res = await fetch('/api/quotes')
    const data = await res.json()
    // Pick a random quote from the returned array
    const random = data[Math.floor(Math.random() * data.length)]
    quote.value = random.q
    author.value = random.a
  } catch (e) {
    quote.value = 'Keep going.'
    author.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchQuote())
</script>

<template>
  <div class="quote-card">
    <p class="label">Daily Motivation</p>
    <p v-if="loading" class="quote loading">Loading...</p>
    <template v-else>
      <p class="quote">" {{ quote }} "</p>
      <p class="author">— {{ author }}</p>
    </template>
    <button class="refresh" @click="fetchQuote">&#8635;</button>
  </div>
</template>

<style scoped>
.quote-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}

.quote {
  font-size: 15px;
  color: #fff;
  font-style: italic;
  line-height: 1.6;
  margin: 0;
}

.quote.loading {
  color: rgba(255, 255, 255, 0.3);
  font-style: normal;
}

.author {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

.refresh {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  line-height: 1;
}

.refresh:hover {
  color: #5dcaa5;
}
</style>