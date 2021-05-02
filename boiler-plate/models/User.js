const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String, // 타입 지정
        trim: true, // 빈칸을 없애주는 역할 ex) kim sh@naver.com -> kimsh@naver.com
        unique: 1 // 유니크 값 true
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0 // 기본 값 지정
    },
    image: String, // object로 감싸지 않고 바로 타입 지정 가능
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 스키마를 모델로 감싸줌
const User = mongoose.model('User', userSchema);

module.exports = {
    User
}