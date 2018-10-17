import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import Store from './store';

Vue.use(Router)

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
};

getUser().then((userr)=> {
  if (userr){
    router.push({path: '/'})
  }
})

async function getUser(){
  if (user === true){
    return true;
  }
  Store.state.cognitoIdentity.getSession();
  Store.state.cognitoIdentity.parseCognitoWebResponse( window.location.href);
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