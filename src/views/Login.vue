<template>
  <div class="login">
    <amplify-authenticator v-bind:authOptions="authConfig"></amplify-authenticator>
  </div>
</template>

<script>

export default {
  name: 'login',
  data: () => {
      return {authConfig: {
        signUpConfig:{
          signUpFields:[{label:"User Name",
          key:"username",
          required:true,
          displayOrder:1,
          type:"string"},
          {label:"Email",
          key:"email",
          required:true,
          displayOrder:2,
          type:"string"},
          {label:"Password",
          key:"password",
          required:true,
          displayOrder:3,
          type:"password"},
          {label:"Phone Number",
          key:"phone_number",
          required:false,
          displayOrder:4,
          type:"number"}]
      }} }
  }
}
</script>
