const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String, // 타입 지정
    trim: true, // 빈칸을 없애주는 역할 ex) kim sh@naver.com -> kimsh@naver.com
    unique: 1, // 유니크 값 true
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0, // 기본 값 지정
  },
  image: String, // object로 감싸지 않고 바로 타입 지정 가능
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// 유저 스키마에 저장하기 전에 선행으로 하는 작업(pre)
userSchema.pre('save', function (next) {
  const user = this;
  // 비밀번호 암호화 작업
  // salt 생성 - saltRounds 필요
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      // 사용자 패스워드를 가져와서 암호화 작업 진행
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

// 스키마를 모델로 감싸줌
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
