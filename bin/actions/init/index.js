const path = require('path')
const _ = require('lodash')
const spawnSync = require('child_process').spawnSync
const fs = require('fs-extra')
const logger = require('../../utils/logger')
const inquirerStatements = require('../../utils/inquirerStatements')

module.exports = function (projectName) {
  console.log(projectName)
  
  const cwdPath = process.cwd()
  const projectPath = path.resolve(cwdPath, projectName)
  const templatePath = path.resolve(__dirname, '../../../template')
  const librariesPath = path.resolve(__dirname, '../../../libraries')
  
  // 创建项目
  logger.bgInfo(`npm init vite@latest ${projectName} -- --template vue`)
  spawnSync(`npm init vite@latest ${projectName} -- --template vue`, [], {shell: true, stdio: 'inherit'})
  
  logger.bgInfo(`改造&丰富 基础结构`)
  fs.copySync(path.join(templatePath), path.join(projectPath))
  // package.json
  let packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
  packageJson = _.merge(packageJson, {
    private: true,
    main: 'index.js',
    scripts: {
      svgo: 'svgo -f src/components/ext/SvgIcon/svg'
    }
  })
  fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
  /*
  * 安装插件 axios vue-router@4 vuex@next vuex-persistedstate
  */
  logger.bgInfo(`npm install && npm i normalize.css axios vue-router@4 vuex@next vuex-persistedstate -S --registry https://registry.npm.taobao.org`)
  spawnSync(`npm install && npm i normalize.css axios vue-router@4 vuex@next vuex-persistedstate -S --registry https://registry.npm.taobao.org`, [], {
    shell: true,
    stdio: 'inherit',
    cwd: projectPath
  })
  // dev插件
  logger.bgInfo(`npm i sass vite-svg-loader -D --registry https://registry.npm.taobao.org`)
  spawnSync(`npm install && npm i sass vite-svg-loader -D --registry https://registry.npm.taobao.org`, [], {
    shell: true,
    stdio: 'inherit',
    cwd: projectPath
  })
  // ui库
  inquirerStatements.addUiLibraries().then(selectedAnswers => {
    console.error(selectedAnswers)
    if (selectedAnswers.indexOf('ElementPlus') !== -1) {
      logger.bgInfo(`添加ElementPlus相关库`)
      logger.bgInfo(`npm i element-plus -S --registry https://registry.npm.taobao.org`)
      spawnSync(`npm i element-plus -S --registry https://registry.npm.taobao.org`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
      fs.ensureDirSync(path.join(projectPath, 'src/components/ext/element-plus'))
      fs.copySync(path.join(librariesPath, 'element-plus/components'), path.join(projectPath, 'src/components/ext/element-plus'))
    }
  })
}