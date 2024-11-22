<template><!--글작성 페이지-->
  <div class="create-post-container">
    <h1>글 작성</h1>
    <form @submit.prevent="submitPost">
      <div class="input-group">
        <label for="title">제목</label>
        <input type="text" v-model="title" id="title" required />
      </div>
      <div class="input-group">
        <label for="content">내용</label>
        <textarea v-model="content" id="content" required></textarea>
      </div>
      <button type="submit">작성 완료</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreatePost',
  data() {
    return {
      title: '',
      content: '',
    };
  },
  methods: {
    submitPost() {
      console.log("제목:", this.title);
      console.log("내용:", this.content);
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
body {
  background-color: white;
}

.create-post-container {
  width: 80%;
  margin: 0 auto;
  background-color: #aba6a6;
  padding: 20px;
  border-radius: 10px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}

.input-group input, .input-group textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

textarea {
  height: 150px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  align-self: flex-end;
}

button:hover {
  background-color: #0056b3;
}
</style>
