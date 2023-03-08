module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    wx: 'readonly',
    uni: 'readonly',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.vue'], // ***2.解决引入无后缀报错问题
      },
    },
  },

  // "off"或者0    //关闭规则关闭
  // "warn"或者1    //在打开的规则作为警告（不影响退出代码）
  // "error"或者2    //把规则作为一个错误（退出代码触发时为1）
  rules: {
    'vue/html-button-has-type': 0, // 按钮属性校验
    'arrow-parens': 1, // 箭头函数用小括号括起来
    'vue/multi-word-component-names': 'off', // 关闭vue文件名校验
    'no-shadow': 2, // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    'no-unused-vars': 'warn', // 只警告变量未使用
    'import/extensions': ['error', 'never'],
    quotes: [1, 'single'], // 引号类型 `` "" ''
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 参数
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'e', // for e.returnvalue
          'ctx', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          'state', // for vuex state
          'config',
        ],
      },
    ],

    'arrow-body-style': ['warn', 'as-needed'], // 只有一个返回值禁止箭头函数大括号
  },
};
