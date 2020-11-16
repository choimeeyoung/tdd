// Express 모듈 불러오기
const express = require('express')
const productRoutes = require('./routes');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://choimy:rnswk8018@cluster0.sxqdx.mongodb.net/cluster0?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB Connected...'))
    .catch(error => console.log(error));


// Express 서버를 위한 포트 설정
const PORT = 5000;

//호스트 지정
//const HOST = '0.0.0.0';

// 새로운 Express 어플 생성
const app = express();

// 에러처리를 위한 통합 테스트 
// express 에러처리방법
// express는 미들웨어에서 에러가 발생하면 에러를 에러처리기로 보내줌
// express의 에러처리기는 인자값이 4개이어야함  / error , req , res , next
// 비동기 요청에 대한 에러를 위 와 같이 처리시 Server가 망가지게됨
// 해결방법 : error 를 next 인자에 넣어서 보내주면 자동으로 error를 error핸들러 로 보내준다.
// error Handler 부분을 작성해주어야 한다.



// front 에서 들어오는 POST 요청에대해서 bodyParser 모듈의 대체 역할을 함
app.use(express.json());

app.use("/api/products", productRoutes);

// '/' 경로로 요청이 오면 Hello World를 결과 값으로 전달
// app.get('/', (req, res) => {
//     res.send("Hello World")
// });

// error 처리 Handler (error처리 Handler 는 항상 맨 마지막에 작성해야 한다.)
app.use((error,req,res,next)=>{
    res.status(500).json({message : error.message})
})


// 해당 포트와 호스트에서 HTTP서버를 시작
// app.listen(PORT,HOST);

app.listen(PORT);

console.log('Running on port ${PORT}')


module.exports = app;

