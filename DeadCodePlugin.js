const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

class DeadCodePlugin {
  apply(compiler) {
    console.log(compiler);
    compiler.hooks.emit.tapAsync('DeadCodePlugin', (compilation, callback) => {
      // 遍历所有模块
      for (const module of Object.values(compilation.modules)) {
        // 只检查 JavaScript 模块
        if (!module._source || !module._source._value) {
          continue;
        }
        const ast = esprima.parse(module._source._value);

        const referencedIdentifiers = new Set();

        // 使用 estraverse 遍历 AST
        estraverse.traverse(ast, {
          enter(node, parent) {
            // 检查变量声明
            if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
              referencedIdentifiers.add(node.id.name);
            }
            // 检查导入语句
            if (node.type === 'ImportDeclaration') {
              for (const specifier of node.specifiers) {
                if (specifier.type === 'ImportSpecifier') {
                  referencedIdentifiers.add(specifier.local.name);
                }
              }
            }
          }
        });

        // 使用 estraverse 遍历 AST，删除未引用的变量声明和无用的导入语句
        estraverse.replace(ast, {
          enter(node, parent) {
            // 删除未引用的变量声明
            if (node.type === 'VariableDeclaration') {
              node.declarations = node.declarations.filter(declaration => referencedIdentifiers.has(declaration.id.name));
              if (node.declarations.length === 0) {
                this.remove();
              }
            }
            // 删除无用的导入语句
            if (node.type === 'ImportDeclaration') {
              const unusedSpecifiers = node.specifiers.filter(specifier => !referencedIdentifiers.has(specifier.local.name));
              for (const specifier of unusedSpecifiers) {
                const index = node.specifiers.indexOf(specifier);
                node.specifiers.splice(index, 1);
              }
              if (node.specifiers.length === 0) {
                this.remove();
              }
            }
          }
        });

        // 重新生成修改后的代码
        const code = escodegen.generate(ast);

        // 更新模块的源码
        module._source._value = code;
      }

      callback();
    });
  }
}

module.exports = DeadCodePlugin;
