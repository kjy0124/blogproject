<template>
  <!--글 상세-->
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
  <div class="container">
    <div class="post-detail">
      <div v-if="post.title">
        <h1>{{ post.title }}</h1>
        <p><strong>글쓴이:</strong> {{ post.name }}</p>
        <p>
          <strong>작성일:</strong>
          {{
            post.created_at ? formatDate(post.created_at) : "작성일 정보 없음"
          }}
        </p>
        <p><strong>조회수:</strong> {{ post.views }}</p>
        <div v-html="post.content"></div>
        <!-- Quill에서 저장된 HTML 내용을 보여줌 -->
      </div>
      <div class="button-container">
        <button v-if="post.email === currentUserId" @click="editPost" class="edit-btn">수정</button>
        <button v-if="post.email === currentUserId" @click="deletePost" class="delete-btn">삭제</button>
      </div>

      <div class="comments-section">
        <h3>댓글 {{ post.commentCount }}</h3>
        <form @submit.prevent="addComment">
          <textarea v-model="newComment" placeholder="댓글을 작성하시오" required></textarea>
          <button type="submit">댓글 작성</button>
        </form>

        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <p>{{ comment.content }}</p>

            <div class="comment-footer">
              <small>작성자 : {{ comment.username }} |
                {{ comment.createdAt }}</small>

              <button @click="toggleLike(comment.id)" class="like-button">
                <span>{{ comment.isLiked ? '❤️' : '🤍' }}</span> {{ comment.likesCount }}
              </button>

              <!-- 삭제 버튼 -->
              <!-- <button v-if="comment.userId === currentUserId" @click="deleteComment(comment.id)" class="delete-btn">
                삭제
              </button> -->
              <img v-if="comment.userId === currentUserId" src="@/assets/delete-comment.jpg" alt="삭제"
                class="delete-icon" @click="deleteComment(comment.id)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

export default {
  props:{
    postId: {type: [String, Number], required: true},
    id: { type: [String, Number], required: true }
  },

  data() {
    return {
      comments: [],
      newComment: "",
      currentUserId:
        JSON.parse(localStorage.getItem("currentUser"))?.email || null,
      post: {}, // 상세 글 데이터
      isLoggedIn: !!localStorage.getItem("currentUser"),
    };
  },

  created() {
    this.getPostDetail();
    this.fetchComments();
    console.log("현재 사용자 ID:", this.currentUserId); // 디버깅 코드
  },

  methods: {
    async toggleLike(commentId) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (!comment) return;

    try {
      const response = await axios.post(`/api/comments/${commentId}/likes`, {
        userId: this.currentUserId,
      });

      if (response.data.message.includes("추가")) {
        comment.isLiked = true;
        comment.likesCount += 1;
      } else if (response.data.message.includes("취소")) {
        comment.isLiked = false;
        comment.likesCount -= 1;
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error.response?.data || error.message);
    }
  },

    async addLike(commentId) {
      try {
    const response = await axios.post(`/api/comments/${commentId}/likes`, {
      userId: this.currentUserId, // 이메일 전달
    });
        // 이미 좋아요를 눌렀다면 메시지를 표시하지 않고 종료
        if (response.data.message === "이미 좋아요를 눌렀습니다.") {
          console.log("이미 좋아요를 눌렀습니다.");
          return;
        }
      } catch (error) {
        console.error("좋아요 추가 실패:", error.response?.data || error.message);
        alert(error.response?.data?.message || "좋아요 추가에 실패했습니다.");
      }
    },

    async removeLike(commentId) {
      try {
        await axios.delete(`/api/comments/${commentId}/likes`, { data: { userId: this.currentUserId } });
      } catch (error) {
        console.error("좋아요 취소 실패:", error.response?.data || error.message);
        alert(error.response?.data?.message || "좋아요 취소에 실패했습니다.");
      }
    },
    async getPostDetail() {
      const postId = parseInt(this.$route.params.id);
      if (isNaN(postId)) {
        console.error("잘못된 게시물 ID:", this.$route.params.id);
        this.$router.push("/list");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/detail/${postId}`
        );
        this.post = response.data.post;

        await this.incrementViewCount(postId);
      } catch (error) {
        console.error(
          "게시물 불러오기 중 오류 발생:",
          error.response ? error.response.data : error.message
        );
        this.$router.push("/list");
      }
    },
    async fetchComments() {
  try {
    const response = await axios.get(
      `http://localhost:3000/comments/${this.$route.params.id}`
    );

    // 댓글 목록 초기화 후 서버 데이터 추가
    this.comments = response.data.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      username: comment.userId,
      createdAt: this.formatDate(comment.createdAt),
      content: comment.content,
      isLiked: false, // 기본값 설정
      likesCount: 0, // 기본값 설정
    }));

    // 좋아요 상태와 카운트 추가
    for (const comment of this.comments) {
      try {
        const likeResponse = await axios.get(`/api/comments/${comment.id}/likes`, {
          params: { userId: this.currentUserId },
        });
        comment.isLiked = likeResponse.data.isLiked;
        comment.likesCount = likeResponse.data.likesCount;
      } catch (error) {
        console.error(`좋아요 데이터 가져오기 실패 (댓글 ID: ${comment.id}):`, error.message);
      }
    }
  } catch (error) {
    console.error("댓글 불러오기 실패:", error.response?.data || error.message);
  }
},

