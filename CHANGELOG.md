# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-08

### Fixed
- 🐛 Fixed matrix multiplication implementation
- 🐛 Corrected translation matrix structure (moved translation values to bottom row)
- 🐛 Fixed matrix-to-CSS conversion format
- ✅ Updated test cases to match corrected calculations

### Added
- 🧪 Added quick test script for manual verification
- 📚 Added more comprehensive test coverage for matrix generators

## [1.0.0] - 2025-08-08

### Added
- 🎉 Initial release of Transform to Matrix3D Webpack Plugin
- ⚡ Support for all standard CSS transform functions
- 🔧 Configurable options (enabled, keepOriginal, test)
- 📦 Complete npm package setup with dependencies
- 📝 Comprehensive documentation and examples
- ✅ Full unit test coverage
- 🚀 CI/CD pipeline with GitHub Actions
- 📄 MIT license

### Features
- **Transform Functions Supported:**
  - `translateX`, `translateY`, `translateZ`
  - `translate`, `translate3d` 
  - `scaleX`, `scaleY`, `scaleZ`
  - `scale`, `scale3d`
  - `rotateX`, `rotateY`, `rotateZ`, `rotate`
  - `skewX`, `skewY`
  - `matrix`, `matrix3d`

- **Performance Benefits:**
  - GPU hardware acceleration
  - Reduced reflow and repaint
  - Cross-browser consistency
  - Precise mathematical control

- **Developer Experience:**
  - Easy Webpack integration
  - Flexible configuration options
  - Error handling and graceful fallbacks
  - TypeScript-friendly API