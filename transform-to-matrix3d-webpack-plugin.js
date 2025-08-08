// transform-to-matrix3d-webpack-plugin.js
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

class TransformToMatrix3DPlugin {
  constructor(options = {}) {
    this.options = {
      // 是否启用插件
      enabled: true,
      // 是否保留原始transform属性作为fallback
      keepOriginal: false,
      // 要处理的文件扩展名
      test: /\.css$/,
      ...options
    };
  }

  apply(compiler) {
    if (!this.options.enabled) return;

    const pluginName = 'TransformToMatrix3DPlugin';

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // 处理CSS资源
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets, callback) => {
          const promises = [];

          Object.keys(assets).forEach((assetName) => {
            if (this.options.test.test(assetName)) {
              const asset = assets[assetName];
              const cssContent = asset.source();
              
              const promise = this.processCSS(cssContent).then((processedCSS) => {
                // 更新资源
                compilation.updateAsset(assetName, {
                  source: () => processedCSS,
                  size: () => processedCSS.length
                });
              });
              
              promises.push(promise);
            }
          });

          Promise.all(promises)
            .then(() => callback())
            .catch(callback);
        }
      );
    });
  }

  async processCSS(cssContent) {
    const result = await postcss([
      this.createTransformProcessor()
    ]).process(cssContent, { from: undefined });
    
    return result.css;
  }

  createTransformProcessor() {
    return {
      postcssPlugin: 'transform-to-matrix3d',
      Declaration: {
        transform: (decl) => {
          const transformValue = decl.value;
          const matrix3d = this.convertToMatrix3D(transformValue);
          
          if (matrix3d) {
            if (this.options.keepOriginal) {
              // 在原属性后添加matrix3d版本
              decl.cloneAfter({
                prop: 'transform',
                value: matrix3d
              });
            } else {
              // 替换原属性
              decl.value = matrix3d;
            }
          }
        }
      }
    };
  }

  convertToMatrix3D(transformValue) {
    try {
      const parsed = valueParser(transformValue);
      const transforms = [];
      
      parsed.walk((node) => {
        if (node.type === 'function') {
          transforms.push(node);
        }
      });

      if (transforms.length === 0) return null;

      // 创建单位矩阵
      let matrix = this.createIdentityMatrix();

      // 处理每个transform函数
      transforms.forEach((transform) => {
        const transformMatrix = this.getTransformMatrix(transform);
        if (transformMatrix) {
          matrix = this.multiplyMatrices(matrix, transformMatrix);
        }
      });

      // 转换为CSS matrix3d格式
      return this.matrixToCSS(matrix);
    } catch (error) {
      console.warn('Failed to convert transform to matrix3d:', error);
      return null;
    }
  }

  createIdentityMatrix() {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  getTransformMatrix(transform) {
    const name = transform.value;
    const args = transform.nodes
      .filter(node => node.type === 'word' || node.type === 'function')
      .map(node => parseFloat(node.value) || 0);

    switch (name) {
      case 'translateX':
        return this.translateXMatrix(args[0] || 0);
      case 'translateY':
        return this.translateYMatrix(args[0] || 0);
      case 'translateZ':
        return this.translateZMatrix(args[0] || 0);
      case 'translate':
        return this.translateMatrix(args[0] || 0, args[1] || 0);
      case 'translate3d':
        return this.translate3dMatrix(args[0] || 0, args[1] || 0, args[2] || 0);
      case 'scaleX':
        return this.scaleXMatrix(args[0] || 1);
      case 'scaleY':
        return this.scaleYMatrix(args[0] || 1);
      case 'scaleZ':
        return this.scaleZMatrix(args[0] || 1);
      case 'scale':
        return this.scaleMatrix(args[0] || 1, args[1] || args[0] || 1);
      case 'scale3d':
        return this.scale3dMatrix(args[0] || 1, args[1] || 1, args[2] || 1);
      case 'rotateX':
        return this.rotateXMatrix(this.degToRad(args[0] || 0));
      case 'rotateY':
        return this.rotateYMatrix(this.degToRad(args[0] || 0));
      case 'rotateZ':
      case 'rotate':
        return this.rotateZMatrix(this.degToRad(args[0] || 0));
      case 'skewX':
        return this.skewXMatrix(this.degToRad(args[0] || 0));
      case 'skewY':
        return this.skewYMatrix(this.degToRad(args[0] || 0));
      case 'matrix':
        return this.matrix2dTo3d(args);
      case 'matrix3d':
        return this.arrayToMatrix(args);
      default:
        return null;
    }
  }

  // Transform matrix generators - 修正平移矩阵的位置
  translateXMatrix(x) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, 0, 0, 1]
    ];
  }

  translateYMatrix(y) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, y, 0, 1]
    ];
  }

  translateZMatrix(z) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, z, 1]
    ];
  }

  translateMatrix(x, y) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, y, 0, 1]
    ];
  }

  translate3dMatrix(x, y, z) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, y, z, 1]
    ];
  }

  scaleXMatrix(sx) {
    return [
      [sx, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  scaleYMatrix(sy) {
    return [
      [1, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  scaleZMatrix(sz) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1]
    ];
  }

  scaleMatrix(sx, sy) {
    return [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  scale3dMatrix(sx, sy, sz) {
    return [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1]
    ];
  }

  rotateXMatrix(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      [1, 0, 0, 0],
      [0, cos, -sin, 0],
      [0, sin, cos, 0],
      [0, 0, 0, 1]
    ];
  }

  rotateYMatrix(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      [cos, 0, sin, 0],
      [0, 1, 0, 0],
      [-sin, 0, cos, 0],
      [0, 0, 0, 1]
    ];
  }

  rotateZMatrix(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      [cos, -sin, 0, 0],
      [sin, cos, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  skewXMatrix(angle) {
    return [
      [1, Math.tan(angle), 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  skewYMatrix(angle) {
    return [
      [1, 0, 0, 0],
      [Math.tan(angle), 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  matrix2dTo3d(values) {
    const [a, b, c, d, e, f] = values;
    return [
      [a, c, 0, 0],
      [b, d, 0, 0],
      [0, 0, 1, 0],
      [e, f, 0, 1]
    ];
  }

  arrayToMatrix(values) {
    if (values.length !== 16) return null;
    return [
      [values[0], values[4], values[8], values[12]],
      [values[1], values[5], values[9], values[13]],
      [values[2], values[6], values[10], values[14]],
      [values[3], values[7], values[11], values[15]]
    ];
  }

  multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result[i] = [];
      for (let j = 0; j < 4; j++) {
        result[i][j] = 0;
        for (let k = 0; k < 4; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }

  matrixToCSS(matrix) {
    // 将4x4矩阵转换为CSS matrix3d格式 (按列优先顺序)
    const values = [
      matrix[0][0], matrix[1][0], matrix[2][0], matrix[3][0],
      matrix[0][1], matrix[1][1], matrix[2][1], matrix[3][1],
      matrix[0][2], matrix[1][2], matrix[2][2], matrix[3][2],
      matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]
    ];
    
    // 格式化数值，去除不必要的小数
    const formattedValues = values.map(v => {
      if (Math.abs(v) < 1e-10) return '0';
      return Number(v.toFixed(6)).toString();
    });
    
    return `matrix3d(${formattedValues.join(', ')})`;
  }

  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

TransformToMatrix3DPlugin.prototype.createTransformProcessor.postcss = true;

module.exports = TransformToMatrix3DPlugin;