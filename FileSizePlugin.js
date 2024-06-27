const fs = require('fs');

class FileSizePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('FileSizePlugin', compilation => {
      const outputPath = compiler.options.output.path;
      const stats = compilation.getStats().toJson({ all: false, assets: true });

      const files = stats.assets.map(asset => ({
        name: asset.name,
        size: asset.size
      }));

      const outputFile = `${outputPath}/file-sizes.json`;

      fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));

      console.log('File sizes saved to', outputFile);
    });
  }
}

module.exports = FileSizePlugin;
