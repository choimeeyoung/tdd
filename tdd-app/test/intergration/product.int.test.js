// 통합테스트 
// 단위테스트 에서는 MongoDB 부분은 모두 정상이라는 가정하에 테스트 진행

const { response } = require('express');
const request = require('supertest');                   // 통합테스트 시 사용
const app = require('../../server');
const newProduct = require('../data/new-product');
let firstProduct;

// create의 통합테스트
describe("Product Controller create", () => {
    it("POST /api/products", async () =>{
        // controller 에서 작성한 것과 동일하게 작성
         const response =  await request(app)
           .post('/api/products')
           .send(newProduct);                             // res.body 값의 전달
           
           // 상태값 과 반환받은 값의 체크
           expect(response.statusCode).toBe(200)
           expect(response.body.name).toBe(newProduct.name)
           expect(response.body.discription).toBe(newProduct.discription)
           expect(response.body.price).toBe(newProduct.price);
       })
       
       it("should return 500 on POST /api/products", async () =>{
           const response = await request(app)
           .post('/api/products')
           .send({name:"name01"})
       
           // console.log(response.body)                                   아무런 값도 받아오지 못함 (error Handler  작성 하지 않은 경우)
           
           expect(response.statusCode).toBe(500);
           expect(response.body).toStrictEqual({
               message : "Product validation failed: description: Path `description` is required."
           });
       })
})

// read의 통합테스트
describe("Product Controller read", () => {
    it("GET /api/products", async () => {
        const response = await request(app)
        .get("/api/products");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].description).toBeDefined();
        firstProduct = response.body[0];
    })
})

// getProductById의 통합테스트
describe("Product Controller getProductById", () => {
    it("GET /api/products/:productId", async () => {
        const response = await request(app)
        .get("/api/products/" + firstProduct._id)

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(firstProduct.name);
        expect(response.body.description).toBe(firstProduct.description);
    })

    it("GET id doenst exist /api/products/:productId", async () => {
        const response = await request(app)
            .get("/api/products"+"2");
            expect(response.statusCode).toBe(404);
    })
});

// updateProduct의 통합테스트
describe("Product Controller findByIdAndUpdate",()=>{
    it("PUT /api/products",async () => {
        const response = await request(app)
            .put("/api/products/"+ firstProduct._id)
            .send(newProduct)

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(newProduct.name);
        expect(response.body.description).toBe(newProduct.description);
        expect(response.body.price).toBe(newProduct.price);
    })

    it("UPDATE id doenst exist /api/products/:productId", async () =>{
        const response = await request(app)
        .put("/api/products"+"123")
        .send({newProduct});

        expect(response.statusCode).toBe(404);
    });
})


// deleteProduct의 통합 테스트
describe("Product Controller findByIdAndDelete",() => {
    it("DELETE /api/products", async() =>{
        const response = await request(app)
            .delete("/api/products/"+firstProduct._id)
            .send(newProduct);

            expect(response.statusCode).toBe(200);
            expect(newProduct.name).toStrictEqual(newProduct.name);
            expect(newProduct.description).toStrictEqual(newProduct.description);
            expect(newProduct.price).toStrictEqual(newProduct.price);
    })

    it("DELETE id doenst exist /api/products/:productId", async () => {
        const response = await request(app)
            .delete("/api/products"+"123")
            .send(newProduct);
        
            expect(response.statusCode).toBe(404);
    })
})