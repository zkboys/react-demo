import React from 'react';
import {Switch, Icon} from 'antd';

class SwitchRemote extends React.Component {
    state = {
        isLoading: false,
        disabled: this.props.disabled,
        checked: this.props.checked,
        checkedChildren: this.props.checkedChildren,
        unCheckedChildren: this.props.unCheckedChildren,
    };
    static defaultProps = {
        loading: false,
        size: 'default',
        checked: false,
        defaultChecked: false,
        disabled: false,
        checkedChildren: '是',
        unCheckedChildren: '否',
        onChange() {
        },
    };

    static propTypes = {};

    handleChange = (checked) => {
        const {loading, onChange} = this.props;
        if (loading) {
            return false;
        }
        onChange(checked);
    };

    render() {
        let {loading, size, checked, defaultChecked, disabled, checkedChildren, unCheckedChildren} = this.props;
        const loadingChildren = <Icon type="loading"/>;
        if (loading) {
            checkedChildren = loadingChildren;
            unCheckedChildren = loadingChildren;
        }
        return (
            <Switch
                size={size}
                checked={checked}
                defaultChecked={defaultChecked}
                disabled={disabled}
                checkedChildren={checkedChildren}
                unCheckedChildren={unCheckedChildren}
                onChange={this.handleChange}
            />
        );
    }
}
export default SwitchRemote;
