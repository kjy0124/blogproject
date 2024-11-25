<template><!--글 목록 페이지-->
  <div class="post-list-container">
    <h1>글 목록</h1>
    <div class="post-list">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <span class="author">글쓴이: {{ post.name }}</span>
        <h2 class="title">{{ post.title }}</h2>
        <span class="date">작성일: {{ post.date }}</span>
        <p class="views">조회수: {{ post.views }}</p>
      </div>
    </div>
    <button type="button" @click="createPost" class="create-post-btn">글작성</button>
  </div>
</template>

<script>
export default {
  name: 'PostList',
  data() {
    return {
      posts: [],//초기값 비움
    };
  },
  methods: {
    createPost() {
      this.$router.push('/create');
    },
  },
  mounted() {
    //localStorage데이터 불러오기
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    this.posts = storedPosts;
  }
};
</script>

<style scoped>
.post-list-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #aba6a6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative; 
  min-height: 300px;
}

h1 {
  text-align: center;
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

.author, .date, .views {
  font-size: 14px;
  color: #555;
}

.title {
  font-size: 18px;
  font-weight: bold;
  flex-grow: 1; /*가로 공간*/
  margin: 0 10px;
}

.create-post-btn {
  position: absolute;
  bottom: 20px;
  right: 20px; 
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.create-post-btn:hover {
  background-color: #0056b3;
}
</style>
