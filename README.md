# Transform to Matrix3D Webpack Plugin

一个Webpack插件，可以将CSS中的transform属性转换为matrix3d格式，提高渲染性能和跨浏览器兼容性。

## 特性

- 🚀 **性能优化**: 将多个transform函数合并为单个matrix3d，减少重排和重绘
- 🔧 **自动转换**: 支持所有标准CSS transform函数
- ⚙️ **灵活配置**: 可选择保留原始属性作为fallback
- 🧪 **完整测试**: 包含全面的单元测试
- 📦 **零依赖**: 仅依赖PostCSS和postcss-value-parser

## 安装

```bash
npm install transform-to-matrix3d-webpack-plugin --save-dev
```

## 使用方法

在你的Webpack配置文件中添加插件：

```javascript
const TransformToMatrix3DPlugin = require('transform-to-matrix3d-webpack-plugin');

module.exports = {
  // ... 其他配置
  plugins: [
    new TransformToMatrix3DPlugin({
      // 选项配置
      enabled: true,
      keepOriginal: false,
      test: /\.css$/
    })
  ]
};
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enabled` | boolean | `true` | 是否启用插件 |
| `keepOriginal` | boolean | `false` | 是否保留原始transform属性作为fallback |
| `test` | RegExp | `/\.css$/` | 要处理的文件扩展名正则表达式 |

## 转换示例

### 输入CSS
```css
.element {
  transform: translateX(100px) rotateZ(45deg) scale(1.5);
}

.another {
  transform: translate3d(50px, 100px, 0) rotateY(30deg);
}
```

### 输出CSS
```css
.element {
  transform: matrix3d(1.06066, 1.06066, 0, 100, -1.06066, 1.06066, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, 1);
}

.another {
  transform: matrix3d(0.866025, 0, 0.5, 50, 0, 1, 0, 100, -0.5, 0, 0.866025, 0, 0, 0, 0, 1);
}
```

## 支持的Transform函数

- `translateX(x)`
- `translateY(y)`
- `translateZ(z)`
- `translate(x, y)`
- `translate3d(x, y, z)`
- `scaleX(sx)`
- `scaleY(sy)`
- `scaleZ(sz)`
- `scale(s)` / `scale(sx, sy)`
- `scale3d(sx, sy, sz)`
- `rotateX(angle)`
- `rotateY(angle)`
- `rotateZ(angle)` / `rotate(angle)`
- `skewX(angle)`
- `skewY(angle)`
- `matrix(a, b, c, d, e, f)`
- `matrix3d(...)` (保持不变)

## 为什么使用Matrix3D？

1. **性能优化**: 单个matrix3d比多个transform函数渲染更快
2. **GPU加速**: matrix3d会触发硬件加速
3. **一致性**: 避免不同浏览器对transform函数的解析差异
4. **精确控制**: 提供更精确的变换控制

## 开发

### 安装依赖
```bash
npm install
```

### 运行测试
```bash
npm test
```

### 发布到npm
```bash
npm publish
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.0.0
- 初始发布
- 支持所有标准CSS transform函数
- 完整的单元测试覆盖