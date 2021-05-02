const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const { User } = require('./models/User');
const config = require('./config/key');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', (req, res) => {
  //회원 가입할 때 필요한 정보를 client에서 가져오면 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ suceess: false, err });
    return res.status(200).json({ suceess: true });
  });
});
/**
 * 1. DB 에 요청한 E-mail 찾기 - User.findOne()
 * 2. DB 에 요청한 E-mail 이 존재한다면 비밀번호가 같은지 확인 - Bcrypt Hashed 값 비교
 * 3. 비밀번호가 같다면 Token 생성 - JsonWebToken 활용
 */
app.post('/login', (req, res) => {
  // step1
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'not_found_email',
      });
    }
    // step2
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: 'not_match_password',
        });
      // step3
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 저장한다. 쿠키, 로컬스토리지
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
