import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';
import * as Demo from '../../../src/layouts/demo/Demo.jsx'

const DemoComponent = Demo.LayoutComponent;
// http://reactjs.cn/react/docs/test-utils.html
describe('Demo.jsx', () => {
    it('往页面插入一段带有demo类的div', () => {
        let instance = ReactTestUtils.renderIntoDocument(
            <DemoComponent/>
        );
        assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'demo'));
    });
});
