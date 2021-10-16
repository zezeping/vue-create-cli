module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  rules: {
    /*
     0 或 'off'：  关闭规则。
     1 或 'warn'： 打开规则，并且作为一个警告，字体颜色为黄色（并不会导致检查不通过）。
     2 或 'error'：打开规则，并且作为一个错误 ，色体颜色为红色(退出码为1，检查不通过)。
     */
    'no-console': 'off',
    'quotes': ['error', 'single'], // 单引号
    'semi': ['warn', 'never'], // 禁止分号
    // 'indent': ['warn', 2], // 缩进对齐, 2个空格
    'no-unused-vars': [
      'error', {
        'vars': 'all',
        'args': 'after-used',
        'ignoreRestSiblings': false,
        'argsIgnorePattern': '^_',
      },
    ],
    // vue
    'vue/html-self-closing': 'off',
    'vue/html-indent': 'off',
    'vue/require-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': [
      'warn', {
        'singleline': {
          max: 10,
          allowFirstLine: true,
        },
        'multiline': {
          max: 5,
          allowFirstLine: true,
        },
      },
    ],
  },
}