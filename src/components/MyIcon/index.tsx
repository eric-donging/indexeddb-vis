import React, { CSSProperties } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import "./index.css";

const MyIcon = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3787249_z2k1jkb1um.js", // 在 iconfont.cn 上生成
});


interface IProps {
  type: "icon-shebei" | "icon-zhongduan" | "icon-zhongduan1" | "icon-yulan" | "icon-fenxiang"
  | "icon-quanpingfangda" | "icon-quanpingsuoxiao" | "icon-biaoge" | "icon-zhibiaoka" | "icon-zhexiantu"
  | "icon-zhuzhuangtu" | "icon-tiaozhuangtu" | "icon-bingtu" | "icon-sandiantu" | "icon-loudoutu"
  | "icon-leidatu" | "icon-sangjitu-copy" | "icon-ciyun" | "icon-pinghangzuobiaoxi" | "icon-jibenzhexiantu"
  | "icon-fsux_tubiao_fenbuquxiantu" | "icon-zhexian" | "icon-weidu" | "icon-duliang" | "icon-touxiang"
  className?: string
  style?: CSSProperties
}

export const MyClassIcon: React.FC<IProps> = (props) => {
  const { className: cn = '', style = {} } = props;
  return <i className={`iconfont ${props.type} ${cn}`} style={style} />
}

export default MyIcon;
