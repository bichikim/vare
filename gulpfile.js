/* eslint-disable @typescript-eslint/no-var-requires */
const {parallel} = require('gulp')
const execa = require('gulp-execa')

exports.devTsc = execa.task('ttsc --outDir ./dist -p tsconfig.bundle.json')

exports.testJs = execa.task('')
