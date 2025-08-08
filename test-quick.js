// test-quick.js - 快速测试脚本
const TransformToMatrix3DPlugin = require('./transform-to-matrix3d-webpack-plugin');

const plugin = new TransformToMatrix3DPlugin();

console.log('🧪 测试 Transform to Matrix3D 插件...\n');

// 测试用例数组
const testCases = [
  {
    input: 'translateX(100px)',
    expected: 'matrix3d(1, 0, 0, 100, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '单独的 X 轴平移'
  },
  {
    input: 'translateY(50px)',
    expected: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 50, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '单独的 Y 轴平移'
  },
  {
    input: 'scale(2)',
    expected: 'matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '等比缩放'
  },
  {
    input: 'rotate(90deg)',
    expected: 'matrix3d(0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '90度旋转'
  },
  {
    input: 'translateX(100px) scale(2)',
    expected: 'matrix3d(2, 0, 0, 200, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '先平移后缩放（平移值会被缩放）'
  },
  {
    input: 'scale(2) translateX(100px)',
    expected: 'matrix3d(2, 0, 0, 100, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '先缩放后平移（平移值不受缩放影响）'
  },
  {
    input: 'translateX(-100px)',
    expected: 'matrix3d(1, 0, 0, -100, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '负值平移'
  },
  {
    input: 'scale(1.5)',
    expected: 'matrix3d(1.5, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
    description: '小数缩放'
  }
];

let passedTests = 0;
let totalTests = testCases.length;

console.log('📋 运行测试用例...\n');

testCases.forEach((testCase, index) => {
  const result = plugin.convertToMatrix3D(testCase.input);
  const passed = result === testCase.expected;
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   输入: ${testCase.input}`);
  console.log(`   期望: ${testCase.expected}`);
  console.log(`   实际: ${result}`);
  console.log(`   结果: ${passed ? '✅ 通过' : '❌ 失败'}\n`);
  
  if (passed) passedTests++;
});

// 测试矩阵操作
console.log('🔢 测试矩阵操作...\n');

// 测试单位矩阵
const identityMatrix = plugin.createIdentityMatrix();
const expectedIdentity = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
const identityTest = JSON.stringify(identityMatrix) === JSON.stringify(expectedIdentity);
console.log(`单位矩阵: ${identityTest ? '✅ 通过' : '❌ 失败'}`);

// 测试矩阵乘法
const matrixA = [
  [2, 0, 0, 0],
  [0, 2, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
const matrixB = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [10, 20, 0, 1]
];
const multiplyResult = plugin.multiplyMatrices(matrixA, matrixB);
const expectedMultiply = [
  [2, 0, 0, 0],
  [0, 2, 0, 0],
  [0, 0, 1, 0],
  [10, 20, 0, 1]
];
const multiplyTest = JSON.stringify(multiplyResult) === JSON.stringify(expectedMultiply);
console.log(`矩阵乘法: ${multiplyTest ? '✅ 通过' : '❌ 失败'}`);

// 测试度数转弧度
const radTest = Math.abs(plugin.degToRad(90) - Math.PI / 2) < 1e-10;
console.log(`度数转弧度: ${radTest ? '✅ 通过' : '❌ 失败'}`);

// 测试错误处理
const invalidResult = plugin.convertToMatrix3D('invalid-transform');
const errorTest = invalidResult === null;
console.log(`错误处理: ${errorTest ? '✅ 通过' : '❌ 失败'}`);

// 总结
console.log('\n📊 测试总结');
console.log('═'.repeat(50));
console.log(`变换测试: ${passedTests}/${totalTests} 通过`);
console.log(`矩阵操作测试: ${identityTest && multiplyTest && radTest && errorTest ? '4/4' : '<4/4'} 通过`);
console.log(`总体状态: ${passedTests === totalTests && identityTest && multiplyTest && radTest && errorTest ? '🎉 全部通过！' : '⚠️  有测试失败'}`);

if (passedTests === totalTests && identityTest && multiplyTest && radTest && errorTest) {
  console.log('\n✨ 插件工作正常，可以发布到 npm！');
} else {
  console.log('\n🔧 需要修复失败的测试用例。');
}

console.log('\n🚀 运行 "npm test" 来执行完整的测试套件。');