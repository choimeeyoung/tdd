// 경고메시지의 해결
// Mongoose: looks like you're trying to test a Mongoose app with Jest's default jsdom test environment. Please make sure you read Mongoose's docs 
// on configuring Jest to test Node.js apps: http://mongoosejs.com/docs/jest.html

// 원인 : jest 의 기본 Test 환경 => jsdom
//       Mongoose 는 jsdom 지원 X 

// 해결방안 : Jest 의 기본 Test 환경을 jsdom > node 으로 변경
//          jest.config.js 파일 생성 > module.exports = {testEnvironment:"node"} 설정

module.exports = { testEnvironment: "node" }
