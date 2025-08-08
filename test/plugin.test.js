// test/plugin.test.js
const TransformToMatrix3DPlugin = require('../transform-to-matrix3d-webpack-plugin');

describe('TransformToMatrix3DPlugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new TransformToMatrix3DPlugin();
  });

  describe('convertToMatrix3D', () => {
    test('should convert translateX', () => {
      const result = plugin.convertToMatrix3D('translateX(100px)');
      expect(result).toContain('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 100, 0, 0, 1)');
    });

    test('should convert translateY', () => {
      const result = plugin.convertToMatrix3D('translateY(50px)');
      expect(result).toContain('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 50, 0, 1)');
    });

    test('should convert scale', () => {
      const result = plugin.convertToMatrix3D('scale(2)');
      expect(result).toContain('matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    });

    test('should convert rotate', () => {
      const result = plugin.convertToMatrix3D('rotate(90deg)');
      // 90度旋转: cos(90°) = 0, sin(90°) = 1
      expect(result).toMatch(/matrix3d\(0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1\)/);
    });

    test('should combine multiple transforms', () => {
      const result = plugin.convertToMatrix3D('translateX(100px) scale(2)');
      expect(result).toContain('matrix3d');
      // translateX(100) * scale(2) = 先移动再缩放
      // 结果矩阵应该是缩放2倍，然后X轴移动100
      expect(result).toMatch(/matrix3d\(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 100, 0, 0, 1\)/);
    });

    test('should handle invalid input gracefully', () => {
      const result = plugin.convertToMatrix3D('invalid-transform');
      expect(result).toBeNull();
    });
  });

  describe('matrix operations', () => {
    test('should create identity matrix', () => {
      const matrix = plugin.createIdentityMatrix();
      expect(matrix).toEqual([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]);
    });

    test('should multiply matrices correctly', () => {
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
      expect(result).toEqual([
        [2, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 1, 0],
        [20, 40, 0, 1]
      ]);
    });
  });

  describe('degToRad', () => {
    test('should convert degrees to radians', () => {
      expect(plugin.degToRad(0)).toBe(0);
      expect(plugin.degToRad(90)).toBeCloseTo(Math.PI / 2);
      expect(plugin.degToRad(180)).toBeCloseTo(Math.PI);
      expect(plugin.degToRad(360)).toBeCloseTo(2 * Math.PI);
    });
  });

  describe('matrixToCSS', () => {
    test('should format matrix as CSS string', () => {
      const matrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [100, 200, 0, 1]
      ];
      const result = plugin.matrixToCSS(matrix);
      expect(result).toBe('matrix3d(1, 0, 0, 100, 0, 1, 0, 200, 0, 0, 1, 0, 0, 0, 0, 1)');
    });

    test('should handle small numbers correctly', () => {
      const matrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [1e-12, 0, 0, 1]
      ];
      const result = plugin.matrixToCSS(matrix);
      expect(result).toBe('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    });
  });

  describe('transform matrix generators', () => {
    test('should generate correct translateX matrix', () => {
      const matrix = plugin.translateXMatrix(100);
      expect(matrix).toEqual([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [100, 0, 0, 1]
      ]);
    });

    test('should generate correct scale matrix', () => {
      const matrix = plugin.scaleMatrix(2, 3);
      expect(matrix).toEqual([
        [2, 0, 0, 0],
        [0, 3, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]);
    });
  });
});

// Mock webpack compilation for integration tests
describe('Webpack Integration', () => {
  test('should create plugin instance with default options', () => {
    const plugin = new TransformToMatrix3DPlugin();
    expect(plugin.options.enabled).toBe(true);
    expect(plugin.options.keepOriginal).toBe(false);
    expect(plugin.options.test).toEqual(/\.css$/);
  });

  test('should accept custom options', () => {
    const options = {
      enabled: false,
      keepOriginal: true,
      test: /\.scss$/
    };
    const plugin = new TransformToMatrix3DPlugin(options);
    expect(plugin.options.enabled).toBe(false);
    expect(plugin.options.keepOriginal).toBe(true);
    expect(plugin.options.test).toEqual(/\.scss$/);
  });
});