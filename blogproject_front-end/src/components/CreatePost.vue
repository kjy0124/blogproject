<template><!--글작성 페이지-->
  <div class="create-post-container">
    <header>
      <h1>
        <router-link to="/" class="blog_title">BlogProject</router-link>
      </h1>
      <button class="logout-button" @click="logout">로그아웃</button>
    </header>
    <h2 class="create-post-title">글작성</h2>
    <form @submit.prevent="submitPost" class="post-form">
      <div class="input-group">
        <label for="title">제목</label>
        <input type="text" v-model="title" id="title" placeholder="제목을 입력하세요." required />
      </div>
      <div class="input-group">
        <label for="content">내용</label>
        <div id="editor"></div>
      </div>
      <div class="inputfile">
        <input type="file" name="boardfile" id="inputFile">
      </div>
      <button type="submit" class="complete-button">작성 완료</button>
    </form>
  </div>
</template>

<script>
import Quill from 'quill';
import "quill/dist/quill.snow.css"

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
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (!currentUser || !currentUser.name) {
        alert.apply('로그인이 필요합니다.');
        this.$router.push('/login');
        return;
      }

      this.content = this.editor.root.innerHTML;

      //새로운 글 데이터 작성
      const newPost = {
        id: Date.now(),
        name: currentUser.name,
        title: this.title,
        content: this.content,
        date: new Date().toISOString().split('T')[0], 
        views: 0, //초기 조회수
      };

      //기존 데이터 불러오기
      const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

      existingPosts.push(newPost);
      localStorage.setItem('posts', JSON.stringify(existingPosts));

      this.$router.push('/list');
    },

    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
  mounted() {
    // Quill 초기화
    this.editor = new Quill("#editor", {
      theme: "snow", // 기본 테마 설정
      placeholder: "내용을 입력하세요.",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"], // 텍스트 꾸미기
          [{ list: "ordered" }, { list: "bullet" }], // 리스트
          ["link", "image"], // 링크와 이미지
          [{ align: [] }], // 텍스트 정렬
          [{ size: ["small", false, "large", "huge"] }], // 텍스트 크기
          [{ color: [] }, { background: [] }], // 글자색과 배경색
        ],
      },
    });
  },
};

</script>

<style scoped>
#editor {
  height: 400px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}


.create-post-container {
  width: 90%;
  margin: 50px auto;
  background-color: #aba6a6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.1);;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.blog_title {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  text-decoration: none;
  color: black;
}

/* 로그아웃 버튼 */
.logout-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  color: black;
  font-size: 12px;
  cursor: pointer;
  padding: 8px 16px;
}

/* 글작성 제목 */
.create-post-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  font-size: 16px;
  font-weight: bold;
}

.input-group input, .input-group textarea {
  /* width: 100%; */
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  /* box-sizing: border-box; */
}

.complete-button {
  width: 120px;
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
}

.complete-button:hover {
  background: #0056b3;
}
/* 
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
} */
</style>
