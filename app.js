const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // JSON 데이터 처리
app.use(cors()); // CORS 문제 해결

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQL 사용자 이름
  password: '20000124', // MySQL 비밀번호
  database: 'blog_project' // 생성한 데이터베이스 이름
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});

// 회원가입 API
app.post('/signup', (req, res) => {
  const { name, id, password } = req.body;

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, id, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: '회원가입 실패', error: err });
    }
    res.status(201).json({ message: '회원가입 성공!' });
  });
});

// 로그인 API
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  console.log('로그인 요청 데이터:', req.body); // 요청 데이터 로그 출력

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [id, password], (err, results) => {
    if (err) {
      console.error('로그인 중 오류 발생:', err);
      res.status(500).json({ message: '로그인 실패' });
    } else if (results.length > 0) {
      console.log('로그인 성공:', results[0]); // 성공 로그 출력
      res.status(200).json({ message: '로그인 성공!', user: results[0] });
    } else {
      console.log('로그인 실패: 아이디 또는 비밀번호 불일치');
      res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // JSON 데이터 처리
app.use(cors()); // CORS 문제 해결

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQL 사용자 이름
  password: '20000124', // MySQL 비밀번호
  database: 'blog_project' // 생성한 데이터베이스 이름
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});

// 회원가입 API
app.post('/signup', (req, res) => {
  const { name, id, password } = req.body;

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, id, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: '회원가입 실패', error: err });
    }
    res.status(201).json({ message: '회원가입 성공!' });
  });
});

// 로그인 API
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  console.log('로그인 요청 데이터:', req.body); // 요청 데이터 로그 출력

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [id, password], (err, results) => {
    if (err) {
      console.error('로그인 중 오류 발생:', err);
      res.status(500).json({ message: '로그인 실패' });
    } else if (results.length > 0) {
      console.log('로그인 성공:', results[0]); // 성공 로그 출력
      res.status(200).json({ message: '로그인 성공!', user: results[0] });
    } else {
      console.log('로그인 실패: 아이디 또는 비밀번호 불일치');
      res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }
  });
});

//게시판 작성 API
app.post('/create', (req, res) => {
  const { name, title, content } = req.body;
  const query = 'INSERT INTO noticeBoard (name, title, content) VALUES (?, ?, ?)';
  db.query(query, [name, title, content], (err, result) => {
    if (err) {
      return res.status(500).json({ message: '게시물 생성 실패', error: err });
    }
    res.status(201).json({ message: '게시물 작성 완료', postId: result.insertId });
  });
});

app.get('/list', (req, res) => {
  const query = 'SELECT id, name, title, content, views, created_at FROM noticeBoard ORDER BY views DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: '게시물 조회 실패', error: err });
    }
    res.status(200).json(results);
  });
});

// GET /detail/:id 라우트
app.get('/detail/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10); // URL 파라미터에서 ID 가져오기
  if (isNaN(postId)) {
    return res.status(400).json({ message: '잘못된 게시물 ID입니다.' }); // 잘못된 요청 처리
  }

  // 데이터베이스 쿼리
  const query = 'SELECT * FROM noticeBoard WHERE id = ?';
  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('DB 쿼리 오류:', err);
      return res.status(500).json({ message: '서버 오류 발생', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }

    // 성공적으로 게시물 조회
    res.status(200).json({ post: results[0] });
  });
});


//조회수 증가 API
app.put('/detail/:id/views', (req, res) => {
  const postId = parseInt(req.params.id);
  
  const query = 'UPDATE noticeBoard SET views = views + 1 WHERE id = ?';
  
  db.query(query, [postId], (err) => {
    if (err) {
      return res.status(500).json({ message: '조회수 증가 실패', error: err });
    }
    
    res.status(200).json({ message: '조회수 증가 성공' });
  });
});

app.delete('/detail/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const query = 'DELETE FROM noticeBoard WHERE id = ?';
  
  db.query(query, [postId], (err) => {
    if (err) {
      return res.status(500).json({ message: '게시물 삭제 실패', error: err });
    }
    
    res.status(200).json({ message: '게시물 삭제 성공' });
  });
});

// 게시물 수정 API
app.put('/detail/:id', (req, res) => {
  console.log(`PUT요청 수신: ID = &{req.params.id}`);
  const postId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 모두 입력해주세요.' });
  }

  const query = 'UPDATE noticeBoard SET title = ?, content = ? WHERE id = ?';
  
  db.query(query, [title, content, postId], (err, result) => {
    if (err) {
      console.error('게시물 수정 실패:', err);
      return res.status(500).json({ message: '게시물 수정 실패', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }

    res.status(200).json({ message: '게시물 수정 성공' });
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
