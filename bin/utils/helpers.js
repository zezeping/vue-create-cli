const spawnSync = require('child_process').spawnSync
const _ = require('lodash')
const logger = require('./logger')
module.exports = {
  spawnSync(commandText) {
    logger.info(commandText)
    spawnSync(...arguments)
  },
  removeContainsTextLines(data, containsTexts) {
    return data.split('\n').filter((lineValue, idx) => {
      let isContains = false
      for (const containsText of containsTexts) {
        if (_.includes(lineValue, containsText)) {
          isContains = true
        }
      }
      return !isContains
    }).join('\n')
  }
}