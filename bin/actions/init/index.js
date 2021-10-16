const path = require('path')
const _ = require('lodash')
const spawnSync = require('child_process').spawnSync
const fs = require('fs-extra')
const logger = require('../../utils/logger')
const inquirerStatements = require('../../utils/inquirerStatements')

module.exports = async function (projectName, options, command) {
  const { registry } = options
  console.log(projectName, options)
  
  const cwdPath = process.cwd()
  const projectPath = path.resolve(cwdPath, projectName)
  const templatePath = path.resolve(__dirname, '../../../template')
  const librariesPath = path.resolve(__dirname, '../../../libraries')
  
  // 创建项目
  logger.info(`npm init vite@latest ${projectName} -- --template vue`)
  spawnSync(`npm init vite@latest ${projectName} -- --template vue`, [], {shell: true, stdio: 'inherit'})
  
  logger.info(`改造&丰富 基础结构`)
  fs.copySync(path.join(templatePath), path.join(projectPath))
  // package.json
  let packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
  packageJson = _.merge(packageJson, {
    private: true,
    main: 'index.js',
    scripts: {
      svgo: 'svgo -f src/ext/shared/SvgIcon/svg'
    }
  })
  fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
  /*
  * 安装插件 axios vue-router@4 vuex@next vuex-persistedstate
  */
  logger.info(`npm install && npm i normalize.css axios nprogress vue-router@4 vuex@next vuex-persistedstate -S --registry ${registry}`)
  spawnSync(`npm install && npm i normalize.css axios nprogress vue-router@4 vuex@next vuex-persistedstate -S --registry ${registry}`, [], {
    shell: true,
    stdio: 'inherit',
    cwd: projectPath
  })
  // dev插件
  logger.info(`npm i sass vite-svg-loader unplugin-vue-components @vitejs/plugin-vue-jsx -D --registry ${registry}`)
  spawnSync(`npm install && npm i sass vite-svg-loader unplugin-vue-components @vitejs/plugin-vue-jsx -D --registry ${registry}`, [], {
    shell: true,
    stdio: 'inherit',
    cwd: projectPath
  })
  // ui库
  await inquirerStatements.addUiLibraries().then(selectedAnswers => {
    console.error(selectedAnswers)
    if (selectedAnswers.indexOf('eslint') !== -1) {
      logger.info(`添加eslint相关库`)
      logger.info(`npm i eslint@7 eslint-plugin-vue vite-plugin-eslint -D --registry ${registry}`)
      spawnSync(`npm i eslint@7 eslint-plugin-vue vite-plugin-eslint -D --registry ${registry}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
      fs.copySync(path.join(librariesPath, 'eslint/.eslintrc.js'), path.join(projectPath, '.eslintrc.js'))
      fs.copySync(path.join(librariesPath, 'eslint/.eslintignore'), path.join(projectPath, '.eslintignore'))
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// import eslintPlugin from 'vite-plugin-eslint'`, `import eslintPlugin from 'vite-plugin-eslint'`).replace(`// eslintPlugin(),`, `eslintPlugin(),`))
    }
    if (selectedAnswers.indexOf('ElementPlus') !== -1) {
      logger.info(`添加ElementPlus相关库`)
      logger.info(`npm i element-plus -S --registry ${registry}`)
      spawnSync(`npm i element-plus -S --registry ${registry}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
      fs.ensureDirSync(path.join(projectPath, 'src/components/shared/elementPlus'))
      fs.copySync(path.join(librariesPath, 'elementPlus'), path.join(projectPath, 'src/components/shared/elementPlus'))
    }
    if (selectedAnswers.indexOf('AntDesignVue') !== -1) {
      logger.info(`添加AntDesignVue相关库`)
      logger.info(`npm i ant-design-vue@next -S --registry ${registry}`)
      spawnSync(`npm i ant-design-vue@next -S --registry ${registry}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
      fs.ensureDirSync(path.join(projectPath, 'src/components/shared/antDesign'))
      fs.copySync(path.join(librariesPath, 'antDesign'), path.join(projectPath, 'src/components/shared/antDesign'))
    }
    if (selectedAnswers.indexOf('Echarts') !== -1) {
      logger.info(`添加Echarts相关库`)
      logger.info(`npm i echarts -S --registry ${registry}`)
      spawnSync(`npm i echarts -S --registry ${registry}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
      fs.ensureDirSync(path.join(projectPath, 'src/components/shared/Echarts'))
      fs.copySync(path.join(librariesPath, 'Echarts'), path.join(projectPath, 'src/components/shared/Echarts'))
    }
  })
}