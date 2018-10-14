<template>
  <div class="home">
    <ChatWindow msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ChatWindow from '@/components/ChatWindow.vue'

export default {
  name: 'home',
  components: {
    ChatWindow
  }
}
</script>
