import React, {Component} from 'react';
import {Row, Col, Button, Tree, Icon} from 'antd';
import deepCopy from 'deepcopy';
import FAIcon from '../../../components/faicon/FAIcon';
import OrganizationEdit from './OrganizationEdit';
import './style.less';

const TreeNode = Tree.TreeNode;

class Organization extends Component {
    state = {
        selectedKey: '',
    };

    static defaultProps = {
        organizationsTreeData: [],
    };

    static propTypes = {};
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentDidMount() {
        const {actions, route} = this.props;
        const {router} = this.context;
        actions.getOrganizationTreeData();
        router.setRouteLeaveHook(route, (/* nextLocation */) => {
            const {present: {changed}} = this.props;
            if (changed) {
                return '您有未保存的内容，确认要离开？';
            }
            return true;
        });
    }

    findNodeByKey = (data, key, callback) => {
        data.forEach((item, index, arr) => {
            if (item.key === key) {
                return callback(item, index, arr);
            }
            if (item.children) {
                return this.findNodeByKey(item.children, key, callback);
            }
        });
    };

    onDrop = (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const {present: {organizationsTreeData}, actions} = this.props;
        const data = deepCopy(organizationsTreeData);
        let dragObj;
        this.findNodeByKey(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            this.findNodeByKey(data, dropKey, (item, index, arr) => {
                dragObj.parentKey = item.parentKey;
                ar = arr;
                i = index;
            });
            ar.splice(i, 0, dragObj);
        } else {
            this.findNodeByKey(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                dragObj.parentKey = item.key;
                item.children.push(dragObj);
            });
        }
        actions.setOrganizationTreeData(data);
    };

    handleTreeNodeClick = (selectedKeys) => {
        let selectedKey = selectedKeys[0];
        this.setState({
            selectedKey,
        });
    };

    handleUndo = () => {
        const {actions} = this.props;
        actions.undoOrganization();
    }

    handleRedo = () => {
        const {actions} = this.props;
        actions.redoOrganization();
    }

    handleFormChange = (values) => {
        const {present: {organizationsTreeData}, actions} = this.props;
        const data = deepCopy(organizationsTreeData);
        this.findNodeByKey(data, values.key, (item) => {
            item.remark = values.remark;
            item.description = values.description;
            item.text = values.text;
        });
        actions.setOrganizationTreeData(data);
    }

    handleSave = () => {
        const {present: {organizationsTreeData}, actions} = this.props;
        const data = deepCopy(organizationsTreeData);
        let painData = [];
        const loop = d => d.forEach((item) => {
            painData.push({
                key: item.key,
                parentKey: item.parentKey,
                name: item.text,
                description: item.description,
                remark: item.remark,
            });
            if (item.children && item.children.length) {
                loop(item.children);
            }
        });
        loop(data);
        actions.saveOrganization(painData);
    }

    renderTreeNode = data => data.map((item) => {
        if (item.children && item.children.length) {
            return (
                <TreeNode
                    key={item.key}
                    title={<span><FAIcon type={item.description}/> {item.text}</span>}
                >
                    {this.renderTreeNode(item.children)}
                </TreeNode>
            );
        }
        return (
            <TreeNode
                key={item.key}
                title={<span><FAIcon type={item.description}/> {item.text}</span>}
            />
        );
    });

    render() {
        const {present: {organizationsTreeData, savingOrganization}, past, future} = this.props;
        const disableUndo = !past || !past.length;
        const disableRedo = !future || !future.length;
        let organization = {};
        this.findNodeByKey(organizationsTreeData, this.state.selectedKey, node => organization = node);
        return (
            <div className="organization-org">
                <div className="org-tool-bar">
                    <Button
                        type="primary"
                        size="large"
                        onClick={this.handleAddTopOrg}
                    >
                        <Icon type="plus-circle-o"/>添加顶级
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={this.handleAddTopOrg}
                    >
                        <Icon type="plus-circle-o"/>添加子级
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={this.handleAddTopOrg}
                    >
                        <Icon type="delete"/>删除
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={savingOrganization}
                        onClick={this.handleSave}
                    >
                        <Icon type="save"/>保存
                    </Button>
                    <Button
                        type="ghost"
                        size="large"
                        disabled={disableUndo}
                        onClick={this.handleUndo}
                    >
                        <FAIcon type="fa-undo"/>
                    </Button>
                    <Button
                        type="ghost"
                        size="large"
                        disabled={disableRedo}
                        onClick={this.handleRedo}
                    >
                        <FAIcon type="fa-repeat"/>
                    </Button>
                </div>
                <Row>
                    <Col span={6}>
                        <Tree
                            defaultExpandAll
                            openAnimation={{}}
                            draggable
                            onDrop={this.onDrop}
                            onSelect={this.handleTreeNodeClick}
                            // onRightClick={this.handleRightClick}
                        >
                            {this.renderTreeNode(organizationsTreeData)}
                        </Tree>
                    </Col>
                    <Col span={12}>
                        <OrganizationEdit organization={organization} onChange={this.handleFormChange}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const LayoutComponent = Organization;
export function mapStateToProps(state) {
    return {
        ...state.organizationEdit,
    };
}
