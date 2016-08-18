import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from '../actions';


const options = {
    withRef: true,
};


export default function connectComponent({
    mapStateToProps = (state) => ({...state}),
    mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)}),
    mergeProps,
    LayoutComponent,
}) {
    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
        options
    )(LayoutComponent);
}
