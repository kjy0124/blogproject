<template>
  <div class="blog-container">
    <header class="blog-header">
      <button class="menu-button" @click="goToPostList">목록</button>
      <h1 class="blog-title">Blog Project</h1>
      <div class="header-buttons">
        <button v-if="!isLoggedIn" class="action-button" @click="goToUserLogin">로그인</button>
        <button v-else class="action-button" @click="logout">로그아웃</button>
        <button v-if="isLoggedIn" class="action-button" @click="goToCreatePage">글작성</button>
      </div>
    </header>

    <div class="main-content">
      <!-- <aside 
        class="preview-panel"
        @dragover.prevent 
        @drop="onDrop"
      >
        <h3>목록 미리보기</h3>
        <ul v-if="previewVisible">
          <li v-for="post in posts" :key="post.id">
            {{ post.title }}
          </li>
        </ul>
      </aside> -->

      <main class="post-list">
        <div v-for="post in posts" :key="post.id" class="post-item">
          <h2>{{ post.title }}</h2>
          <p>{{ post.content }}</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogMain",
  data() {
    return {
      posts: [
        { id: 1, title: "첫번째 포스트", content: "첫번째 포스트 내용" },
        { id: 2, title: "두번째 포스트", content: "두번째 포스트 내용" },
      ],
      previewVisible: false, // 미리보기 표시 여부
      isLoggedIn: !!localStorage.getItem('currentUser'),//로그인 여부
    };
  },

  mounted(){
    const sortedPost = JSON.parse(localStorage.getItem('posts')) || [];
    this.posts = sortedPost.sort((a, b) => new Date(b.date) - new Date(a.date))
    window.addEventListener('storage', this.syncLoginState);
  },
  methods: {
    onDragStart(event) {
      event.dataTransfer.setData("text", "menu-button");
    },
    onDrop(event) {
      const draggedItem = event.dataTransfer.getData("text");
      if (draggedItem === "menu-button") {
        this.previewVisible = true;
      }
    },
    logout() {
      localStorage.removeItem('currentUser');
      this.isLoggedIn = false;
      alert('로그아웃 되었습니다.');
    },
    syncLoginState(event) {
      if (event.key === 'currentUser') {
        this.isLoggedIn = !!localStorage.getItem('currentUser');
      }
    },

    goToCreatePage(){
      this.$router.push('/create');
    },
    goToUserLogin(){
      this.$router.push('/login');
    },
    goToPostList(){
      this.$router.push('/list');
    },
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncLoginState);
  },
};
</script>

<style lang="css" scoped>
.blog-container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  max-width: 1000px;
  padding: 20px;
  border: 2px solid #ddd; /* 전체 컨테이너 테두리 */
  border-radius: 10px; /* 둥근 모서리 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  background-color: #aba6a6; /* 회색 배경 */
}

.blog-header {
  display: flex;
  justify-content: space-between; /* 왼쪽, 가운데, 오른쪽 배치 */
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.menu-button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
}

.blog-title {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 24px;
}

.header-buttons {
  display: flex;
  gap: 10px; /* 버튼 간격 */
}

.action-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
}

.main-content {
  display: flex;
  margin-top: 20px;
  gap: 20px; /* 미리보기와 포스트 리스트 사이의 간격 */
}

.preview-panel {
  flex: 1;
  background-color: #eaeaea;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  max-width: 200px;
}

.preview-panel h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.preview-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.preview-panel li {
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
}

.post-list {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-item {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.post-item h2 {
  margin: 0 0 5px 0;
}

.post-item p {
  margin: 0;
}
</style>
