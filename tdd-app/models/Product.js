const mongooes = require('mongoose');    // Mongooses가 Node 와 MongoDB를 이어준다.

// 스키마의 생성
const productSchema = new mongooes.Schema({         // constructor 함수를 몽구스에서 제공해서 새로운 스키마를 정의 할수 있음
    name:{                                          // 필드에 대한 정의
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number
    }
});

const product = mongooes.model("Product",productSchema);    //  스키마를 이용하여 Model을 만듦

module.exports = product;                                   // 다른 파일에서도 사용할수 있도록 export 해줌