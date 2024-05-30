const propertiesOrder = require('./.idiomatic.cjs');
module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'order/order': ['custom-properties', 'declarations', 'at-variables', 'rules', 'at-rules', 'less-mixins'],
    'order/properties-order': propertiesOrder,
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      extends: ['stylelint-config-standard-scss'],
    },
    // 若项目中存在less文件，添加以下配置
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
};
