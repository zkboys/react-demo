import React, {Component} from 'react';
import {Row, Col, Button, Tree, Icon, Spin, Popover} from 'antd';
import _ from 'lodash';
import FAIcon from '../../../components/faicon/FAIcon';
import OrganizationEdit from './OrganizationEdit';
import './style.less';
import {findNodeByKey} from '../../../utils';

const TreeNode = Tree.TreeNode;

class Organization extends Component {
    state = {
        selectedKey: '',
        addTop: false,
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

    onDrop = (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const {present: {organizationsTreeData}, actions} = this.props;
        const data = _.cloneDeep(organizationsTreeData);
        let dragObj;
        findNodeByKey(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            findNodeByKey(data, dropKey, (item, index, arr) => {
                dragObj.parentKey = item.parentKey;
                ar = arr;
                i = index;
            });
            ar.splice(i, 0, dragObj);
        } else {
            findNodeByKey(data, dropKey, (item) => {
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
        const data = _.cloneDeep(organizationsTreeData);
        findNodeByKey(data, values.key, (item) => {
            item.remark = values.remark;
            item.description = values.description;
            item.text = values.text;
        });
        actions.setOrganizationTreeData(data);
    }

    handleSave = () => {
        const {present: {organizationsTreeData}, actions} = this.props;
        const data = _.cloneDeep(organizationsTreeData);
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
        actions.saveOrganization({
            organizations: painData,
        });
    }
    handleAddTopOrg = () => {
        this.setState({
            addTop: true,
        });
    }
    handleAddSubOrg = () => {
        this.setState({
            addTop: false,
        });
    }
    handleAdd = (values) => {
        const {addTop, selectedKey} = this.state;
        const {present: {organizationsTreeData}, actions} = this.props;
        const data = _.cloneDeep(organizationsTreeData);
        let parentKey = selectedKey;
        const newNode = {
            parentKey,
            ...values,
        };
        if (addTop) {
            newNode.parentKey = undefined;
            data.push(newNode);
        } else {
            findNodeByKey(data, parentKey, (item) => {
                if (!item.children) {
                    item.children = [];
                }
                item.children.push(newNode);
            });
        }

        actions.setOrganizationTreeData(data);
    }
    handleDelete = () => {
        const {selectedKey} = this.state;
        const {present: {organizationsTreeData}, actions} = this.props;
        const data = _.cloneDeep(organizationsTreeData);
        let loop = (d) => {
            d.forEach((v, i, arr) => {
                if (v.key === selectedKey) {
                    arr.splice(i, 1);
                }
                if (v.children && v.children.length) {
                    loop(v.children);
                }
            });
        };
        loop(data);
        actions.setOrganizationTreeData(data);
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
        const {present: {organizationsTreeData, savingOrganization, gettingOrganizationTreeData, changed}, past, future} = this.props;
        const disableUndo = !past || !past.length;
        const disableRedo = !future || !future.length;
        let organization = {};
        findNodeByKey(organizationsTreeData, this.state.selectedKey, node => organization = node);
        const {selectedKey} = this.state;
        const disableAddSub = !selectedKey;
        const disableDelete = !selectedKey;
        const disableSave = !changed;
        return (
            <Spin spinning={gettingOrganizationTreeData}>
                <div className="organization-org">
                    <Row>
                        <Col span={8}>
                            <div className="org-tool-bar">
                                <Popover
                                    placement="rightBottom"
                                    title="添加顶级"
                                    content={<OrganizationEdit
                                        formItemLayout={{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18},
                                        }}
                                        organization={{key: String(new Date().getTime())}}
                                        onSubmit={this.handleAdd}
                                        showButtons/>
                                    }
                                    trigger="click"
                                >

                                    <Button
                                        type="primary"
                                        onClick={this.handleAddTopOrg}
                                    >
                                        <Icon type="plus-circle-o"/>添加顶级
                                    </Button>
                                </Popover>

                                <Button
                                    type="primary"
                                    disabled={disableSave}
                                    loading={savingOrganization}
                                    onClick={this.handleSave}
                                >
                                    <Icon type="save"/>保存
                                </Button>
                                <Button
                                    type="ghost"
                                    disabled={disableUndo}
                                    onClick={this.handleUndo}
                                >
                                    <FAIcon type="fa-undo"/>
                                </Button>
                                <Button
                                    type="ghost"
                                    disabled={disableRedo}
                                    onClick={this.handleRedo}
                                >
                                    <FAIcon type="fa-repeat"/>
                                </Button>
                            </div>
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
                        <Col span={8}>
                            <Row style={{marginBottom: 8}}>
                                <Col offset="4">
                                    <div className="org-tool-bar">
                                        <Popover
                                            placement="rightBottom"
                                            title="添加子级"
                                            content={<OrganizationEdit
                                                formItemLayout={{
                                                    labelCol: {span: 6},
                                                    wrapperCol: {span: 18},
                                                }}
                                                organization={{key: String(new Date().getTime())}}
                                                onSubmit={this.handleAdd} showButtons/>
                                            }
                                            trigger="click"
                                        >

                                            <Button
                                                type="primary"
                                                disabled={disableAddSub}
                                                onClick={this.handleAddSubOrg}
                                            >
                                                <Icon type="plus-circle-o"/>添加子级
                                            </Button>
                                        </Popover>
                                        <Button
                                            disabled={disableDelete}
                                            onClick={this.handleDelete}
                                        >
                                            <Icon type="delete"/>删除
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <OrganizationEdit organization={organization} onChange={this.handleFormChange}/>
                        </Col>
                    </Row>
                </div>
            </Spin>

        );
    }
}

export const LayoutComponent = Organization;
export function mapStateToProps(state) {
    return {
        ...state.organizationEdit,
    };
}
