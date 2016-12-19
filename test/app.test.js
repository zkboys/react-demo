const request = require('supertest');
const app = require('../app');
const config = require('../config');
const support = require('./support/support');

describe('test/app.test.js', function () {
    it('should / status 200', function (done) {
        request(app).get('/')
            .set('Cookie', support.adminUserCookie)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.text.should.containEql('人员管理系统');
                done();
            });
    });
});
