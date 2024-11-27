<template>
  <!--글 목록 페이지-->

  <div class="container">
    <header>
      <h1>
        <router-link to="/" class="blog_title">BlogProject</router-link>
      </h1>
      <button v-if="!isLoggedIn" class="logout-button" @click="goToUserLogin">로그인</button>
      <button v-else class="logout-button" @click="logout">로그아웃</button>
    </header>
    <div class="post-list-container">
      <h2 class="post-list-title">글 목록</h2>
      <div class="post-list">
        <div v-for="post in paginatedPosts" :key="post.id" class="post-item">
          <span class="author">글쓴이: {{ post.name }}</span>
          <h2 class="title">{{ post.title }}</h2>
          <span class="date">작성일: {{ formatDate(post.date) }}</span>
          <p class="views">조회수: {{ post.views }}</p>
        </div>
      </div>
      <!-- pagination-->
      <div class="pagination">
        <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="{ active: currentPage === page }" class="pagination-btn"></button>
      </div>
      <button type="button" @click="createPost" class="create-post-btn">
        글작성
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostList",
  data() {
    return {
      posts: [], //초기값 비움
      currentPage: 1, //현재 페이지
      postPerPage: 5, // 페이지당 글 개수
      isLoggedIn: !!localStorage.getItem('currentUser'),//로그인 여부
    };
  },

  computed: {
    sortedPosts() {
      return [...this.posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    paginatedPosts() {
      //현재 페이지에 해당하는 글 목록 계산
      const startIndex = (this.currentPage - 1) * this.postPerPage;
      const endIndex = startIndex + this.postPerPage;
      return this.sortedPosts.slice(startIndex, endIndex);
    },
    //총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.posts.length / this.postPerPage);
    },
  },

  methods: {
    createPost() {
      this.$router.push("/create");
    },

    logout() {
      localStorage.removeItem("currentUser");
      this.$router.push("/login");
    },
    syncLoginState(event) {
      if (event.key === 'currentUser') {
        this.isLoggedIn = !!localStorage.getItem('currentUser');
      }
    },

    formatDate(dateString) {
      // 날짜를 YYYY-MM-DD HH:mm 형식으로 포맷팅
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    changePage(page) {
      //페이지 변경
      this.currentPage = page;
    },
    goToUserLogin(){
      this.$router.push('/login');
    },
  },
  mounted() {
    //localStorage데이터 불러오기
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    this.posts = storedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    window.addEventListener('storage', this.syncLoginState);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncLoginState);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100wh;
}

.header {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}


.post-list-container {
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #aba6a6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  /* position: relative; */
  height: 500px;
}

.blog_title {
  font-size: 20px;
  font-weight: bold;
  /* margin: 0; */
  text-decoration: none;
  color: black;
}

.logout-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  color: black;
  font-size: 12px;
  cursor: pointer;
  padding: 5px 16px;
}

.post-list-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.author,
.date,
.views {
  font-size: 14px;
  color: #555;
}

.title {
  font-size: 18px;
  font-weight: bold;
  flex-grow: 1; /*가로 공간*/
  margin: 0 10px;
}

.views {
  margin-left: 10px;
}

.create-post-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  align-self: flex-end;
}

.create-post-btn:hover {
  background-color: #0056b3;
}

/*pagination style */
.pagination {
  display: flex;
  justify-content: center;
  margin: 10px 0;
  gap: 5px;
}

.pagination-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
}

.pagination-btn.active {
  background-color: #555;
  color: white;
  font-weight: bold;
}

.pagination-btn:hover {
  background-color: #0056b3;
  color: white;
}
</style>
