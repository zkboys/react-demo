import React from 'react';
import {Icon, Popconfirm} from 'antd';
import {hasPermission} from '../services/user';

class Operator extends React.Component {
    loading = <span style={{padding: '0px 6px'}}><Icon type="loading"/></span>;

    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            onClick: React.PropTypes.func.isRequired,
            label: React.PropTypes.string.isRequired,
            permission: React.PropTypes.string,
            loading: React.PropTypes.bool,
            confirm: React.PropTypes.object,
        })),
    };

    render() {
        const items = this.props.items;
        let operators = [];

        items.forEach((opt) => {
            const permission = opt.permission;
            const loading = opt.loading;
            const onClick = opt.onClick;
            const label = loading ? this.loading : opt.label;
            const confirm = opt.confirm;
            let hasPer = true;

            if (permission) {
                hasPer = hasPermission(permission);
            }

            if (hasPer) {
                if (confirm) {
                    const placement = confirm.placement || 'topRight';
                    const title = confirm.title || '您确定？';
                    operators.push(
                        <Popconfirm placement={placement} title={title} onConfirm={onClick}>
                            <a href="###">{label}</a>
                        </Popconfirm>
                    );
                } else {
                    operators.push(<a href="###" onClick={onClick}>{label}</a>);
                }
            }
        });

        const operatorsLength = operators.length;

        if (!operatorsLength) {
            return <span>您无任何操作权限</span>;
        }

        return (
            <span>
                {operators.map((v, i) => {
                    return (
                        <span key={`operator-${i}`}>
                            {v}
                            {operatorsLength === i + 1 ? '' : <span className="ant-divider"/>}
                        </span>
                    );
                })}
            </span>
        );
    }
}

export default Operator;
