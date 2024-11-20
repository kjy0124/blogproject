<template lang="ko">
  <div class="container">
    <h1>BlogProject</h1>
    <div class="login-container">
      <h2>Login</h2>
      <form method="post" action="서버의 url" id="login-form">
        <input type="text" name="userId" placeholder="아이디를 입력하세요.">
        <input type="password" name="userPassword" placeholder="비밀번호를 입력하세요.">

      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserLogin',
}
</script>
<style>
  * {
    padding: 0;
    margin: 0;
    border: none;
  }
  body{
    font-size: 14px;
  }
</style>