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
            <div className="organization-org">
                <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}/>
                <div style={{height: 1000}}>我是组织建构管理页面</div>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.app,
    };
}
