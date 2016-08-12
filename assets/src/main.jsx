import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './main.less';

class Main extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    render() {
        return (
            <div>热重载怎么搞？</div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('main'));
