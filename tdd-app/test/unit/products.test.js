// 단위 테스트 

// jest 의 구조
// describe : 여러 관련 테스트를 그룹화 하는 블록을 생성
// it(=test) : 개별테스트를 수행하는곳
// expect > matcher
// expect : 값을 테스트 할때마다 사용 / 혼자서 거의 사용하지 않으며 matcher 와 함께 사용
// test 실행(터미널에) => npm test

// describe("Calculation",() => {                      // 생략가능 
//     test('two plus two is four', () => {
//         expect(2 + 2).toBe(4);
//     });

//     test('two plus two is not five', () => {
//         expect(2 + 2).not.toBe(5);
//     });
// })

// jest.fn() : Mock함수(단위테스트를 작성시 해당코드가 의존하는 부분을 가짜로 대체하는 일을 수행)를 생성하는 함수

// 데이터를 저장시에는 req객체를 이용하여 요청에 함께 들어온 body를 create 메소드에 인자로 넣어주어야함 / 인자를 주어서 데이터베이스에 저장
// 그래서 단위 테스트에도 req객체가 필요
// 단위테스트에서 req 객체의 이용방법 : node-mocks-http 모듈을 이용
// node-mocks-http 모듈을 이용하여 Express.js 애플리케이션 라우팅함수를 테스트 하기위한 http객체 (request,response)를 얻는 방법

const productController = require('../../controller/products');
const productModel = require('../../models/Product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');
const { response, request } = require('express');
const product = require('../../models/Product');
const productId = "12334";

// Mock 함수의 생성
productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();
let req, res, next;

// beforeEach : 여러개의 테스트에 공통된 Code가 있다면 beforeEach 안에 넣어서 반복을 줄여 줄수 있다.
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})

// create의 단위테스트
describe("Product Controller Create", () => {

    beforeEach(() => {
        req.body = newProduct;
    })
    
    // 함수의 생성
    it("should have a createProduct function", async () => {
        expect(typeof productController.createProduct).toBe("function");
    })

    // status 200인지
    it("should return 200 response code", async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(200);                   // 성공적으로 데이터를 create하면 201 Status를 response 로 보냄
        expect(res._isEndCalled()).toBeTruthy();            // 결과값이 잘 전송됐는지 확인 => isEndCalled
    })

    // return json 인지 
    it("should return json body in response", async () => {
        productModel.create.mockReturnValue(newProduct);         // 가짜함수가 어떤 결과값을 (return)을 할지 직접 알려줄때 mockReturnValue를 사용
        await productController.createProduct(req, res, next);     // 실제 함수 실행
        expect(res._getJSONData()).toStrictEqual(newProduct);   // 실제 함수 실행에서 가져온 data를 ._getJSONData() 메소드를 통해서 가져옴
    });

    //  에러처리를 위한 단위 테스트 작성
    it("should handle errors", async () => {
        // 몽고디비에서 처리하는 부분은 문제가 없다는 것을 가정하에 하는 단위 테스트 이기때문에 원래 몽고디비에서 처리하는 에러메시지 부분을 Mock 함수를 이용하여 처리
        const errorMessage = { message: "description property missing" };    // 임의의 에러메시지의 작성

        // 비동기 요청에대한 결과값은 
        // 성공시 : Promise.resolve(결과값) / .then(response ...) 을 통해서 성공시 수행 
        // 에러시 : Promise.reject(에러원인)
        const rejectedPromise = Promise.reject(errorMessage);

        // return 값의 임의 설정(에러가 발생했기 때문에 Return 값을 error 값으로 주어야함)
        productModel.create.mockReturnValue(rejectedPromise);

        await productController.createProduct(req, res, next);

        // next => 에러를 next 에 담아서 처리 
        // 동기 처리시 에러발생 하면 express 가 자동으로 처리 / 비동기 처리시 에러 발생 서버가 망가짐
        // next 를 통해서 비동기 처리시 발생한 에러를 잘 처리할수 있도록 넘겨줌
        expect(next).toBeCalledWith(errorMessage);
    })
})

// read의 단위테스트
describe("Product Controller Get", () => {
     // 함수의 생성
    it("should have a getProducts function", async () => {
        expect(typeof productController.getProducts).toBe("function");
    })

    // model 의 해당 메서드 호출
    it("should call ProductModel.find({})", async () => {             // .find({}) Object의 값 없이 모든 product를 가져온다.
        await productController.getProducts(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({});
    })

    // return json 인지 
    it("should return 200 response", async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toStrictEqual(200);
        expect(res._isEndCalled()).toBeTruthy();
    })

    // status 200인지
    it("should return json body in response", async () => {
        productModel.find.mockReturnValue(allProducts);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    })

    // 에러발생시 처리
    it("should handle errors", async () => {
        const errorMessage = { message: "description property missing" };
        const rejectedPromise = Promise.reject(errorMessage);

        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

// getById의 단위 테스트
describe("Product Controller GetById", () => {
    // 함수의 생성
    it("should have a getById function", async () => {
        expect(typeof productController.getProductById).toBe("function");
    })

    // model 의 해당 메서드 호출
    it("should call productModel.findById", async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    })

    // return json 인지 , status 200인지
    it("should return json body and response code 200", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    })
    
    // 해당값이 없는 경우의 처리
    it("should return status code 404 where productId null", async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
    })

    // 에러발생시 처리
    it("should handle errors", async () => {
        const errorMessage = { mesaage: "error" };
        const rejectedPromise = Promise.reject(errorMessage);

        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    })

})

// updateProduct의 단위 테스트
describe("Product Controller Update", () => {
    // 함수의 생성
    it("should have a updateProduct function", async () => {
        expect(typeof productController.updateProduct).toBe("function");
    })

    // model 의 해당 메서드 호출
    it("should call productModel.findByIdAndUpdate", async () => {
        req.params.productId = productId;
        req.body = newProduct;
        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toBeCalledWith(productId, newProduct, { new: true });
    })

    // return json 인지 , status 200인지
    it("should return json body and response code 200", async () => {
        req.body = newProduct;
        productModel.findByIdAndUpdate.mockReturnValue(newProduct);

        await productController.updateProduct(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    })

    // 해당값이 없는 경우의 처리
    it("should return status code 404 where productId null", async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    // 에러발생시 처리
    it("should handle errors", async () => {
        const errorMessage = { message: "errorMessage" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })

})

// deleteProduct의 단위 테스트
describe("Product Controller Delete", () => {
    // 함수의 생성
    it("should have a updateProduct function", async () => {
        expect(typeof productController.deleteProduct).toBe("function");
    })

    // model 의 해당 메서드 호출
    it("should call productModel.findByIdAndDelete", async () => {
        req.params.productId = productId;
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
    })

    // return json 인지 , status 200인지
    it("should return json body and response code 200", async () => {
        productModel.findByIdAndDelete.mockReturnValue(newProduct);
        await productController.deleteProduct(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    })

    // 해당값이 없는 경우의 처리
    it("should return status code 404 where productId null", async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    // 에러발생시 처리
    it("should handle errors", async () => {
        const errorMessage = { message: "errorMessage" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})
