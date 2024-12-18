<template>
  <!--글 목록-->
  <div class="container">
    <header>
      <h1>
        <router-link to="/" class="blog_title">BlogProject</router-link>
      </h1>
      <button v-if="!isLoggedIn" class="logout-button" @click="goToUserLogin">
        로그인
      </button>
      <button v-else class="logout-button" @click="logout">로그아웃</button>
    </header>
    <!-- 검색 기능 -->
    <div class="search-container">
      <form @submit.prevent="searchPosts">
        <label for="sc"></label>
        <select v-model="searchType" name="search" id="sc">
          <option value="title">제목</option>
          <option value="name">작성자</option>
        </select>
        <input type="text" v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
      <button type="submit" class="search-button">검색</button>
      </form>
    </div>
    <div class="post-list-container">
      <h2 class="post-list-title">글 목록</h2>

      <!-- 내가 쓴 글 필터 -->
      <div class="myPosts">
        <label>
          <input type="checkbox" v-model="filterMyPosts" @change="reloadPosts" />
          내가 쓴 글
        </label>
      </div>

      <!-- 글목록 -->
      <div class="post-list">
        <div v-for="post in paginatedPosts" :key="post.id" class="post-item">
          <span class="author">글쓴이: {{ post.name }}</span>
          <router-link :to="`/detail/${post.id}`">
            <h2 class="title">{{ post.title }}</h2>
          </router-link>
          <span class="date">작성일: {{ formatDate(post.created_at) }}</span>
          <p class="views">조회수: {{ post.views }}</p>
        </div>
      </div>

      <!-- 페이지 -->
      <div class="pagination">
        <button v-for="page in totalPages" :key="page" @click="changePage(page)"
          :class="{ active: currentPage === page }" class="pagination-btn">
          {{ page }}
        </button>
      </div>

      <!-- 글작성 버튼 -->
      <button type="button" @click="createPost" class="create-post-btn">
        글작성
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostList",
  data() {
    return {
      posts: [],
      currentPage: 1,
      postPerPage: 5,
      isLoggedIn: !!localStorage.getItem("currentUser"),
      filterMyPosts: false,
      searchKeyword: "",
      searchType: "title",
    };
  },

  computed: {
    sortedPosts() {
      return [...this.posts].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    },
    paginatedPosts() {
      const startIndex = (this.currentPage - 1) * this.postPerPage;
      const endIndex = startIndex + this.postPerPage;
      return this.sortedPosts.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.posts.length / this.postPerPage);
    },
  },

  methods: {
    async reloadPosts() {
      try {
        const currentUserData = localStorage.getItem("currentUser");
        const currentUser = currentUserData
          ? JSON.parse(currentUserData).email
          : null;

        const response = await axios.get("http://localhost:3000/list", {
          params: {
            myPostsOnly: this.filterMyPosts ? "true" : "false",
            currentUserEmail: currentUser,
          },
        });

        this.posts = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        this.currentPage = 1;

      } catch (error) {
        console.error("게시물 불러오기 중 오류 발생:", error);
      }
    },

    async searchPosts() {
      if (!this.searchKeyword.trim()) {
        alert("검색어를 입력해주세요.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/search", {
          params: { 
            type: this.searchType,//검색 타입(제목 또는 작성자)
            keyword: this.searchKeyword.trim(), },
        });
        this.posts = response.data; // 검색 결과를 posts에 저장
        this.currentPage = 1; // 검색 후 첫 페이지로 초기화
      } catch (error) {
        console.error("검색 실패:", error.response?.data?.message || error.message);
        alert("검색 중 오류가 발생했습니다.");
      }
    },

    createPost() {
      this.$router.push("/create");
    },

    logout() {
      localStorage.removeItem("currentUser");
      this.$router.push("/login");
    },

    formatDate(dateString) {
      if (!dateString) return "Invalid Date";

      const date = new Date(dateString.replace(" ", "T"));
      if (isNaN(date.getTime())) return "Invalid Date";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    changePage(page) {
      this.currentPage = page;
    },

    goToUserLogin() {
      this.$router.push("/login");
    },
  },

  mounted() {
    this.reloadPosts();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 60vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 10px;
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
  background-color: transparent;
}

.post-list-container {
  top: 5%;
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #aba6a6;
  border-radius: 10px;
  display: flex;
  height: 500px;
  flex-direction: column;
  height: 530px;
  position: absolute;
  top: 10%;
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
  background-color: transparent;
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

.blog_title {
  background-color: #f0f0f0;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 24px;
  border-radius: 5px;
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
  flex-grow: 1;
  /*가로 공간*/
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
  /* align-self: flex-end; */
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.create-post-btn:hover {
  background-color: #0056b3;
}

/*pagination style */
.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
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

.myPosts {
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-top: 0;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 40px;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  width: 230px;
}

.search-button {
  padding: 10px;
  margin-left: 10px;
  font-size: 16px;
}
@media (max-width: 600px) {
  .search-input {
    width: 200px;
    font-size: 14px;
    padding: 8px;
  }

  .search-button {
    font-size: 14px; 
    padding: 8px;
    margin-left: 5px;
  }
}
</style>
