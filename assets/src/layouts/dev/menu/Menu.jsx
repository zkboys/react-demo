import React, {Component} from 'react';
import {Row, Col, Button, Tree, Icon, Modal, Spin, Table, Popconfirm, Popover} from 'antd';
import deepCopy from 'deepcopy';
import FAIcon from '../../../components/faicon/FAIcon';
import MenuEdit from './MenuEdit';
import MenuFunctionForm from './MenuFunctionForm';
import './style.less';

const TreeNode = Tree.TreeNode;

class Menu extends Component {
    state = {
        selectedKey: '',
        showEditModal: false,
        addTop: false,
    };

    static defaultProps = {
        menusTreeData: [],
    };

    static propTypes = {};
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentDidMount() {
        const {actions, route} = this.props;
        const {router} = this.context;
        actions.getMenuTreeData();
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
        const {present: {menusTreeData}, actions} = this.props;
        const data = deepCopy(menusTreeData);
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
        actions.setMenuTreeData(data);
    };

    handleTreeNodeClick = (selectedKeys) => {
        const {present: {menusTreeData}} = this.props;
        const data = deepCopy(menusTreeData);
        const selectedKey = selectedKeys[0];
        let selectNodeData;
        this.findNodeByKey(data, selectedKey, (item) => {
            selectNodeData = item;
        });
        const functions = selectNodeData.functions;
        this.setState({
            selectedKey,
            functions,
        });
    };

    handleUndo = () => {
        const {actions} = this.props;
        actions.undoMenu();
    }

    handleRedo = () => {
        const {actions} = this.props;
        actions.redoMenu();
    }

    handleFormChange = (values) => {
        const {present: {menusTreeData}, actions} = this.props;
        const data = deepCopy(menusTreeData);
        this.findNodeByKey(data, values.key, (item) => {
            item.path = values.path;
            item.icon = values.icon;
            item.text = values.text;
        });
        actions.setMenuTreeData(data);
    }

    handleSave = () => {
        const {present: {menusTreeData}, actions} = this.props;
        const data = deepCopy(menusTreeData);
        let painData = [];
        const loop = d => d.forEach((item) => {
            painData.push({
                key: item.key,
                parentKey: item.parentKey,
                text: item.text,
                icon: item.icon,
                path: item.path,
                order: item.order,
                functions: item.functions,
            });
            if (item.children && item.children.length) {
                loop(item.children);
            }
        });
        loop(data);
        actions.saveMenu({
            menus: painData,
        });
    }
    handleAddTopMenu = () => {
        this.setState({
            showEditModal: true,
            addTop: true,
        });
    }
    handleAddSubMenu = () => {
        const {selectedKey} = this.state;
        if (!selectedKey) {
            Modal.info({
                title: '提示',
                content: '请选择一个组织',
            });
            return;
        }
        this.setState({
            showEditModal: true,
            addTop: false,
        });
    }
    handleAdd = (values) => {
        const {addTop, selectedKey} = this.state;
        const {present: {menusTreeData}, actions} = this.props;
        const data = deepCopy(menusTreeData);
        let parentKey = selectedKey;
        const newNode = {
            parentKey,
            ...values,
        };
        if (addTop) {
            newNode.parentKey = undefined;
            data.push(newNode);
        } else {
            this.findNodeByKey(data, parentKey, (item) => {
                if (!item.children) {
                    item.children = [];
                }
                item.children.push(newNode);
            });
        }

        actions.setMenuTreeData(data);
        this.setState({
            showEditModal: false,
        });
    }
    handleDelete = () => {
        const {selectedKey} = this.state;
        const {present: {menusTreeData}, actions} = this.props;
        const data = deepCopy(menusTreeData);
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
        actions.setMenuTreeData(data);
    }
    handleFunctionDelete = (functionKey) => {
        const {present: {menusTreeData}, actions} = this.props;
        const data = deepCopy(menusTreeData);
        let loop = (d) => {
            d.forEach((v) => {
                if (v.functions && v.functions.length) {
                    v.functions.forEach((f, index, array) => {
                        if (f.key === functionKey) {
                            array.splice(index, 1);
                        }
                    });
                }
                if (v.children && v.children.length) {
                    loop(v.children);
                }
            });
        };
        loop(data);
        actions.setMenuTreeData(data);
    };
    handleModalCancel = () => {
        this.setState({
            showEditModal: false,
        });
    }
    handleAddFunctionSubmit = (values) => {
        const {present: {menusTreeData}, actions} = this.props;
        const {selectedKey} = this.state;
        const data = deepCopy(menusTreeData);

        this.findNodeByKey(data, selectedKey, (item) => {
            if (!item.functions) {
                item.functions = [];
            }
            item.functions.unshift(values);
        });

        actions.setMenuTreeData(data);
    };
    renderTreeNode = data => data.map((item) => {
        if (item.children && item.children.length) {
            return (
                <TreeNode
                    key={item.key}
                    title={<span><FAIcon type={item.icon}/> {item.text}</span>}
                >
                    {this.renderTreeNode(item.children)}
                </TreeNode>
            );
        }
        return (
            <TreeNode
                key={item.key}
                title={<span><FAIcon type={item.icon}/> {item.text}</span>}
            />
        );
    });

