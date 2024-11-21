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

  // MySQL에서 사용자 정보 확인
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [id, password], (err, results) => {
    if (err) {
      console.error('로그인 중 오류 발생:', err);
      res.status(500).json({ message: '로그인 실패' });
    } else if (results.length > 0) {
      res.status(200).json({ message: '로그인 성공!', user: results[0] });
    } else {
      res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
