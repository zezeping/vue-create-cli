module.exports = {
  processors: [],
  plugins: [],
  extends: 'stylelint-config-standard', // 这是官方推荐的方式
  rules: {
    'no-missing-end-of-source-newline': null,
    'selector-list-comma-newline-after': null,
    'declaration-block-semicolon-newline-after': null,
    'at-rule-no-unknown': [true, {
      'ignoreAtRules': ['function', 'if', 'each', 'include', 'mixin', 'return', 'error'],
    },
    ],
    'declaration-block-single-line-max-declarations': 10,
    'selector-pseudo-element-no-unknown': null,
    'block-no-empty': null,
    'no-empty-source': null,
    indentation: 2,
  },
}