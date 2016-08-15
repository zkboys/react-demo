import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';
import * as Demo from '../../../src/layouts/demo/Demo.jsx'

const DemoComponent = Demo.LayoutComponent;

describe('Demo.jsx', () => {
    it('往页面插入一段带有strong标签的组件', () => {
        let instance = ReactTestUtils.renderIntoDocument(
            <DemoComponent/>
        );
        assert.ok(ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'strong'));
    });
});
