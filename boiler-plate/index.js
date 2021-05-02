const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const { User } = require('./models/User');

app.use(express.json());
app.use(express.urlencoded());

mongoose
  .connect(
    'mongodb+srv://boilerplate:boilerplate@boilerplate.lxzbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
