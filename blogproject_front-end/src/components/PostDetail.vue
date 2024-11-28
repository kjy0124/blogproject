<template><!--글 상세-->
  <div class="container">
    <h1>
        <router-link to="/" class="blog_title">BlogProject</router-link>
      </h1>
    <div class="post-detail">
      <h1>{{ post.title }}</h1>
      <p><strong>글쓴이:</strong> {{ post.name }}</p>
      <p><strong>작성일:</strong> {{ post.date }}</p>
      <p><strong>조회수:</strong> {{ post.views }}</p>
      <div v-html="post.content"></div> <!-- Quill에서 저장된 HTML 내용을 보여줌 -->
      <div class="button-container">
        <button @click="editPost" class="edit-btn">수정</button>
        <button @click="deletePost" class="delete-btn">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: null, // 상세 글 데이터
    };
  },
  created() {
    this.getPostDetail();
  },
  methods: {
    getPostDetail() {
      // URL에서 전달된 post ID를 가져옵니다.
      const postId = parseInt(this.$route.params.id); // 정수 변환
      this.postId = postId;
      
      // localStorage에서 글 목록 가져오기
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      
      // 해당 ID의 포스트를 찾습니다.
      this.post = posts.find(post => post.id === parseInt(postId));
      
      if (this.post) {
        // 글을 찾으면 조회수 증가
        this.post.views += 1;
        // 업데이트된 게시물을 다시 localStorage에 저장
        localStorage.setItem("posts", JSON.stringify(posts));
      } else {
        // 글을 찾을 수 없으면 404 페이지나 다른 처리
        this.$router.push('/list'); // 예시로 글 목록으로 이동
      }
    },
    // 글 수정 페이지로 이동
    editPost() {
      this.$router.push(`/edit/${this.post.id}`);
    },
    // 글 삭제 기능
    deletePost() {
      if(confirm("정말 이 글을 삭제하시겠습니까?")){
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
      // 해당 포스트 삭제
      const updatedPosts = posts.filter(post => post.id !== this.post.id);
      // 업데이트된 게시물 목록을 다시 localStorage에 저장
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      // 글 목록 페이지로 이동
      this.$router.push('/list')
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.blog_title {
  position: absolute;
  top: 12px;
  left: 10px;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  text-decoration: none;
  color: black;
}

.post-detail {
  width: 80%;
  max-width: 900px; /* 최대 너비 설정 */
  background-color: #f9f9f9; /* 흰색 배경 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

p {
  font-size: 16px;
  margin: 10px 0;
}

div {
  font-size: 16px;
  line-height: 1.6;
}

/* 회색 컨테이너 */
.container {
  background-color: #aba6a6; /* 회색 배경 */
  padding: 20px;
  border-radius: 10px;
}

/* 버튼 스타일 */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.edit-btn, .delete-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #ff4747;
  color: white;
}

.delete-btn:hover {
  background-color: #e03e3e;
}
</style>
