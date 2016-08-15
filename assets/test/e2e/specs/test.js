// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var config = require('../../../build/config')
module.exports = {
  'default e2e tests': function (browser) {
    browser
    .url('http://localhost:'+config.dev.port)
      .waitForElementVisible('#main', 5000)
      .assert.elementPresent('.logo')
      .assert.containsText('.logo', '人员管理系统')
      .assert.elementCount('div', 9)
      .end()
  }
}
