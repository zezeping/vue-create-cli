const inquirer = require('inquirer')

module.exports = {
  addUiLibraries: () => {
    return inquirer.prompt([
      {
        type: 'checkbox',
        message: '可快速集成的代码工具集',
        name: 'tools',
        choices: [
          new inquirer.Separator('代码检测'), // 分割线
          { name: 'eslint', checked: false, },
          { name: 'stylelint', checked: false, },
          new inquirer.Separator('git-hooks'), // 分割线
          { name: 'git-hooks', checked: false, },
          new inquirer.Separator('其他'), // 分割线
          { name: 'vue-i18n', checked: false, },
          //{ name: 'jest', checked: false, },
        ],
        validate (answer) {
          //if (answer.length < 1) {
          //  return 'You must choose at least one topping.'
          //}
          return true
        },
      }, {
        type: 'checkbox',
        message: '可快速集成的ui库',
        name: 'uis',
        choices: [
          new inquirer.Separator(' = PC = '), // 分割线
          { name: 'ElementPlus', checked: false, },
          { name: 'AntDesignVue', checked: false, },
          //new inquirer.Separator(' = WAP = '), // 分割线
          //{ name: 'Vant', },
        ],
        validate (answer) {
          //if (answer.length < 1) {
          //  return 'You must choose at least one topping.'
          //}
          return true
        },
      }, {
        type: 'checkbox',
        message: '可快速集成的其他库',
        name: 'others',
        choices: [
          { name: 'Echarts', checked: false, },
        ],
        validate (answer) {
          return true
        },
      },
    ]).then((answers) => {
      const { tools, uis, others } = answers
      return [...tools, ...uis, ...others]
    })
  }
}