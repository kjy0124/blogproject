const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // JSON 데이터 처리
app.use(cors()); // CORS 문제 해결

// MySQL 연결 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // MySQL 사용자 이름
  password: "20000124", // MySQL 비밀번호
  database: "blog_project", // 생성한 데이터베이스 이름
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
  console.log("MySQL 연결 성공!");
});

// 회원가입 API
app.post("/signup", (req, res) => {
  const { name, id, password } = req.body;

  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, id, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "회원가입 실패", error: err });
    }
    res.status(201).json({ message: "회원가입 성공!" });
  });
});

// 로그인 API
app.post("/login", (req, res) => {
  const { id, password } = req.body;

  console.log("로그인 요청 데이터:", req.body); // 요청 데이터 로그 출력

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [id, password], (err, results) => {
    if (err) {
      console.error("로그인 중 오류 발생:", err);
      res.status(500).json({ message: "로그인 실패" });
    } else if (results.length > 0) {
      console.log("로그인 성공:", results[0]); // 성공 로그 출력
      res.status(200).json({ message: "로그인 성공!", user: results[0] });
    } else {
      console.log("로그인 실패: 아이디 또는 비밀번호 불일치");
      res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  });
});

//게시판 작성 API
app.post("/create", (req, res) => {
  const { name, title, content, email } = req.body;
  const query =
    "INSERT INTO noticeBoard (name, title, content, email) VALUES (?, ?, ?, ?)";
  db.query(query, [name, title, content, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "게시물 생성 실패", error: err });
    }
    res
      .status(201)
      .json({ message: "게시물 작성 완료", postId: result.insertId });
  });
});

app.get("/list", (req, res) => {
  const { myPostsOnly, currentUserEmail } = req.query;
  let query =
    "SELECT id, name, title, content, views, created_at FROM noticeBoard";
  const params = [];

  if (myPostsOnly === "true" && currentUserEmail) {
    query += " WHERE email = ? ";
    params.push(currentUserEmail.trim());
  }

  query += " ORDER BY views DESC ";

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "게시물 조회 실패", error: err });
    }
    res.status(200).json(results);
  });
});

//검색 API
app.get("/api/search", (req, res) => {
  // const keyword = req.query.keyword;
  const { type, keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "검색어를 입력해주세요." });
  }

  let query = "";
  const params = [`%${keyword}%`];

  if (type === "title") {
    query = `
      SELECT id, title, content, created_at, name, views
      FROM noticeBoard
      WHERE title LIKE ?
      `;
  } else if (type === "name") {
    query = `
      SELECT id, title, content, created_at, name, views
      FROM noticeBoard
      WHERE name LIKE ?
      `;
  } else {
    return res.status(400).json({ message: "유효하지 않은 검색 타입입니다." });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("검색 싪패:", err);
      return res.status(500).json({ message: "검색 중 오류가 발생했습니다.", error: err });
    }
    res.json(results);
  });
});

// GET /detail/:id 라우트
app.get("/detail/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10); // URL 파라미터에서 ID 가져오기
  if (isNaN(postId)) {
    return res.status(400).json({ message: "잘못된 게시물 ID입니다." }); // 잘못된 요청 처리
  }

  // 데이터베이스 쿼리
  const query = `
    SELECT n.*, 
          (SELECT COUNT(*) FROM comments WHERE comments.postId = n.id) AS commentCount
    FROM noticeBoard n
    WHERE n.id = ?
  `;
  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error("DB 쿼리 오류:", err);
      return res.status(500).json({ message: "서버 오류 발생", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
    }

    // 성공적으로 게시물 조회
    res.status(200).json({ post: results[0] });
  });
});

//조회수 증가 API
app.put("/detail/:id/views", (req, res) => {
  const postId = parseInt(req.params.id);

  const query = "UPDATE noticeBoard SET views = views + 1 WHERE id = ?";

  db.query(query, [postId], (err) => {
    if (err) {
      return res.status(500).json({ message: "조회수 증가 실패", error: err });
    }

    res.status(200).json({ message: "조회수 증가 성공" });
  });
});

