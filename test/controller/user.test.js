const request = require('supertest');
const app = require('../../app');
const config = require('../../config');
const support = require('../support/support');

describe('test/controller/user.test.js', function () {
    it('should / get user count 10', function (done) {
        request(app).get('/api/organization/users')
            .set('Cookie', support.adminUserCookie)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.results.length.should.equal(10);
                done();
            });
    });
});
