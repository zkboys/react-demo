// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

// require all test files (files that ends with .spec.js)
var testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except Index.jsx for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
var srcContext = require.context('../../src', true, /^\.\/(?!App(\.jsx)?$)/)
srcContext.keys().forEach(srcContext)

/*
*
*
* =============================== Coverage summary ===============================
 Statements   : 68.42% ( 13/19 )
 Branches     : 100% ( 4/4 ), 1 ignored
 Functions    : 28.57% ( 2/7 )
 Lines        : 50% ( 6/12 )
 ================================================================================

 * */