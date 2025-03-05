/**
 * Voucher API Monitoring Dashboard
 * 
 * This file provides components and utilities for real-time monitoring
 * of voucher API performance and error tracking within the admin dashboard.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Table, Badge, Alert, Spin, Statistic, Button, Select, DatePicker } from 'antd';
import { ReloadOutlined, WarningOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

// API monitoring storage - will persist during the session
const apiMetrics = {
  calls: [],
  errors: [],
  slowRequests: [],
  voucherUsage: {},
  lastUpdate: null
};

// Performance thresholds in milliseconds
const PERFORMANCE_THRESHOLDS = {
  good: 300,
  warning: 700,
  critical: 1500
};

/**
 * API Monitoring Service
 * Tracks API calls, response times, errors, and aggregates metrics
 */
export const ApiMonitor = {
  // Initialize the monitoring system
  init() {
    if (window._apiMonitorInitialized) return;
    
    // Override fetch to monitor API calls
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
      // Only monitor voucher-related API calls
      if (!(url.includes('/vouchers') || url.includes('/apply-voucher'))) {
        return originalFetch(url, options);
      }
      
      const start = performance.now();
      let status = 'pending';
      
      try {
        const response = await originalFetch(url, options);
        const duration = performance.now() - start;
        status = response.ok ? 'success' : 'error';
        
        // Extract voucher code from request
        let voucherCode = null;
        if (options?.body) {
          try {
            const body = JSON.parse(options.body);
            voucherCode = body.code || body.voucher_code;
          } catch (e) {
            // Not JSON or no voucher code
          }
        }
        
        // Record API call
        ApiMonitor.recordCall({
          url,
          method: options?.method || 'GET',
          duration,
          status,
          statusCode: response.status,
          timestamp: new Date(),
          voucherCode
        });
        
        if (!response.ok) {
          // Record error
          const errorData = await response.clone().json().catch(() => ({}));
          ApiMonitor.recordError({
            url,
            method: options?.method || 'GET',
            status: response.status,
            message: errorData.message || 'Unknown error',
            timestamp: new Date(),
            voucherCode
          });
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - start;
        status = 'failed';
        
        // Record error
        ApiMonitor.recordError({
          url,
          method: options?.method || 'GET',
          message: error.message,
          timestamp: new Date(),
          duration
        });
        
        throw error;
      }
    };
    
    window._apiMonitorInitialized = true;
  },
  
  // Record an API call
  recordCall(callData) {
    apiMetrics.calls.push(callData);
    
    // Limit array size
    if (apiMetrics.calls.length > 100) {
      apiMetrics.calls = apiMetrics.calls.slice(-100);
    }
    
    // Track slow requests
    if (callData.duration > PERFORMANCE_THRESHOLDS.warning) {
      apiMetrics.slowRequests.push(callData);
      
      // Limit array size
      if (apiMetrics.slowRequests.length > 50) {
        apiMetrics.slowRequests = apiMetrics.slowRequests.slice(-50);
      }
    }
    
    // Track voucher usage
    if (callData.voucherCode && callData.status === 'success') {
      if (!apiMetrics.voucherUsage[callData.voucherCode]) {
        apiMetrics.voucherUsage[callData.voucherCode] = 0;
      }
      apiMetrics.voucherUsage[callData.voucherCode]++;
    }
    
    apiMetrics.lastUpdate = new Date();
  },
  
  // Record an API error
  recordError(errorData) {
    apiMetrics.errors.push(errorData);
    
    // Limit array size
    if (apiMetrics.errors.length > 50) {
      apiMetrics.errors = apiMetrics.errors.slice(-50);
    }
    
    apiMetrics.lastUpdate = new Date();
  },
  
  // Get metrics for the dashboard
  getMetrics() {
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
    const last30Minutes = new Date(now.getTime() - 30 * 60 * 1000);
    
    const recent = apiMetrics.calls.filter(call => new Date(call.timestamp) > last5Minutes);
    const recentErrors = apiMetrics.errors.filter(error => new Date(error.timestamp) > last5Minutes);
    
    const avgResponseTime = recent.length > 0
      ? recent.reduce((sum, call) => sum + call.duration, 0) / recent.length
      : 0;
    
    return {
      totalCalls: apiMetrics.calls.length,
      recentCalls: recent.length,
      totalErrors: apiMetrics.errors.length,
      recentErrors: recentErrors.length,
      avgResponseTime,
      slowRequests: apiMetrics.slowRequests.length,
      voucherUsage: apiMetrics.voucherUsage,
      lastUpdate: apiMetrics.lastUpdate,
      
      // Calculate error rate (last 30 minutes)
      errorRate: (() => {
        const recent30Min = apiMetrics.calls.filter(call => new Date(call.timestamp) > last30Minutes);
        const errors30Min = apiMetrics.errors.filter(error => new Date(error.timestamp) > last30Minutes);
        
        if (recent30Min.length === 0) return 0;
        return (errors30Min.length / recent30Min.length) * 100;
      })(),
      
      // Raw data for tables
      rawCalls: apiMetrics.calls,
      rawErrors: apiMetrics.errors,
      rawSlowRequests: apiMetrics.slowRequests
    };
  },
  
  // Clear metrics
  clearMetrics() {
    apiMetrics.calls = [];
    apiMetrics.errors = [];
    apiMetrics.slowRequests = [];
    apiMetrics.voucherUsage = {};
    apiMetrics.lastUpdate = new Date();
  }
};

