<template>
  <div class="hello">
    <div><p>Token Id: {{authTokens.idtoken}}</p></div>
    <div><p>Token Acc: {{authTokens.acctoken}}</p></div>
    <div><p>Token Ref: {{authTokens.reftoken}}</p></div>
    <beautiful-chat
      :participants="participants"
      titleImageUrl='https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
      :onMessageWasSent="sendMessage"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ChatWindow',
  computed: mapGetters([
    'participants',
    'currentCount',
    'messageList',
    'isOpen',
    'newMessagesCount',
    'showTypingIndicator',
    'alwaysScrollToBottom',
    'authTokens'
  ]),
  methods: mapActions([
    'increment',
    'openChat',
    'closeChat',
    'sendMessage'
  ]),
  data() {
      return {
          colors: {
            header: {
                bg: '#4e8cff',
                text: '#ffffff'
            },
                launcher: {
                bg: '#4e8cff'
            },
                messageList: {
                bg: '#ffffff'
            },
                sentMessage: {
                bg: '#4e8cff',
                text: '#ffffff'
            },
                receivedMessage: {
                bg: '#eaeaea',
                text: '#222222'
            },
                userInput: {
                bg: '#f4f7f9',
            text: '#565867'
            }
      },
        }
  }

  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
