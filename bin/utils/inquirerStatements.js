const inquirer = require('inquirer')

module.exports = {
  addUiLibraries: () => {
    return inquirer.prompt([
      {
        type: 'checkbox',
        message: '可快速集成的ui库',
        name: 'uis',
        choices: [
          new inquirer.Separator(' = PC = '), // 分割线
          { name: 'ElementPlus', checked: true, },
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
          { name: 'Echarts', checked: true, },
        ],
        validate (answer) {
          return true
        },
      },
    ]).then((answers) => {
      const { uis, others } = answers
      return [...uis, ...others]
    })
  }
}