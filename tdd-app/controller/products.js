
const productModel = require('../models/product')

// exports.hello = (req, res) => {
//     res.send('안녕하세요.')
// };

exports.createProduct = async (req, res, next) => {
    try {
        const createProduct = await productModel.create(req.body);
        // Promise { <pending> } 출력 , Product 데이터를 저장시 비동기 처리를 하기 때문
        res.status(200).json(createProduct);                   // 해결방법
        // .then 이용 
        // async , await : 함수앞에 async 를 넣어줌 , 실제 함수 처리 부분에 await 을 붙여주고 
        // 다음 함수를 실행
        // 단위 테스트 시에도 동일하게 동기화 처리를 해줘야 한다.
    } catch (error) {
        next(error)
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const allProducts = await productModel.find({});
        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        next(error)
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        let updateProduct = await productModel.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        // {new:true} => update 후 변경된 값을 반환 해줌을 위한 설정

        if (updateProduct) {
            res.status(200).json(updateProduct);
        } else {
            res.status(404).send();
        }

    } catch (error) {
        next(error);
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const deleteProduct = await productModel.findByIdAndDelete(req.params.productId);
        if (deleteProduct) {
            res.status(200).json(deleteProduct);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        next(error);
    }
}


