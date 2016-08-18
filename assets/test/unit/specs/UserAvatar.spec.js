import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';
import UserAvatar from '../../../src/components/UserAvatar.jsx'

// http://reactjs.cn/react/docs/test-utils.html
describe('UserAvatar', () => {
    it('往页面插入一段带有demo类的div', () => {
        let instance = ReactTestUtils.renderIntoDocument(
            <UserAvatar/>
        );
        assert.ok(ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'span'));
    });
});
