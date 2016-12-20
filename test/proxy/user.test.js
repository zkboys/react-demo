require('mochawait');
const userProxy = require('../../proxy/user');

describe('test/proxy/user.test.js', function () {
    describe('#getUserByLoginName()', function () {
        // this.slow(1);
        // this.timeout(100);'
        // it.skip(...)
        // it.only(...)

        it('should return an user and user.loginname==admin', async() => {
            const user = await userProxy.getUserByLoginName('admin');
            user.loginname.should.equal('admin');
        });
    });
});