/**
 * API Performance Status Badge Component
 */
export const ApiPerformanceBadge = ({ duration }) => {
  if (!duration) return null;
  
  if (duration < PERFORMANCE_THRESHOLDS.good) {
    return <Badge status="success" text="Good" />;
  } else if (duration < PERFORMANCE_THRESHOLDS.warning) {
    return <Badge status="warning" text="Slow" />;
  } else {
    return <Badge status="error" text="Critical" />;
  }
};

/**
 * Voucher API Dashboard Component
 * Provides real-time monitoring of voucher API performance
 */
export const VoucherApiDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  
  // Initialize monitoring on component mount
  useEffect(() => {
    ApiMonitor.init();
    refreshMetrics();
    
    const intervalId = setInterval(refreshMetrics, refreshInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval]);
  
  // Refresh metrics
  const refreshMetrics = useCallback(() => {
    setLoading(true);
    
    // Simulate a small delay for UI feedback
    setTimeout(() => {
      setMetrics(ApiMonitor.getMetrics());
      setLoading(false);
    }, 300);
  }, []);
  
  if (!metrics) {
    return <Spin tip="Loading metrics..." />;
  }
  
  const getStatusColor = (errorRate) => {
    if (errorRate < 1) return '#52c41a';
    if (errorRate < 5) return '#faad14';
    return '#f5222d';
  };
  
  // Table columns for API calls
  const callColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => moment(timestamp).format('HH:mm:ss')
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url) => url.split('/').slice(-2).join('/')
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'success') {
          return <Badge status="success" text="Success" />;
        } else if (status === 'error') {
          return <Badge status="error" text="Error" />;
        } else {
          return <Badge status="processing" text="Pending" />;
        }
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <span>
          {duration.toFixed(2)}ms
          <span style={{ marginLeft: 8 }}>
            <ApiPerformanceBadge duration={duration} />
          </span>
        </span>
      )
    },
    {
      title: 'Voucher',
      dataIndex: 'voucherCode',
      key: 'voucherCode',
      render: (code) => code || '-'
    }
  ];
  
  // Table columns for errors
  const errorColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => moment(timestamp).format('HH:mm:ss')
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url) => url.split('/').slice(-2).join('/')
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method'
    },
    {
      title: 'Error',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: 'Voucher',
      dataIndex: 'voucherCode',
      key: 'voucherCode',
      render: (code) => code || '-'
    }
  ];
  
  // Calculate voucher usage for table
  const voucherUsageData = Object.entries(metrics.voucherUsage).map(([code, count]) => ({
    key: code,
    code,
    count
  }));
  
  return (
    <div className="voucher-api-dashboard">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Voucher API Monitoring Dashboard</span>
            <div>
              <Select
                value={refreshInterval}
                onChange={setRefreshInterval}
                style={{ width: 120, marginRight: 16 }}
              >
                <Select.Option value={5000}>5 seconds</Select.Option>
                <Select.Option value={10000}>10 seconds</Select.Option>
                <Select.Option value={30000}>30 seconds</Select.Option>
                <Select.Option value={60000}>1 minute</Select.Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshMetrics}
                loading={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        }
        extra={
          <div>
            Last updated: {metrics.lastUpdate ? moment(metrics.lastUpdate).format('HH:mm:ss') : 'Never'}
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="API Calls (Last 5 min)"
                value={metrics.recentCalls}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Avg Response Time"
                value={metrics.avgResponseTime.toFixed(2)}
                suffix="ms"
                valueStyle={{ 
                  color: metrics.avgResponseTime < PERFORMANCE_THRESHOLDS.good 
                    ? '#3f8600' 
                    : metrics.avgResponseTime < PERFORMANCE_THRESHOLDS.warning 
                      ? '#faad14' 
                      : '#cf1322' 
                }}
                prefix={
                  metrics.avgResponseTime < PERFORMANCE_THRESHOLDS.good 
                    ? <CheckCircleOutlined /> 
                    : <WarningOutlined />
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Error Rate"
                value={metrics.errorRate.toFixed(2)}
                suffix="%"
                valueStyle={{ color: getStatusColor(metrics.errorRate) }}
                prefix={metrics.errorRate < 1 ? <CheckCircleOutlined /> : <WarningOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Slow Requests"
                value={metrics.slowRequests}
                valueStyle={{ color: metrics.slowRequests > 0 ? '#faad14' : '#3f8600' }}
                prefix={metrics.slowRequests > 0 ? <WarningOutlined /> : <CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        <div style={{ marginTop: 24 }}>
          <div className="ant-tabs-nav" style={{ marginBottom: 16 }}>
            <div className="ant-tabs-nav-list" style={{ display: 'flex' }}>
              {['overview', 'calls', 'errors', 'vouchers'].map(tab => (
                <div
                  key={tab}
                  className={`ant-tabs-tab ${activeTab === tab ? 'ant-tabs-tab-active' : ''}`}
                  style={{ 
                    padding: '12px 16px', 
                    cursor: 'pointer',
                    borderBottom: activeTab === tab ? '2px solid #1890ff' : 'none'
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  <span style={{ textTransform: 'capitalize' }}>{tab}</span>
                </div>
              ))}
            </div>
          </div>
          
          {activeTab === 'overview' && (
            <div>
              <Alert
                message="Voucher API Status"
                description={
                  metrics.errorRate > 5
                    ? "Critical: High error rate detected. Check server logs for details."
                    : metrics.avgResponseTime > PERFORMANCE_THRESHOLDS.warning
                    ? "Warning: API response times are slower than usual."
                    : "Normal: All systems operational."
                }
                type={
                  metrics.errorRate > 5
                    ? "error"
                    : metrics.avgResponseTime > PERFORMANCE_THRESHOLDS.warning
                    ? "warning"
                    : "success"
                }
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Recent API Calls">
                    <Table
                      columns={callColumns}
                      dataSource={metrics.rawCalls.slice(-5).map((call, index) => ({ ...call, key: index }))}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Recent Errors">
                    <Table
                      columns={errorColumns}
                      dataSource={metrics.rawErrors.slice(-5).map((error, index) => ({ ...error, key: index }))}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}
          
          {activeTab === 'calls' && (
            <Card title="API Calls">
              <Table
                columns={callColumns}
                dataSource={metrics.rawCalls.map((call, index) => ({ ...call, key: index }))}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          )}
          
          {activeTab === 'errors' && (
            <Card title="API Errors">
              <Table
                columns={errorColumns}
                dataSource={metrics.rawErrors.map((error, index) => ({ ...error, key: index }))}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          )}
          
          {activeTab === 'vouchers' && (
            <Card title="Voucher Usage">
              <Table
                columns={[
                  {
                    title: 'Voucher Code',
                    dataIndex: 'code',
                    key: 'code',
                  },
                  {
                    title: 'Usage Count',
                    dataIndex: 'count',
                    key: 'count',
                  }
                ]}
                dataSource={voucherUsageData}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VoucherApiDashboard;
