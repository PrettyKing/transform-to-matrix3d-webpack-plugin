// test-quick.js - 快速测试脚本
const TransformToMatrix3DPlugin = require('./transform-to-matrix3d-webpack-plugin');

const plugin = new TransformToMatrix3DPlugin();

console.log('🧪 测试基础变换...\n');

// 测试 translateX
const translateX = plugin.convertToMatrix3D('translateX(100px)');
console.log('translateX(100px):', translateX);

// 测试 scale
const scale = plugin.convertToMatrix3D('scale(2)');
console.log('scale(2):', scale);

// 测试组合变换
const combined = plugin.convertToMatrix3D('translateX(100px) scale(2)');
console.log('translateX(100px) scale(2):', combined);

// 测试矩阵乘法
console.log('\n🔢 测试矩阵乘法...\n');
const a = [
  [2, 0, 0, 0],
  [0, 2, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
const b = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [10, 20, 0, 1]
];
const result = plugin.multiplyMatrices(a, b);
console.log('矩阵 A × 矩阵 B =', JSON.stringify(result, null, 2));

console.log('\n✅ 测试完成！');