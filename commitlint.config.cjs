const typeEnum = require('./cz-customizable.config.cjs');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // feat ...
    'type-enum': [2, 'always', typeEnum.types.map((i) => i.value)],
    // 单词格式
    'type-case': [0, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', typeEnum.subjectLimit],
  },
};
