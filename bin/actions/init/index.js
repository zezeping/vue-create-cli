const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const logger = require('../../utils/logger')
const helpers = require('../../utils/helpers')
const inquirerStatements = require('../../utils/inquirerStatements')

module.exports = async (projectName, options, command) => {
  const { registry } = options
  console.log(projectName, options)
  
  const cwdPath = process.cwd()
  const projectPath = path.resolve(cwdPath, projectName)
  const templatePath = path.resolve(__dirname, '../../../template')
  const librariesPath = path.resolve(__dirname, '../../../libraries')
  
  // 创建项目
  helpers.spawnSync(`npm init vite@latest ${projectName} -- --template vue`, [], {shell: true, stdio: 'inherit'})
  
  try {
    helpers.spawnSync(`git init`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
  } catch (e) {}
  
  logger.info(`改造&丰富 基础结构`)
  fs.copySync(path.join(templatePath), path.join(projectPath))
  // package.json
  let packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
  packageJson = _.merge(packageJson, {
    private: true,
    main: 'index.js',
    scripts: {
      svgo: 'svgo -f src/assets/images/svg-icons'
    }
  })
  fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
  /*
  * 安装插件 axios vue-router@4 vuex@next vuex-persistedstate
  */
  helpers.spawnSync(`npm install && npm i normalize.css axios nprogress vue-router@4 vuex@next vuex-persistedstate ui-define -S --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
  // dev插件
  helpers.spawnSync(`npm install && npm i sass less unplugin-vue-components unplugin-icons @vitejs/plugin-vue-jsx rollup-plugin-visualizer -D --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
  // ui库
  await inquirerStatements.addUiLibraries().then(async selectedAnswers => {
    console.error(selectedAnswers)
    // eslint
    if (selectedAnswers.indexOf('eslint') !== -1) {
      logger.info(`添加eslint相关库`)
      helpers.spawnSync(`npm i eslint@7 eslint-plugin-vue vite-plugin-eslint eslint-plugin-jsx-a11y -D --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      
      fs.copySync(path.join(librariesPath, 'eslint/.eslintrc.js'), path.join(projectPath, '.eslintrc.js'))
      fs.copySync(path.join(librariesPath, 'eslint/.eslintignore'), path.join(projectPath, '.eslintignore'))
      // vite.config.js
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// import eslintPlugin from 'vite-plugin-eslint'`, `import eslintPlugin from 'vite-plugin-eslint'`).replace(`// eslintPlugin({ cache: false }),`, `eslintPlugin({ cache: false }),`))
      // package.json
      let packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
      packageJson.scripts = { ...packageJson.scripts, 'lint:eslint': 'eslint --ext .js,.vue src/' }
      fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
    } else {
      // vite.config.js
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), helpers.removeContainsTextLines(viteConfig, [
        `// import eslintPlugin from 'vite-plugin-eslint'`,
        `// eslintPlugin({ cache: false }),`
      ]))
    }
    // stylelint
    if (selectedAnswers.indexOf('stylelint') !== -1) {
      logger.info(`添加stylelint相关库`)
      helpers.spawnSync(`npm i stylelint@13 stylelint-config-standard@22 @amatlash/vite-plugin-stylelint -D --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      
      fs.copySync(path.join(librariesPath, 'stylelint/.stylelintrc.js'), path.join(projectPath, '.stylelintrc.js'))
      fs.copySync(path.join(librariesPath, 'stylelint/.stylelintignore'), path.join(projectPath, '.stylelintignore'))
      // vite.config.js
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// import stylelintPlugin from '@amatlash/vite-plugin-stylelint'`, `import stylelintPlugin from '@amatlash/vite-plugin-stylelint'`).replace(`// stylelintPlugin(),`, `stylelintPlugin(),`))
      // package.json
      let packageJson = fs.readJsonSync(path.resolve(projectPath, 'package.json'))
      packageJson.scripts = { ...packageJson.scripts, 'lint:stylelint': 'stylelint src/**/*.{css,scss,less,vue}' }
      fs.writeJsonSync(path.resolve(projectPath, 'package.json'), packageJson, {spaces: 2})
    } else {
      // vite.config.js
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), helpers.removeContainsTextLines(viteConfig, [
        `// import stylelintPlugin from '@amatlash/vite-plugin-stylelint'`,
        `// stylelintPlugin(),`
      ]))
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
        //'prepare': 'husky install && husky add .husky/pre-commit "npm run lint-staged"',
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
      helpers.spawnSync(`npm i husky lint-staged -D --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      helpers.spawnSync(`npx husky install && husky add .husky/pre-commit "npm run lint-staged"`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
    }
    // vue-i18n
    if (selectedAnswers.indexOf('vue-i18n') !== -1) {
      logger.info(`添加vue-i18n相关库`)
      helpers.spawnSync(`npm i vue-i18n@next -S --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      
      fs.copySync(path.join(librariesPath, 'i18n'), path.join(projectPath, 'src/i18n'))
      
      const i18nConfig = fs.readFileSync(path.join(projectPath, 'src/main.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/main.js'), i18nConfig.replace(`// import i18n from './i18n'`, `import i18n from './i18n'`).replace(`// app.use(i18n)`, `app.use(i18n)`))
    } else {
      const i18nConfig = fs.readFileSync(path.join(projectPath, 'src/main.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/main.js'), helpers.removeContainsTextLines(i18nConfig, [
        `// import i18n from './i18n'`,
        `// app.use(i18n)`
      ]))
    }
    // autoprefixer
    if (selectedAnswers.indexOf('autoprefixer') !== -1) {
      logger.info(`添加autoprefixer相关库`)
      helpers.spawnSync(`npm i autoprefixer -D --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
  
      const postcssConfig = fs.readFileSync(path.join(projectPath, 'postcss.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'postcss.config.js'), postcssConfig.replace(`plugins: {`, `plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'last 2 versions',
        'iOS >= 8'
      ]
    },`))
    }
    // ElementPlus
    if (selectedAnswers.indexOf('ElementPlus') !== -1) {
      logger.info(`添加ElementPlus相关库`)
      helpers.spawnSync(`npm i element-plus -S --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      
      fs.ensureDirSync(path.join(projectPath, 'src/components/shared/elementPlus'))
      fs.copySync(path.join(librariesPath, 'elementPlus/components'), path.join(projectPath, 'src/components/shared/elementPlus'))
      fs.copySync(path.join(librariesPath, 'elementPlus/hooks'), path.join(projectPath, 'src/utils/hooks'))
      
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import elementPlus from './elementPlus'`, `import elementPlus from './elementPlus'`).replace(`// app.use(elementPlus)`, `app.use(elementPlus)`))
      
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// ElementPlusResolver,`, `ElementPlusResolver,`).replace(`// ElementPlusResolver({ importStyle: false }),`, `ElementPlusResolver({ importStyle: false }),`))
    } else {
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), helpers.removeContainsTextLines(uiConfig, [
        `// import elementPlus from './elementPlus'`,
        `// app.use(elementPlus)`
      ]))
    }
    // AntDesignVue
    if (selectedAnswers.indexOf('AntDesignVue') !== -1) {
      logger.info(`添加AntDesignVue相关库`)
      helpers.spawnSync(`npm i ant-design-vue@next @ant-design/icons-vue -S --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      
      fs.ensureDirSync(path.join(projectPath, 'src/components/shared/antDesign'))
      fs.copySync(path.join(librariesPath, 'antDesign/components'), path.join(projectPath, 'src/components/shared/antDesign'))
      fs.copySync(path.join(librariesPath, 'antDesign/hooks'), path.join(projectPath, 'src/utils/hooks'))
      
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import antDesign from './antDesign'`, `import antDesign from './antDesign'`).replace(`// app.use(antDesign)`, `app.use(antDesign)`))
      
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// AntDesignVueResolver,`, `AntDesignVueResolver,`).replace(`// AntDesignVueResolver({ importStyle: false, resolveIcons: true }),`, `AntDesignVueResolver({ importStyle: false, resolveIcons: true }),`))
    } else {
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), helpers.removeContainsTextLines(uiConfig, [
        `// import antDesign from './antDesign'`,
        `// app.use(antDesign)`
      ]))
    }
    // Vant
    if (selectedAnswers.indexOf('Vant') !== -1) {
      logger.info(`添加Vant相关库`)
      helpers.spawnSync(`npm i vant@next lib-flexible -S --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      helpers.spawnSync(`npm i postcss-pxtorem -D --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      
      fs.ensureDirSync(path.join(projectPath, 'src/components/shared/vant'))
      fs.copySync(path.join(librariesPath, 'vant'), path.join(projectPath, 'src/components/shared/vant'))
  
      const appConfig = fs.readFileSync(path.join(projectPath, 'src/main.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/main.js'), appConfig.replace(`// import 'lib-flexible'`, `import 'lib-flexible'`))
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import vant from './vant'`, `import vant from './vant'`).replace(`// app.use(vant)`, `app.use(vant)`))
      
      const viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig.replace(`// VantResolver,`, `VantResolver,`).replace(`// VantResolver({ importStyle: false }),`, `VantResolver({ importStyle: false }),`))
      
      const postcssConfig = fs.readFileSync(path.join(projectPath, 'postcss.config.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'postcss.config.js'), postcssConfig.replace(`plugins: {`, `plugins: {
    // postcss-pxtorem 插件的版本需要 >= 5.0.0
    'postcss-pxtorem': {
      rootValue({ file }) {
        // 设计稿的尺寸不是 375，而是 750 或其他大小，可以将 rootValue 配置调整为:
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'], // 属性的选择器，*表示通用
      selectorBlackList: ['.px-'], //   忽略的选择器   .ig-  表示 .ig- 开头的都不会转换
    },`))
    } else {
      const appConfig = fs.readFileSync(path.join(projectPath, 'src/main.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/main.js'), helpers.removeContainsTextLines(appConfig, [
        `// import 'lib-flexible`,
      ]))
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), helpers.removeContainsTextLines(uiConfig, [
        `// import vant from './vant'`,
        `// app.use(vant)`
      ]))
    }
    // Echarts
    if (selectedAnswers.indexOf('Echarts') !== -1) {
      logger.info(`添加Echarts相关库`)
      helpers.spawnSync(`npm i echarts -S --registry ${registry}`, [], { shell: true, stdio: 'inherit', cwd: projectPath })
      
      fs.ensureDirSync(path.join(projectPath, 'src/components/shared/Echarts'))
      fs.copySync(path.join(librariesPath, 'Echarts'), path.join(projectPath, 'src/components/shared/Echarts'))
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), uiConfig.replace(`// import Echarts from './Echarts'`, `import Echarts from './Echarts'`).replace(`// app.use(Echarts)`, `app.use(Echarts)`))
    } else {
      const uiConfig = fs.readFileSync(path.join(projectPath, 'src/components/shared/index.js'), 'utf-8')
      fs.writeFileSync(path.join(projectPath, 'src/components/shared/index.js'), helpers.removeContainsTextLines(uiConfig, [
        `// import Echarts from './Echarts'`,
        `// app.use(Echarts)`
      ]))
    }
  })
  logger.info(`运行项目：\n cd ${ projectName }\n npm install\n npm run dev`)
}