async addComment() {
  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!storedUser || !storedUser.email) {
      throw new Error("사용자 정보가 없습니다.");
    }

    // 서버에 댓글 작성 요청
    const response = await axios.post(
      `http://localhost:3000/comments/${this.$route.params.id}`,
      {
        postId: this.$route.params.id,
        content: this.newComment,
        userEmail: storedUser.email,
      }
    );

    // 서버에서 반환된 댓글 데이터 추가
    this.comments.push({
      id: response.data.id,
      userId: response.data.username,
      username: response.data.username,
      createdAt: this.formatDate(response.data.createdAt),
      content: response.data.content,
      isLiked: false,
      likesCount: 0,
    });

    // 입력 필드 초기화
    this.newComment = "";
  } catch (error) {
    console.error("댓글 작성 실패:", error.response?.data || error.message);
    alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
  }
},

    //댓글 삭제
    async deleteComment(commentId) {
      alert('정말 이 댓글을 삭제하시겠습니까?');
      try {
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!storedUser || !storedUser.email) {
          throw new Error("사용자 정보가 없습니다.");
        }
        const currentUserEmail = storedUser.email;

        await axios.delete(`http://localhost:3000/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "current-user": currentUserEmail,
          },
        });

        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      } catch (error) {
        console.log("댓글 삭제 실패:", error.response?.data || error.message);
      }
    },

    async incrementViewCount(postId) {
      try {
        await axios.put(`http://localhost:3000/detail/${postId}/views`);
      } catch (error) {
        console.error(
          "조회수 증가 에러 발생:",
          error.response ? error.response.data : error.message
        );
      }
    },

    // 글 수정 페이지로 이동
    editPost() {
      const currentUser = localStorage.getItem("currentUser"); //현재 로그인한 사용자 가져오기

      if (!currentUser) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }
      this.$router.push(`/edit/${this.post.id}`);
    },

    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },

    goToUserLogin() {
      this.$router.push("/login");
    },

    // 글 삭제 기능
    async deletePost() {
      if (confirm("정말 이 글을 삭제하시겠습니까?")) {
        try {
          const storedUser = JSON.parse(localStorage.getItem("currentUser"));
          const currentUserEmail = storedUser.email;
          console.log(currentUserEmail);
          console.log("storedUserEmail: ", storedUser.email);

          await axios.delete(`http://localhost:3000/detail/${this.post.id}`, {
            headers: {
              "current-user": currentUserEmail,
            },
          });
          alert("게시물이 삭제되었습니다.");
          this.$router.push("/list"); // 글 목록 페이지로 이동
        } catch (error) {
          console.error(
            "게시물 삭제 중 오류 발생:",
            error.response?.data || error.message
          );
          alert("게시물 삭제에 실패했습니다.");

          if (error.response?.status === 403) {
            alert("삭제 권한이 없습니다.");
          } else {
            alert("게시물 삭제에 실패했습니다.");
          }
        }
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
  },
  mounted() {
    this.fetchComments();
  },
};
</script>

<style scoped>


.container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
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

.post-detail {
  width: 80%;
  max-width: 900px;
  /* 최대 너비 설정 */
  background-color: #f9f9f9;
  /* 흰색 배경 */
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
  background-color: #aba6a6;
  /* 회색 배경 */
  padding: 20px;
  border-radius: 10px;
}

/* 버튼 스타일 */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.edit-btn,
.delete-btn {
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

.comments-section {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.comments-list {
  margin-top: 10px;
}

.comment-item {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.comment-item p {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

/* 댓글 삭제 버튼 스타일 */
.comment-footer .delete-icon {
  width: 20px; /* X 이모티콘 너비 */
  height: 20px; /* X 이모티콘 높이 */
  cursor: pointer; /* 클릭 가능한 커서 표시 */
  display: flex; /* 플렉스 박스를 사용하여 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  background-color: #ff4d4f; /* 배경색 설정 */
  border-radius: 50%; /* 원형 버튼으로 설정 */
  border: none; /* 테두리 제거 */
}

.comment-footer .delete-icon:hover {
  background-color: #d9363e; /* 호버 시 배경색 변경 */
}


textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
}
.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.comment-footer .like-button {
  margin-left: auto; /* 좋아요 버튼을 오른쪽 끝으로 */
  border: none;
  cursor: pointer;
  font-size: 14px;
}
</style>