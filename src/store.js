import Vue from 'vue'
import Vuex from 'vuex'
import Amplify, { API } from 'aws-amplify';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentCount:0,
    participants: [{id:'me',name:"User"},{id:'bot', name:"Bot"}],
    isOpen:true,
    showFile:true,
    messageList:[
        { type: 'text', author: `me`, data: { text: `Say yes!` } },
        { type: 'text', author: `bot`, data: { text: `No.` } }
      ],
    newMessagesCount:0,
    showTypingIndicator:'',
    alwaysScrollToBottom:false,
    authState: {}
  },
  mutations: {
    increment (state) {
      state.currentCount++;
    },
    toggleChat (state,val) {
      if (val === undefined){
        state.isOpen = !state.isOpen
      }else{
        state.isOpen = !!val
      }

      if (state.isOpen){
        state.newMessagesCount = 0;
      }
    },
    addMessage (state,message){
      state.messageList.push(message);
    },
    authState (state,auth) {
      state.authState = auth;
    }


  },
  actions: {
    increment: ({commit}) => commit('increment'),
    openChat: ({commit}) => commit('toggleChat',true),
    closeChat: ({commit}) => commit('toggleChat',false),
    sendMessage : async ({commit},message) => {
              commit('addMessage',message)
              let response = await API.get('apib79cd98b','/chatbot/')
              commit ('addMessage',response)
            },
    setAuthState: ({commit},auth) => commit('authState',auth),
  },
  getters : {
    currentCount: state => state.currentCount,
    participants: state => state.participants,
    messageList: state => state.messageList,
    isOpen: state => state.isOpen,
    newMessagesCount: state => state.newMessagesCount,
    showTypingIndicator: state => state.showTypingIndicator,
    alwaysScrollToBottom: state => state.alwaysScrollToBottom,
    authState: state => state.authState,
  }
})
