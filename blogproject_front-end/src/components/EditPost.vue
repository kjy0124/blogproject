<template><!-- 글 수정 페이지 -->
  <div class="navbar">
    <header>
      <h1>
        <router-link to="/" class="blog_title">BlogProject</router-link>
      </h1>
      <button v-if="!isLoggedIn" class="logout-button" @click="goToUserLogin">로그인</button>
      <button v-else class="logout-button" @click="logout">로그아웃</button>
    </header>
  </div>


  <div class="edit-post-container">
    <h1>글 수정</h1>
    <form @submit.prevent="submitPost">
      <div class="input-group">
        <label for="title">제목</label>
        <input type="text" v-model="title" id="title" required />
      </div>
      <div class="input-group">
        <label for="content">내용</label>
        <div id="editor"></div>
      </div>
      <div class="button-group">
        <button type="button" @click="cancelEdit">취소</button>
        <button type="submit" class="edit-btn">수정 완료</button>
      </div>
    </form>
  </div>
</template>

<script>
import Quill from 'quill';
import "quill/dist/quill.snow.css"

export default {
  name: 'EditPost',
  data() {
    return {
      title: '',
      content: '',
      postId: null, // 글 ID
      isLoggedIn: !!localStorage.getItem('currentUser'),
    };
  },
  created() {
    this.loadPostData();
  },
  methods: {
  
    // 해당 ID의 포스트 데이터를 불러오는 메서드
    loadPostData() {
      // URL에서 전달된 post ID를 가져옵니다.
      const postId = parseInt(this.$route.params.id); // 정수 변환
      this.postId = postId;

      // localStorage에서 글 목록 가져오기
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      console.log("현재 저장된 posts:", posts);

      // 해당 ID의 포스트를 찾습니다.
      const post = posts.find(post => post.id === postId);

      if (post) {
        // 찾은 글의 데이터를 title과 content에 바인딩
        this.title = post.title;
        this.content = post.content;
      } else {
        console.error("글을 찾을 수 없습니다.");
        this.$router.push('/list'); // 글 목록으로 이동
      }
    },
    
    // 수정된 글을 저장하는 메서드
    submitPost() {
      this.content = this.editor.root.innerHTML;

      // localStorage에서 글 목록 가져오기
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      console.log("수정 전 posts:", posts);

      // 해당 ID의 포스트를 찾고 수정
      const postIndex = posts.findIndex(post => post.id === this.postId);

      if (postIndex !== -1) {
        // 글 수정
        posts[postIndex].title = this.title;
        posts[postIndex].content = this.content;

        // 업데이트된 게시물을 localStorage에 저장
        localStorage.setItem("posts", JSON.stringify(posts));
        console.log("수정된 글 저장 완료:", posts[postIndex]); // 수정된 글 확인 로그
      } else {
        console.error("수정할 글을 찾을 수 없습니다."); // 글을 못 찾은 경우 로그
        return; // 종료
      }

      // 글 목록 페이지로 이동
      alert("글이 성공적으로 수정되었습니다.");
      this.$router.push('/list');
    },

    // 수정 취소 (글 목록으로 돌아가기)
    cancelEdit() {
      this.$router.push('/list');
    },

    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },

    goToUserLogin() {
      this.$router.push('/login');
    },
  },
  mounted() {
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

    if (this.content) {
      this.editor.root.innerHTML = this.content;
    }
  }
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

body {
  background-color: white;
}

.edit-post-container {
  width: 80%;
  margin: 50px auto;
  background-color: #aba6a6;
  padding: 20px;
  border-radius: 10px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
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
  background-color: transparent;
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


.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #ccc; 
}

button[type="button"]:hover {
  background-color: #999;
}
</style>
