import React, { useCallback, useContext, CSSProperties, useState } from "react";
import { Avatar, Form, Input, Layout, Modal, Tooltip, message } from "antd";
import styles from "./index.module.css";
import { MyClassIcon } from "../MyIcon";
import { UserOutlined } from '@ant-design/icons';
import HeaderNav from "../HeaderNav";
import { RouteComponentProps } from "react-router-dom";
import { defaultPathInfo } from "../../configs/routerConfig";
import { loginMsgCtx } from "../../App";
import { LoginObj, exit, login } from "../../api/user";

const { Header, Content } = Layout;

interface IProps extends RouteComponentProps {
    children?: JSX.Element
    /**
     * 内容区类名
     */
    className?: string
    /**
     * 内容区样式
     */
    style?: CSSProperties
}

export const ref = React.createRef<any>();

const MyLayout: React.FC<IProps> = (props) => {
    const { className: cn = '', style = {} } = props;

    const { loginMsg, isLoading, changeLoginMsg } = useContext(loginMsgCtx);

    const handleClick = useCallback(() => {
        props.history.push(defaultPathInfo.pathName);
    }, [props.history]);

    const [loginObj, setLoginObj] = useState<LoginObj>({ loginName: '', loginPwd: '' });
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const handleOk = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        console.log(loginObj);
        if (loginObj.loginName.length === 0) {
            message.error("用户名不能为空");
            return;
        } else if (loginObj.loginPwd.length === 0) {
            message.error("密码不能为空");
            return;
        }
        setConfirmLoading(true);
        const res = await login(loginObj);
        if (typeof res.data.data === "string") {
            message.error("用户名或密码错误");
            setConfirmLoading(false);
            return;
        } else {
            changeLoginMsg(res.data.data);
            message.info("登录成功！");
        }
        setConfirmLoading(false);
        setOpen(false);
    }, [changeLoginMsg, loginObj]);
    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);
    const showModal = useCallback(() => {
        setOpen(true);
    }, []);

    const handleExit = useCallback(async () => {
        console.log('要退出了');
        const res = exit();
        console.log(res);
        changeLoginMsg(null);
    }, [changeLoginMsg]);

    const content = <div className={styles.addText} onClick={handleExit}>
        退出登录
    </div>;

    return (
        <>
            <Layout className={`layout ${styles.layout}`} ref={ref}>
                <Header className={styles.header}>
                    <div className={styles.left}>
                        <div className={styles.title} onClick={handleClick}>
                            <MyClassIcon type="icon-zhongduan1" className={styles.icon} />
                            <span>TBI</span>
                        </div>
                        <HeaderNav {...props} />
                    </div>

                    {loginMsg ?
                        <Tooltip title={content} placement='bottom' color='#fff'>
                            <div className={styles.right}>
                                <Avatar size="large" icon={<UserOutlined />} className={styles.avatar} />
                                <div>{loginMsg.loginName}</div>
                            </div>
                        </Tooltip> :
                        <div className={styles.right} onClick={showModal} >
                            {isLoading ? "..." : "登录 / 注册"}
                        </div>
                    }
                </Header>
                <Content className={`${styles.content} ${cn}`} style={style}>
                    {props.children}
                </Content>
            </Layout>

            {/* 新建仪表盘弹窗 */}
            <Modal
                title="用户登录"
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText='取消'
                okText='登录'
                destroyOnClose={true}
                width={700}
                confirmLoading={confirmLoading}
            >
                <Form
                    style={{ margin: '50px 0px' }}
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16, offset: 1 }}
                    labelAlign="right"
                >
                    <Form.Item
                        label="用户名"
                        name="name"
                        rules={[{ required: true, message: '用户名不能为空' }]}
                    >
                        <Input value={loginObj.loginName} onChange={(e) => {
                            setLoginObj({ ...loginObj, loginName: e.target.value.trim() });
                        }} />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="description"
                        rules={[{ required: true, message: '密码不能为空' }]}
                    >
                        <Input value={loginObj.loginPwd} onChange={(e) => {
                            setLoginObj({ ...loginObj, loginPwd: e.target.value.trim() });
                        }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>

    )
};

export default MyLayout;
