require('mochawait');
const userProxy = require('../../proxy/user');

describe('test/proxy/user.test.js', function () {
    it('should / loginName = admin', async() => {
        const user = await userProxy.getUserByLoginName('admin')
        user.loginname.should.equal('admin');
    });
});
