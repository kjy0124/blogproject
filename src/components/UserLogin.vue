<template lang="ko">
  <div class="container">
    <h1>BlogProject</h1>
    <div class="login-container">
      <h2>Login</h2>
      <form method="post" action="서버의 url" id="login-form">
        <label for="userId">아이디</label>
        <input type="text" name="userId" placeholder="아이디를 입력하세요.">

        <label for="userPassword">비밀번호</label>
        <input type="password" name="userPassword" placeholder="비밀번호를 입력하세요.">
        
        <div class="button-group">
          <input type="submit" value="Login">
          <button type="button" class="signUp-button">회원가입</button>
        </div>
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
    box-sizing: border-box;
  }
  body{
    background-color: #f3f3f3;
  }

  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
  }

  .h1{
    font-size: 32px;
    color: #333;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .login-container{
    width: 360px;
    padding: 30px;
    margin-top: 30px;
    background-color: #aba6a6;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);;
  }

  .login-container > h2{
    font-size: 20px;
    color: black;
    margin-bottom: 20px;
  }

  #login-form {
    display: flex;
    flex-direction: column;
  }

  #login-form label {
    font-size: 14px;
    color: #000;
    margin-bottom: 8px;
    text-align: left;
  }

  #login-form input[type="text"],
  #login-form input[type="password"] {
    width: 100%;
    height: 40px;
    padding: 8px;
    margin-bottom: 20px;
    border-radius: 4px;
    background-color: #F8F8F8;
    border: 1px solid #ccc;
  }

  #login-form input[type="text"]::placeholder,
  #login-form input[type="password"]::placeholder {
    color: #b0b0b0;
  }

  #login-form > .button-group {
    display: flex;
    justify-content: space-between;
  }

  #login-form > input[type="submit"]{
    width: 48%;
    padding: 10px;
    color: black;
    font-size: 14px;
    background-color: #f8f8f8;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  #login-form input[type="submit"]:hover {
    background-color: #f8f8f8;
  }

  .signUp-button {
    width: 48%;
    padding: 10px;
    font-size: 14px;
    color: #333;
    background-color: #f8f8f8;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .signUp-button:hover {
    background-color: #5a6268;
  }
</style>