//게시글 삭제 API
app.delete("/detail/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10); // 게시글 ID
  const currentUserEmail = req.headers["current-user"]; // 현재 사용자 이메일

  if (!currentUserEmail) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  // 게시물 작성자 확인
  const selectQuery = "SELECT email FROM noticeBoard WHERE id = ?";
  db.query(selectQuery, [postId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "게시물 조회 실패", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
    }

    const postAuthorEmail = results[0].email;
    if (postAuthorEmail.trim().toLowerCase() !== currentUserEmail.trim().toLowerCase()) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    // 댓글에 연결된 좋아요 기록 삭제
    const deleteLikesQuery = `
      DELETE likes 
      FROM likes 
      JOIN comments ON likes.post_id = comments.id 
      WHERE comments.postId = ?`;
    db.query(deleteLikesQuery, [postId], (err) => {
      if (err) {
        return res.status(500).json({ message: "좋아요 기록 삭제 실패", error: err });
      }

      // 댓글 삭제
      const deleteCommentsQuery = "DELETE FROM comments WHERE postId = ?";
      db.query(deleteCommentsQuery, [postId], (err) => {
        if (err) {
          return res.status(500).json({ message: "댓글 삭제 실패", error: err });
        }

        // 게시글 삭제
        const deletePostQuery = "DELETE FROM noticeBoard WHERE id = ?";
        db.query(deletePostQuery, [postId], (err) => {
          if (err) {
            return res.status(500).json({ message: "게시물 삭제 실패", error: err });
          }
          res.status(200).json({ message: "게시물 및 관련 데이터 삭제 성공" });
        });
      });
    });
  });
});



// 게시물 수정 API
app.put("/detail/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  const currentUserEmail = req.headers["current-user"];

  if (!currentUserEmail) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  const selectQuery = "SELECT email FROM noticeBoard WHERE id = ?";
  db.query(selectQuery, [postId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "게시물 조회 실패", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
    }

    const postAuthorEmail = results[0].email;

    if (
      postAuthorEmail.trim().toLowerCase() !==
      currentUserEmail.trim().toLowerCase()
    ) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const updateQuery =
      "UPDATE noticeBoard SET title = ?, content = ? WHERE id = ?";
    db.query(updateQuery, [title, content, postId], (err, result) => {
      if (err) {
        console.error("게시물 수정 실패:", err);
        return res
          .status(500)
          .json({ message: "게시물 수정 실패", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
      }

      res.status(200).json({ message: "게시물 수정 성공" });
    });
  });
});
//좋아요 추가 API
app.post("/api/comments/:id/likes", (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  const userEmail = req.body.userId;

  if (!userEmail) {
    return res.status(400).json({ message: "사용자 정보가 없습니다." });
  }

  // 좋아요 여부 확인
  const checkQuery = "SELECT * FROM likes WHERE user_id = ? AND post_id = ?";
  db.query(checkQuery, [userEmail, commentId], (err, results) => {
    if (err) {
      console.error("좋아요 확인 실패:", err);
      return res.status(500).json({ message: "좋아요 확인 실패", error: err });
    }

    if (results.length > 0) {
      // 좋아요 취소
      const deleteQuery = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
      db.query(deleteQuery, [userEmail, commentId], (err) => {
        if (err) {
          console.error("좋아요 취소 실패:", err);
          return res
            .status(500)
            .json({ message: "좋아요 취소 실패", error: err });
        }
        return res.status(200).json({ message: "좋아요 취소 성공" });
      });
    } else {
      // 좋아요 추가
      const insertQuery = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
      db.query(insertQuery, [userEmail, commentId], (err) => {
        if (err) {
          console.error("좋아요 추가 실패:", err);
          return res
            .status(500)
            .json({ message: "좋아요 추가 실패", error: err });
        }
        return res.status(200).json({ message: "좋아요 추가 성공" });
      });
    }
  });
});

