import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

import { AmplifyEventBus } from 'aws-amplify-vue';
import Amplify, * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import Store from './store';

Vue.use(Router)
Vue.use(AmplifyPlugin, AmplifyModules);

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\#&]' + name + '=([^&#]*)');
  var results = regex.exec(location.hash);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

let user = false;

Store.state.cognitoIdentity.userhandler = {
  onSuccess: (session)=>{
    user = true
    Store.dispatch('setAuthTokens',session);
  },
  onFailure: (err)=>{
    user = false
    alert("Error!" + err)
  }
  /** E.g.
  onSuccess: function(result) {
    alert("Sign in success");
    showSignedIn(result);
  },
  onFailure: function(err) {
    alert("Error!" + err);
  }*/
};

getUser().then((userr)=> {
  if (userr){
    router.push({path: '/'})
  }
})


//AmplifyEventBus.$on('authState', async (state) => {
//  if (state === 'signedOut'){
//    user = null;
//    Store.dispatch('setAuthState',null);
//    router.push({path: '/login'})
//  } else if (state === 'signedIn') {
//    user = await getUser();
//    router.push({path: '/'})
//  }
//});

async function getUser(){
  if (user === true){
    return true;
  }
  Store.state.cognitoIdentity.getSession();
  Store.state.cognitoIdentity.parseCognitoWebResponse( window.location.href);
  //if (Store.getters.authState === true){
  //  return true
  //}
  //Amplify.Auth.setCognitoSession({
  //    idToken,
  //    accessToken,
  //    refreshToken,
  //    user
  //}).then(user => {
  //    console.log(user); // The Cognito user object
  //});

  //Store.dispatch('setAuthState',getUrlParameter('id_token'));
  //return Store.getters.authState
}



let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth:true
      }
    },
    {
      path:'/login',
      name: 'login',
      component: Login,
      meta: {
        guest:true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    }
  ]
})



router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    user = await getUser();
    if (!user) {

      return;
    }
    return next()
  }else if (to.matched.some(record => record.meta.guest)){
    user = await getUser();
    if (!user) {
      return next()
      
    }
    return next({
      name: 'home'
    });
  }
  return next()
  
})

export default router