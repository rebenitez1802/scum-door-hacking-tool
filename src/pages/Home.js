import React from 'react';
import { Card, Typography, Row, Col, Space, Alert, Button } from 'antd';
import { RocketOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={2}>Welcome to SCUM AB Hack Tool</Title>
          <Paragraph>
            This tool is designed to help you with mini-games in SCUM. 
            Select a tool from the menu above to get started.
          </Paragraph>
        </Card>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card 
              title={<><CalculatorOutlined /> SCUM Calculator</>}
              hoverable
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => navigate('/calculator')}
                  icon={<CalculatorOutlined />}
                >
                  Open Calculator
                </Button>
              ]}
            >
              <Paragraph>
                A powerful calculator tool with dual operation columns to help with SCUM game calculations and mini-games.
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card 
              title={<><RocketOutlined /> Coming Soon</>}
              hoverable
            >
              <Paragraph>
                More tools and calculators will be added here to help with SCUM mini-games.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}

export default Home;