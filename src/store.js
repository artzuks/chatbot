import Vue from 'vue'
import Vuex from 'vuex'
import {CognitoAuth} from 'amazon-cognito-auth-js';
import AWSConfig from './aws-exports'
import Amplify, { API } from "aws-amplify";

Amplify.configure(AWSConfig);

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentCount:0,
    participants: [{id:'me',name:"User"},{id:'bot', name:"Bot"}],
    isOpen:true,
    showFile:true,
    messageList:[
        { type: 'text', author: `bot`, data: { text: `Hi, How can I help you?` } }
      ],
    newMessagesCount:0,
    showTypingIndicator:'',
    alwaysScrollToBottom:false,
    authState: false,
    cognitoIdentity: new CognitoAuth({
      ClientId : AWSConfig.aws_user_pools_web_client_id, 
			AppWebDomain : AWSConfig.aws_cognito_domain,
			TokenScopesArray : ['email','openid'],
			RedirectUriSignIn : window.location.origin,
			RedirectUriSignOut : window.location.origin,
			IdentityProvider : '',
      UserPoolId : AWSConfig.aws_user_pools_id, 
      AdvancedSecurityDataCollectionFlag : false
    }),
    authTokens:{
      idtoken:"",
      acctoken:"",
      reftoken:""
    },
    cognitoSession:{}
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
    },
    cognitoSession(state,session){
      state.cognitoSession = session
    }

  },
  actions: {
    increment: ({commit}) => commit('increment'),
    openChat: ({commit}) => commit('toggleChat',true),
    closeChat: ({commit}) => commit('toggleChat',false),
    sendMessage : async ({commit},message) => {
              commit('addMessage',message)
              API.get('chatbotapi', '/chatbot').then(response => {
                  commit ('addMessage',response)
              }).catch(error => {
                  commit ('addMessage',{ type: 'text', author: `bot`, data: { text: `Error Calling the backend!` }})
              });
    },
    setAuthState: ({commit},auth) => commit('authState',auth),
    setAuthTokens: ({commit}, session) => {

      let authTokens = {
        idtoken:"",
        acctoken:"",
        reftoken:""
      }
      if (session) {
        commit('cognitoSession',session);
        var idToken = session.getIdToken().getJwtToken();
        if (idToken) {
          let payload = idToken.split('.')[1];
          let tokenobj = JSON.parse(atob(payload));
          let formatted = JSON.stringify(tokenobj, undefined, 2);
          authTokens.idtoken = formatted;
        }
        var accToken = session.getAccessToken().getJwtToken();
        if (accToken) {
          let payload = accToken.split('.')[1];
          let tokenobj = JSON.parse(atob(payload));
          let formatted = JSON.stringify(tokenobj, undefined, 2);
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