    render() {
        const {present: {menusTreeData, savingMenu, gettingMenuTreeData}, past, future} = this.props;
        const disableUndo = !past || !past.length;
        const disableRedo = !future || !future.length;
        let menu = {};
        this.findNodeByKey(menusTreeData, this.state.selectedKey, node => menu = node);
        const {showEditModal, addTop, selectedKey} = this.state;
        const disableAddSub = !selectedKey;
        const disableDelete = !selectedKey;
        const disableAddFun = !selectedKey;
        const functions = menu.functions;
        return (
            <Spin spinning={gettingMenuTreeData}>
                <div className="dev-menu">
                    <Row>
                        <Col span={5}>
                            <div className="menu-tool-bar">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleAddTopMenu}
                                >
                                    <Icon type="plus-circle-o"/>
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    loading={savingMenu}
                                    onClick={this.handleSave}
                                >
                                    <Icon type="save"/>
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
                                {this.renderTreeNode(menusTreeData)}
                            </Tree>
                        </Col>
                        <Col span={9} style={{paddingTop: 48}}>
                            <MenuEdit menusTreeData={menusTreeData} menu={menu} onChange={this.handleFormChange}/>
                            <Row>
                                <Col offset="4">
                                    <div className="node-tool-bar">
                                        <Button
                                            type="primary"
                                            size="large"
                                            disabled={disableAddSub}
                                            onClick={this.handleAddSubMenu}
                                        >
                                            <Icon type="plus-circle-o"/>添加子级
                                        </Button>
                                        <Button
                                            size="large"
                                            disabled={disableDelete}
                                            onClick={this.handleDelete}
                                        >
                                            <Icon type="delete"/>删除
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={10}>
                            <div className="menu-tool-bar" style={{marginBottom: 16}}>
                                <Popover placement="rightBottom" title="添加内部功能" content={<MenuFunctionForm menusTreeData={menusTreeData} onSubmit={this.handleAddFunctionSubmit}/>} trigger="click">
                                    <Button
                                        disabled={disableAddFun}
                                        type="primary"
                                        size="large"
                                    >
                                        <Icon type="plus-circle-o"/>添加内部功能
                                    </Button>
                                </Popover>
                            </div>
                            <Table
                                pagination={false}
                                columns={
                                    [
                                        {
                                            title: 'key',
                                            dataIndex: 'key',
                                            key: 'key',
                                        },
                                        {
                                            title: '名称',
                                            dataIndex: 'name',
                                            key: 'name',
                                        },
                                        {
                                            title: '描述',
                                            dataIndex: 'description',
                                            key: 'description',
                                        },
                                        {
                                            title: '操作',
                                            key: 'operator',
                                            render: (text, record) => {
                                                const key = record.key;
                                                return (
                                                    <Popconfirm placement="topRight" title={`您确定要删除“${record.name}”？`} onConfirm={() => this.handleFunctionDelete(key)}>
                                                        <a href="###">删除</a>
                                                    </Popconfirm>
                                                );
                                            },
                                        },
                                    ]
                                }
                                dataSource={functions}
                            />
                        </Col>
                    </Row>
                    <Modal
                        title={addTop ? '添加顶级组织' : '添加子级组织'}
                        visible={showEditModal}
                        footer=""
                        onCancel={this.handleModalCancel}
                    >
                        <MenuEdit
                            menusTreeData={menusTreeData}
                            menu={{key: addTop ? '' : `${selectedKey}-`}}
                            onSubmit={this.handleAdd}
                            showButtons
                        />
                    </Modal>
                </div>
            </Spin>

        );
    }
}

export const LayoutComponent = Menu;
export function mapStateToProps(state) {
    return {
        ...state.menuEdit,
    };
}
