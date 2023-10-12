import React, { useCallback } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { message, Upload } from 'antd';
import csv from 'csvtojson'
import { ClassAndStyle } from '../../types/index';

interface IProps extends ClassAndStyle {
  /**
   * 上传文件成功后获得转换后的json数据
   */
  onUploadSuccess?: (datas: object[], fileName: string) => void
}

const { Dragger } = Upload;

const UploadFile: React.FC<IProps> = (props) => {
  const beforeUpload = useCallback((file: RcFile) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      console.log(111);
      let fileContent: string = reader.result as string;
      if (file.type === 'text/csv') {
        csv()
          .fromString(fileContent)
          .then(datas => {
            // console.log(datas);
            message.success('文件已上传！');
            console.log(file.name);
            props.onUploadSuccess && props.onUploadSuccess(datas, file.name);
          });
      } else {
        console.log(fileContent);
        console.log(1);
        let datas = JSON.parse(fileContent);
        console.log(2);
        console.log(datas);
        datas = (datas instanceof Array) ? datas : [datas];
        console.log(file.name);
        console.log(datas,'abababa');
        message.success('文件已上传！');
        props.onUploadSuccess && props.onUploadSuccess(datas, file.name);
      }
    };
    return false;  // 不需要上传到服务器
  }, [props]);

  const uploadProps: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept: 'text/csv,application/json',
    showUploadList: false,
    beforeUpload
  };

  const { className: cn = '', style = {} } = props;

  return (
    <div className={cn} style={style}>
      <Dragger {...uploadProps}>
        <InboxOutlined style={{ fontSize: '40px', color: '#1777ff' }} />
        <p style={{ fontSize: '13px', margin: '4px 0' }}>点击或拖拽上传文件</p>
        <p style={{ fontSize: '12px', margin: '4px 0', color: 'rgba(0,0,0,0.45)' }}>支持上传CSV、JSON文件</p>
      </Dragger>
    </div>
  );
}

export default React.memo(UploadFile);