<template>
  <div id="app">
    <UserLogin />
  </div>
</template>

<script>
import UserLogin from './components/UserLogin.vue';

export default {
  name: 'App',
  components: {
    UserLogin,
  }
}
</script>