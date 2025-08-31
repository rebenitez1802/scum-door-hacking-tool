import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import Header from './components/Header';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import './styles/App.css';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;