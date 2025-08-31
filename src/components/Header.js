import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

function Header() {
  return (
    <AntHeader style={{ 
      background: '#001529', 
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      height: 'auto',
      lineHeight: 'normal'
    }}>
      <Space align="center">
        <ToolOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        <div>
          <Title level={3} style={{ margin: 0, color: 'white', fontSize: '20px', lineHeight: 1.2 }}>
            SCUM AB Hack Tool
          </Title>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '2px' }}>
            Door hacking utility for SCUM
          </Text>
        </div>
      </Space>
    </AntHeader>
  );
}

export default Header;