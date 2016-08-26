import React, {Component} from 'react';
import {Row, Col, Button, Tree, Icon} from 'antd';
import deepCopy from 'deepcopy';
import FAIcon from '../../../components/faicon/FAIcon';
import './style.less';

const TreeNode = Tree.TreeNode;

class Organization extends Component {
    state = {};

    static defaultProps = {
        organizationsTreeData: [],
    };

    static propTypes = {};

    componentDidMount() {
        const {actions} = this.props;
        actions.getAllOrganizations();
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
        let data = [...this.state.gData];
        let selectedKey = selectedKeys[0];
        let selectNodeData;
        this.findNodeByKey(data, selectedKey, (item) => {
            selectNodeData = item;
        });
        if (!selectNodeData) return;
        const {setFieldsValue} = this.props.form;
        this.setState({
            disableEditRemark: selectNodeData.children && selectNodeData.children.length && selectNodeData.parentKey,
        });
        setFieldsValue({
            key: selectNodeData.key,
            text: selectNodeData.text,
            remark: selectNodeData.remark,
            description: selectNodeData.description,
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
        const {present: {organizationsTreeData}, past, future} = this.props;
        const disableUndo = !past || !past.length; // 第一次次有空值情况
        const disableRedo = !future || !future.length;
        return (
            <div className="organization-org">
                <Row>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <div style={{textAlign: 'left', display: 'inline-block'}}>
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
                                    <Icon type="delete" />删除
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
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
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export const LayoutComponent = Organization;
export function mapStateToProps(state) {
    return {
        ...state.organization,
    };
}
