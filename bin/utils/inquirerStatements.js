const inquirer = require('inquirer')

module.exports = {
  addUiLibraries: () => {
    return inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select toppings',
        name: 'toppings',
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
      },
    ]).then((answers) => {
      const { toppings: selectedAnswers } = answers
      return selectedAnswers
    })
  }
}