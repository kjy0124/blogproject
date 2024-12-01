<template>
  <!-- 글 수정 페이지 -->
  <div class="navbar">
    <header>
      <h1>
        <router-link to="/" class="blog_title">BlogProject</router-link>
      </h1>
      <button v-if="!isLoggedIn" class="logout-button" @click="goToUserLogin">
        로그인
      </button>
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
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default {
  name: "EditPost",
  data() {
    return {
      title: "",
      content: "",
      postId: null, // 글 ID
      isLoggedIn: !!localStorage.getItem("currentUser"),
    };
  },
  created() {
    this.loadPostData();
  },
  methods: {
    // 해당 ID의 포스트 데이터를 불러오는 메서드
    async loadPostData() {
      // URL에서 전달된 post ID를 가져옵니다.
      const postId = parseInt(this.$route.params.id); // 정수 변환
      this.postId = postId;

      try {
        const response = await axios.get(
          `http://localhost:3000/detail/${postId}`
        );
        const post = response.data.post;
        this.title = post.title;
        this.content = post.content;
        if (this.editor) {
          this.editor.root.innerHTML = this.content;
        }
      } catch (error) {
        console.error("글을 찾을 수 없습니다:", error);
        this.$router.push("/list");
      }
    },

    // 수정된 글을 저장하는 메서드
    async submitPost() {
      this.content = this.editor.root.innerHTML;

      try {
        const response = await axios.put(
          `http://localhost:3000/detail/${this.postId}`,
          {
            title: this.title,
            content: this.content,
          }
        );
        console.log(response.data); // 성공 메시지 로그
        alert("수정이 완료되었습니다.");
        this.$router.push("/list");
      } catch (error) {
        console.error("글 수정 실패", error.response?.data || error.message);
        alert("수정에 실패했습니다. 다시 시도해주세요.");
      }
    },
    // 수정 취소 (글 목록으로 돌아가기)
    cancelEdit() {
      this.$router.push("/list");
    },

    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },

    goToUserLogin() {
      this.$router.push("/login");
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

.input-group input,
.input-group textarea {
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
