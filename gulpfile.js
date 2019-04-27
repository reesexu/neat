const path = require('path')
const gulp = require('gulp')
const { series, parallel } = gulp
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const combiner = require('stream-combiner2')
const del = require('del')
const axios = require('axios')
const inject = require('gulp-inject-string')
const jdists = require('gulp-jdists')
const devToolPort = 20033 // 微信开发工具服务端端口
const host = 'http://127.0.0.1'
const requestUrl = `${host}:${devToolPort}`
const src = './src' // 源码目录
const dist = './dist' // 构建目录
const regeneratorRuntimeFolderName = 'regenerator-runtime'
const miniprogramFolderName = 'miniprogram'
const miniprogramDistPath = `${dist}/${miniprogramFolderName}`
const miniprogramSrcPath = `${src}/${miniprogramFolderName}`
const miniprogramNpmFolderPath = `${miniprogramDistPath}/miniprogram_npm`
const projectpath = path.resolve(dist)
const isDev = process.env.NODE_ENV === 'development'
const isAutoPreview = process.env.AUTO_PREVIEW === 'auto'

// 处理wxml
const wxml = () => gulp
  .src(`${src}/**/*.wxml`)
  .pipe(gulp.dest(dist))

// 处理wxss
const wxss = () => {
  const combined = combiner.obj([
    gulp.src(`${src}/**/*.{wxss,scss}`),
    sass().on('error', sass.logError),
    rename((path) => (path.extname = '.wxss')),
    gulp.dest(dist)
  ])
  combined.on('error', console.error.bind(console))
  return combined
}

// 处理js
const js = () => gulp
  .src(`${src}/**/*.js`)
  .pipe(jdists({ trigger: isDev ? 'dev' : 'prod' }))
  .pipe(gulp.dest(`${dist}`))

// 将regeneratorRuntime的源码移动至小程序npm文件夹，便于引入
const moveRunTime = () => gulp.src(`${miniprogramSrcPath}/lib/${regeneratorRuntimeFolderName}/*.js`)
  .pipe(gulp.dest(`${miniprogramNpmFolderPath}/${regeneratorRuntimeFolderName}`))

// 给指定的js文件头部注入引入regeneratorRuntime的语句，因为需要使用到async语法的都需要引入该文件
const injectRuntime = () => gulp.src([`${miniprogramDistPath}/app.js`, `${miniprogramDistPath}/{components,models,pages,app.js}/**/*.js`])
  .pipe(inject.prepend(`import regeneratorRuntime from '${regeneratorRuntimeFolderName}'\n`))
  .pipe(gulp.dest(miniprogramDistPath))

// 通过http调用小程序开发工具的构建npm接口构建npm，不用每次安装都手动点击安装
const npm = async () => await axios.get(`${requestUrl}/buildnpm`, { params: { projectpath } })

// 自动预览
const autoPreview = async () => await axios.get(`${requestUrl}/autopreview`, { params: { projectpath } })

// 处理json
const json = () => gulp.src(`${src}/**/*.json`).pipe(gulp.dest(dist))

// 处理图片资源
const images = () => gulp.src(`${src}/**/images/**`).pipe(gulp.dest(`${dist}`))

// 处理wxs
const wxs = () => gulp.src(`${src}/**/*.wxs`).pipe(gulp.dest(dist))

// 清空构建目录
const clean = () => del([`${dist}/**`])

// 组合的处理js任务，先移动js，然后构建npm，将regeneratorRuntime移动至npm目录，然后给需要的js文件自动注入引入regeneratorRuntime语句
const jsTasks = series(js, parallel(series(npm, moveRunTime), injectRuntime))

const withAutoPreview = task => isAutoPreview ? series(task, autoPreview) : series(task)

// 监听文件变化
const watch = () => {
  [wxml, wxss, json, wxs].forEach((v) => {
    gulp.watch(`${src}/**/*.${v.name}`, withAutoPreview(v))
  })
  gulp.watch(`${src}/**/*.js`, withAutoPreview(jsTasks))
  gulp.watch(`${src}/**/images/**`, withAutoPreview(images))
  gulp.watch(`${src}/**/*.scss`, withAutoPreview(wxss))
}


const baseTasks = parallel(json, images, wxml, wxss, jsTasks, wxs)

exports.npm = npm
exports.js = js
exports.clean = clean
exports.dev = series(clean, baseTasks, watch)
exports.build = series(clean, baseTasks)