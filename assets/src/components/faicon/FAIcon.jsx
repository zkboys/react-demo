import React, {Component} from 'react';
import './font-awesome.css';

class FAIcon extends Component {
    static propsType = {
        type: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
    }

    render() {
        let {type, className} = this.props;
        className += ` fa ${type}`;
        return <i className={className}/>;
    }
}

export default FAIcon;
