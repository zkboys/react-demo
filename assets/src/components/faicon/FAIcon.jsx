import React, {Component} from 'react';
import './font-awesome.css';
import './style.css';

class FAIcon extends Component {
    static propsType = {
        type: React.PropTypes.string,
    }

    render() {
        const type = this.props.type;
        let className = ['fa', type].join(' ');
        return <i className={className}/>;
    }
}

export default FAIcon;
