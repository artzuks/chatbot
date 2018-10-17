import Vue from 'vue'
import Vuex from 'vuex'
import Amplify, { API } from 'aws-amplify';
import {CognitoAuth} from 'amazon-cognito-auth-js';
import AWSConfig from './aws-exports'

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
    authState: false,
    cognitoIdentity: new CognitoAuth({
      ClientId : AWSConfig.aws_user_pools_web_client_id, 
			AppWebDomain : AWSConfig.aws_cognito_domain,
			TokenScopesArray : ['email','openid'],
			RedirectUriSignIn : window.location.href,
			RedirectUriSignOut : window.location.href,
			IdentityProvider : '',
      UserPoolId : AWSConfig.aws_user_pools_id, 
      AdvancedSecurityDataCollectionFlag : false
    }),
    authTokens:{
      idtoken:"",
      acctoken:"",
      reftoken:""
    }
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
    },
    authTokens (state,auth) {
      state.authTokens = auth;
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
    setAuthTokens: ({commit}, session) => {
      let authTokens = {
        idtoken:"",
        acctoken:"",
        reftoken:""
      }
      if (session) {
        var idToken = session.getIdToken().getJwtToken();
        if (idToken) {
          var payload = idToken.split('.')[1];
          var tokenobj = JSON.parse(atob(payload));
          var formatted = JSON.stringify(tokenobj, undefined, 2);
          authTokens.idtoken = formatted;
        }
        var accToken = session.getAccessToken().getJwtToken();
        if (accToken) {
          var payload = accToken.split('.')[1];
          var tokenobj = JSON.parse(atob(payload));
          var formatted = JSON.stringify(tokenobj, undefined, 2);
          authTokens.acctoken = formatted;
        }
        var refToken = session.getRefreshToken().getToken();
        if (refToken) {
          authTokens.reftoken = refToken.substring(1, 20);
        }
      }
      commit('authTokens',authTokens);
    }
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
    authTokens: state => state.authTokens
    
  }
})
