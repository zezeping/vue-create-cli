const path = require('path')
const spawnSync = require('child_process').spawnSync
const fs = require('fs-extra')
const logger = require('../../utils/logger')

module.exports = function(projectName) {
    console.log(projectName)

    const cwdPath = process.cwd()
    const projectPath = path.resolve(cwdPath, projectName)
    const templatePath = path.resolve(__dirname, '../../../template')

    // 创建项目
    logger.bgInfo(`npm init vite@latest ${projectName} -- --template vue`)
    spawnSync(`npm init vite@latest ${projectName} -- --template vue`, [], { shell: true, stdio: 'inherit' })

    fs.copySync(path.join(templatePath, 'assets'), path.join(projectPath, 'src/assets'))
    fs.copySync(path.join(templatePath, 'utils'), path.join(projectPath, 'src/utils'))
    fs.copySync(path.join(templatePath, 'store'), path.join(projectPath, 'src/store'))
    fs.copySync(path.join(templatePath, 'api'), path.join(projectPath, 'src/api'))
    fs.copySync(path.join(templatePath, 'router'), path.join(projectPath, 'src/router'))
    fs.copySync(path.join(templatePath, 'views'), path.join(projectPath, 'src/views'))
    fs.copySync(path.join(templatePath, 'main.js'), path.join(projectPath, 'src/main.js'))
    fs.copySync(path.join(templatePath, 'App.vue'), path.join(projectPath, 'src/App.vue'))
    fs.copySync(path.join(templatePath, 'vite.config.js'), path.join(projectPath, 'vite.config.js'))

    /*
    * 安装插件 axios vue-router@4 vuex@next vuex-persistedstate
    */
    logger.bgInfo(`npm install && npm i axios vue-router@4 vuex@next vuex-persistedstate -S --registry https://registry.npm.taobao.org`)
    spawnSync(`npm install && npm i axios vue-router@4 vuex@next vuex-persistedstate -S --registry https://registry.npm.taobao.org`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
    // dev插件
    logger.bgInfo(`npm i sass -D --registry https://registry.npm.taobao.org`)
    spawnSync(`npm install && npm i sass -D --registry https://registry.npm.taobao.org`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
}