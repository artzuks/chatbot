<template>
  <div class="login">
    <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
  </div>
</template>

<script>

export default {
  name: 'login',
  data: () => {
      return {authConfig: {} }
  }
}
</script>
