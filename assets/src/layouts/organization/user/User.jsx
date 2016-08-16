import React, {Component} from 'react';
import './style.less';
import PageHeader from '../../../components/page-header/PageHeader';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    render() {
        const {pageHeader} = this.props;
        return (
            <div className="organization-user">
                <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}/>
                <div style={{height: 1000}}>我是人员管理页面</div>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.app,
    };
}