//좋아요 조회 API
app.get("/api/comments/:id/likes", async (req, res) => {
  const commentId = parseInt(req.params.id, 10); // 댓글 ID 사용
  const userEmail = req.query.userId; // 이메일 사용

  if (!userEmail) {
    return res.status(400).json({ message: "사용자 정보가 없습니다." });
  }

  try {
    // 좋아요 개수 조회
    const [likeCountRows] = await db
      .promise()
      .query("SELECT COUNT(*) AS likesCount FROM likes WHERE post_id = ?", [
        commentId,
      ]);

    // 사용자의 좋아요 여부 확인
    const [userLikeRows] = await db
      .promise()
      .query("SELECT * FROM likes WHERE user_id = ? AND post_id = ?", [
        userEmail,
        commentId,
      ]);

    res.json({
      likesCount: likeCountRows[0].likesCount || 0,
      isLiked: userLikeRows.length > 0,
    });
  } catch (error) {
    console.error("좋아요 상태 조회 실패:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

//좋아요 제거 API
app.delete("/api/comments/:id/likes", (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: "사용자 정보가 없습니다." });
  }

  const deleteQuery = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
  db.query(deleteQuery, [userId, commentId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "좋아요 삭제 실패", error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "좋아요 기록이 없습니다." });
    }
    res.status(200).json({ message: "좋아요 취소 성공" });
  });
});

//댓글작성 API
app.post("/comments/:postId", (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  const { userEmail, content } = req.body;

  if (!userEmail || !content) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  const query =
    "INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)";
  db.query(query, [postId, userEmail, content], (err, results) => {
    if (err) {
      console.error("댓글 작성 실패:", err);
      return res.status(500).json({ message: "댓글 생성 실패", error: err });
    }

    // 작성된 댓글 데이터를 반환
    const selectQuery = `
      SELECT id, postId, userId AS username, content, createdAt 
      FROM comments 
      WHERE id = ?
    `;
    db.query(selectQuery, [results.insertId], (err, commentResults) => {
      if (err) {
        console.error("댓글 조회 실패:", err);
        return res.status(500).json({ message: "댓글 조회 실패", error: err });
      }
      res.status(201).json(commentResults[0]); // 새로 생성된 댓글 반환
    });
  });
});

//댓글 조회 API
app.get("/comments/:postId", (req, res) => {
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ message: "잘못된 게시물 ID입니다." });
  }

  const query = `
    SELECT id, postId, userId, content, createdAt 
    FROM comments 
    WHERE postId = ?
  `;

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error("댓글 조회 실패:", err);
      return res.status(500).json({ message: "댓글 조회 실패", error: err });
    }

    res.status(200).json(results);
  });
});

//댓글 삭제 API
app.delete("/comments/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const currentUserEmail = req.headers["current-user"];

  if (!currentUserEmail) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  // 댓글 작성자 확인
  const selectQuery = "SELECT userId FROM comments WHERE id = ?";
  db.query(selectQuery, [commentId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "댓글 조회 실패", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }
    const commentAuthorEmail = results[0].userId;
    if (
      commentAuthorEmail.trim().toLowerCase() !==
      currentUserEmail.trim().toLowerCase()
    ) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    // 좋아요 기록 삭제
    const deleteLikesQuery = "DELETE FROM likes WHERE post_id = ?";
    db.query(deleteLikesQuery, [commentId], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "좋아요 기록 삭제 실패", error: err });
      }

      // 댓글 삭제
      const deleteCommentQuery = "DELETE FROM comments WHERE id = ?";
      db.query(deleteCommentQuery, [commentId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "댓글 삭제 실패", error: err });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
        }
        res.status(200).json({ message: "댓글 삭제 성공" });
      });
    });
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});