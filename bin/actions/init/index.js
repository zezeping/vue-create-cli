const path = require('path')
const _ = require('lodash')
const spawnSync = require('child_process').spawnSync
const fs = require('fs-extra')
const logger = require('../../utils/logger')
const inquirerStatements = require('../../utils/inquirerStatements')

module.exports = async (projectName, options, command) => {
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
    // eslint
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
      // vite.config.js
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// import eslintPlugin from 'vite-plugin-eslint'`, `import eslintPlugin from 'vite-plugin-eslint'`).replace(`// eslintPlugin({ cache: false }),`, `eslintPlugin({ cache: false }),`))
      // package.json
      let packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
      packageJson.scripts = { ...packageJson.scripts, 'lint:eslint': 'eslint --ext .js,.vue src' }
      fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
    }
    // stylelint
    if (selectedAnswers.indexOf('stylelint') !== -1) {
      logger.info(`添加stylelint相关库`)
      logger.info(`npm i stylelint stylelint-config-standard -D --registry ${registry}`)
      spawnSync(`npm i stylelint stylelint-config-standard -D --registry ${registry}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
      fs.copySync(path.join(librariesPath, 'stylelint/.stylelintrc.js'), path.join(projectPath, '.stylelintrc.js'))
      fs.copySync(path.join(librariesPath, 'stylelint/.stylelintignore'), path.join(projectPath, '.stylelintignore'))
      // package.json
      let packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
      packageJson.scripts = { ...packageJson.scripts, 'lint:stylelint': 'stylelint src/**/*.{css,scss,less,vue}' }
      fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
    }
    // git-hooks
    if (selectedAnswers.indexOf('git-hooks') !== -1) {
      logger.info(`添加git-hooks相关库`)
      // package.json
      const packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
      packageJson.scripts = {
        ...packageJson.scripts,
        'lint-staged': 'lint-staged',
        //prepare 是 NPM 操作生命周期中的一环，在执行 install 的时候会按生命周期顺序执行相应钩子：NPM7：preinstall -> install -> postinstall -> prepublish -> preprepare -> prepare -> postprepare
        'prepare': 'husky install && husky add .husky/pre-commit "npm run lint-staged"',
      }
      packageJson['lint-staged'] = packageJson['lint-staged'] || {}
      if (selectedAnswers.indexOf('eslint') !== -1) {
        packageJson['lint-staged'] = {
          ...packageJson['lint-staged'],
          'src/**/*.{js,vue}': [
            'npm run lint:eslint'
          ],
        }
      }
      if (selectedAnswers.indexOf('stylelint') !== -1) {
        packageJson['lint-staged'] = {
          ...packageJson['lint-staged'],
          'src/**/*.{css,scss,less,vue}': [
            'npm run lint:stylelint'
          ],
        }
      }
      fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
      logger.info(`npm i husky lint-staged -D --registry ${registry}`)
      spawnSync(`npm i husky lint-staged -D --registry ${registry}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
    }
    // vue-i18n
    if (selectedAnswers.indexOf('vue-i18n') !== -1) {
      logger.info(`添加vue-i18n相关库`)
      logger.info(`npm i vue-i18n@next -D --registry ${registry}`)
      spawnSync(`npm i vue-i18n@next -D --registry ${registry}`, [], {
        shell: true,
        stdio: 'inherit',
        cwd: projectPath
      })
      fs.copySync(path.join(librariesPath, 'i18n'), path.join(projectPath, 'src/i18n'))
      const i18nConfig = fs.readFileSync(path.join(projectPath, 'src/main.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/main.js'), i18nConfig.replace(`// import i18n from './i18n'`, `import i18n from './i18n'`).replace(`// app.use(i18n)`, `app.use(i18n)`))
    } else {
      const i18nConfig = fs.readFileSync(path.join(projectPath, 'src/main.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/main.js'), i18nConfig.replace(`// import i18n from './i18n'\n`, ``).replace(`// app.use(i18n)\n`, ``))
    }
    // ElementPlus
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
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import elementPlus from './elementPlus'`, `import elementPlus from './elementPlus'`).replace(`// app.use(elementPlus)`, `app.use(elementPlus)`))
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// ElementPlusResolver,`, `ElementPlusResolver,`).replace(`// ElementPlusResolver({ importStyle: false }),`, `ElementPlusResolver({ importStyle: false }),`))
    } else {
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import elementPlus from './elementPlus'\n`, ``).replace(`// app.use(elementPlus)\n`, ``))
    }
    // AntDesignVue
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
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import antDesign from './antDesign'`, `import antDesign from './antDesign'`).replace(`// app.use(antDesign)`, `app.use(antDesign)`))
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// AntDesignVueResolver,`, `AntDesignVueResolver,`).replace(`// AntDesignVueResolver({ importStyle: false }),`, `AntDesignVueResolver({ importStyle: false }),`))
    } else {
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import antDesign from './antDesign'\n`, ``).replace(`// app.use(antDesign)\n`, ``))
    }
    // Echarts
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
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import Echarts from './Echarts'`, `import Echarts from './Echarts'`).replace(`// app.use(Echarts)`, `app.use(Echarts)`))
    } else {
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import Echarts from './Echarts'\n`, ``).replace(`// app.use(Echarts)\n`, ``))
    }
  })
  
  try {
    spawnSync(`git init`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
    spawnSync(`npm i --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
    logger.info(`运行项目：\n cd ${ projectName }\n npm run dev`)
  } catch (e) {
    logger.info(`运行项目：\n cd ${ projectName }\n npm install\n npm run dev`)
  }
}