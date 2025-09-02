import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Select, Switch, Row, Col, Typography, Space, Input, Button, message } from 'antd';
import { CalculatorOutlined, ThunderboltOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

function Calculator() {
  const [initialNumber, setInitialNumber] = useState(0);
  const [operations, setOperations] = useState(
    Array(8).fill().map(() => ({
      left: { operator: '+', value: '' },
      right: { operator: '+', value: '' },
      enabled: false
    }))
  );

  const [results, setResults] = useState({ left: 0, right: 0 });
  const [expectedValues, setExpectedValues] = useState({ left: '', right: '' });
  const [isSolving, setIsSolving] = useState(false);

  const calculateResult = (startValue, operationsList, side) => {
    let result = parseFloat(startValue) || 0;
    
    operationsList.forEach(row => {
      if (row.enabled && row[side].value !== '' && !isNaN(row[side].value)) {
        const value = parseFloat(row[side].value);
        switch (row[side].operator) {
          case '+':
            result += value;
            break;
          case '-':
            result -= value;
            break;
          case '*':
            result *= value;
            break;
          case '/':
            if (value !== 0) result /= value;
            break;
          default:
            break;
        }
      }
    });
    
    return result;
  };

  useEffect(() => {
    setResults({
      left: calculateResult(initialNumber, operations, 'left'),
      right: calculateResult(initialNumber, operations, 'right')
    });
  }, [initialNumber, operations]);

  const updateOperation = (index, side, field, value) => {
    const newOperations = [...operations];
    newOperations[index][side][field] = value;
    setOperations(newOperations);
  };

  const toggleOperation = (index) => {
    const newOperations = [...operations];
    newOperations[index].enabled = !newOperations[index].enabled;
    setOperations(newOperations);
  };

  const parseOperationInput = (inputValue) => {
    if (!inputValue || typeof inputValue !== 'string') {
      return { operator: null, value: inputValue };
    }

    // Remove any whitespace
    const cleanInput = inputValue.trim();
    
    // Check for operator at the beginning
    const operatorMatch = cleanInput.match(/^([+\-*/×÷])(.*)$/);
    
    if (operatorMatch) {
      let operator = operatorMatch[1];
      const valueStr = operatorMatch[2].trim();
      
      // Normalize operators
      if (operator === '×') operator = '*';
      if (operator === '÷') operator = '/';
      
      // Parse the numeric value
      const numValue = parseFloat(valueStr);
      
      if (!isNaN(numValue)) {
        return { operator, value: numValue };
      }
    }
    
    // If no operator found or invalid format, try to parse as just a number
    const numValue = parseFloat(cleanInput);
    if (!isNaN(numValue)) {
      return { operator: null, value: numValue };
    }
    
    return { operator: null, value: inputValue };
  };

  const handleOperationInputChange = (index, side, inputValue) => {
    const parsed = parseOperationInput(inputValue);
    const newOperations = [...operations];
    
    if (parsed.operator) {
      newOperations[index][side].operator = parsed.operator;
    }
    
    if (parsed.value !== null && parsed.value !== undefined) {
      newOperations[index][side].value = parsed.value;
    } else {
      newOperations[index][side].value = inputValue;
    }
    
    setOperations(newOperations);
  };

  const handleKeyDown = (event, index, side) => {
    const key = event.key;
    const operatorMap = {
      '+': '+',
      '-': '-',
      '*': '*',
      '/': '/',
      'x': '*',
      'X': '*',
      '×': '*',
      '÷': '/'
    };
    
    if (operatorMap[key]) {
      event.preventDefault();
      const newOperations = [...operations];
      newOperations[index][side].operator = operatorMap[key];
      setOperations(newOperations);
    }
  };

  const clearCircuit = () => {
    setInitialNumber(0);
    setOperations(
      Array(8).fill().map(() => ({
        left: { operator: '+', value: '' },
        right: { operator: '+', value: '' },
        enabled: false
      }))
    );
    setExpectedValues({ left: '', right: '' });
    message.info('🔄 Circuit reset! All switches disabled and voltages cleared.');
  };

  const solvePuzzle = async () => {
    if (!expectedValues.left || !expectedValues.right) {
      message.error('⚠️ Please enter target voltages for both wires');
      return;
    }

    setIsSolving(true);
    
    // Try all possible combinations of switches (2^8 = 256 combinations)
    const totalCombinations = Math.pow(2, 8);
    let solutionFound = false;
    
    for (let combination = 0; combination < totalCombinations; combination++) {
      // Create a test operations array with this combination
      const testOperations = operations.map((op, index) => ({
        ...op,
        enabled: (combination & (1 << index)) !== 0
      }));
      
      // Calculate results for this combination
      const leftResult = calculateResult(initialNumber, testOperations, 'left');
      const rightResult = calculateResult(initialNumber, testOperations, 'right');
      
      // Check if this combination matches expected values
      const leftExpected = parseFloat(expectedValues.left);
      const rightExpected = parseFloat(expectedValues.right);
      
      if (Math.abs(leftResult - leftExpected) < 0.01 && 
          Math.abs(rightResult - rightExpected) < 0.01) {
        // Found a solution! Apply it
        setOperations(testOperations);
        message.success('🔓 Door hacked successfully! Circuit configuration applied.');
        solutionFound = true;
        break;
      }
    }
    
    if (!solutionFound) {
      message.warning('🔒 Hack failed! No valid circuit combination found. Check your voltage modifications.');
    }
    
    setIsSolving(false);
  };

  const renderOperationRow = (index) => (
    <Row key={index} gutter={16} style={{ marginBottom: 16 }}>
      <Col xs={10} sm={10} md={10}>
        <Space.Compact style={{ display: 'flex', width: '100%' }}>
          <Select
            value={operations[index].left.operator}
            onChange={(value) => updateOperation(index, 'left', 'operator', value)}
            onKeyDown={(e) => handleKeyDown(e, index, 'left')}
            style={{ width: 50, minWidth: 40 }}
            size="small"
            tabIndex={-1}
          >
            <Option value="+">+</Option>
            <Option value="-">-</Option>
            <Option value="*">×</Option>
            <Option value="/">/</Option>
          </Select>
          <Input
            value={operations[index].left.value}
            onChange={(e) => handleOperationInputChange(index, 'left', e.target.value)}
            placeholder="+2, -5, *3..."
            style={{ flex: 1 }}
            size="small"
            tabIndex={2 + index * 2}
          />
        </Space.Compact>
      </Col>
      <Col xs={4} sm={4} md={4} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Switch
          checked={operations[index].enabled}
          onChange={() => toggleOperation(index)}
          size="small"
          tabIndex={-1}
        />
      </Col>
      <Col xs={10} sm={10} md={10}>
        <Space.Compact style={{ display: 'flex', width: '100%' }}>
          <Select
            value={operations[index].right.operator}
            onChange={(value) => updateOperation(index, 'right', 'operator', value)}
            onKeyDown={(e) => handleKeyDown(e, index, 'right')}
            style={{ width: 50, minWidth: 40 }}
            size="small"
            tabIndex={-1}
          >
            <Option value="+">+</Option>
            <Option value="-">-</Option>
            <Option value="*">×</Option>
            <Option value="/">/</Option>
          </Select>
          <Input
            value={operations[index].right.value}
            onChange={(e) => handleOperationInputChange(index, 'right', e.target.value)}
            placeholder="+2, -5, *3..."
            style={{ flex: 1 }}
            size="small"
            tabIndex={3 + index * 2}
          />
        </Space.Compact>
      </Col>
    </Row>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 8px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={2}>
            <CalculatorOutlined /> SCUM Door Hacking Tool
          </Title>
          <Text type="secondary">
            Manipulate electrical circuits to match the required voltage levels and unlock doors.
          </Text>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Column 1: Initial Voltage */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <Card title="Input Voltage">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary">Door's base voltage level</Text>
                <InputNumber
                  value={initialNumber}
                  onChange={setInitialNumber}
                  placeholder="Enter voltage"
                  style={{ width: '100%' }}
                  size="large"
                  suffix="V"
                  tabIndex={1}
                />
              </Space>
            </Card>
          </Col>

          {/* Column 2: Circuit Operations */}
          <Col xs={24} sm={24} md={16} lg={12}>
            <Card title="Circuit Modifications">
              <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                Configure voltage modifications for each circuit pair
              </Text>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={10} sm={10} md={10}>
                  <Text strong style={{ color: '#ff4d4f' }}>🔴 Red Wire</Text>
                </Col>
                <Col xs={4} sm={4} md={4} style={{ textAlign: 'center' }}>
                  <Text strong>Circuit</Text>
                </Col>
                <Col xs={10} sm={10} md={10}>
                  <Text strong style={{ color: '#1890ff' }}>🔵 Blue Wire</Text>
                </Col>
              </Row>
              {Array(8).fill().map((_, index) => renderOperationRow(index))}
            </Card>
          </Col>

          {/* Column 3: Voltage Output & Solver */}
          <Col xs={24} sm={24} md={24} lg={6}>
            <Card title="Door Lock Status">
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} lg={24}>
                  <Card size="small" style={{ borderColor: '#ff4d4f' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text type="secondary">🔴 Red Wire Output:</Text>
                      <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
                        {results.left.toFixed(2)}V
                      </Title>
                      <Text type="secondary">Required Voltage:</Text>
                      <InputNumber
                        value={expectedValues.left}
                        onChange={(value) => setExpectedValues(prev => ({ ...prev, left: value }))}
                        placeholder="Target voltage"
                        style={{ width: '100%' }}
                        suffix="V"
                        tabIndex={18}
                      />
                    </Space>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={24}>
                  <Card size="small" style={{ borderColor: '#1890ff' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text type="secondary">🔵 Blue Wire Output:</Text>
                      <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                        {results.right.toFixed(2)}V
                      </Title>
                      <Text type="secondary">Required Voltage:</Text>
                      <InputNumber
                        value={expectedValues.right}
                        onChange={(value) => setExpectedValues(prev => ({ ...prev, right: value }))}
                        placeholder="Target voltage"
                        style={{ width: '100%' }}
                        suffix="V"
                        tabIndex={19}
                      />
                    </Space>
                  </Card>
                </Col>
              </Row>
              
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={solvePuzzle}
                loading={isSolving}
                style={{ width: '100%', marginBottom: 8 }}
                size="large"
                danger
                tabIndex={20}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    solvePuzzle();
                  }
                }}
              >
                🔓 Hack Door
              </Button>
              
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={clearCircuit}
                style={{ width: '100%' }}
                size="large"
                tabIndex={-1}
              >
                ⚡ Reset Circuit
              </Button>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}

export default Calculator;