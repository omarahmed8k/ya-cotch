import * as React from 'react';
import { Row, Col, Card } from 'antd';
import { CheckOutlined, QuestionOutlined, MessageOutlined, UserAddOutlined } from '@ant-design/icons';
import './index.less';
import TinyLineChartExample from './components/TinyLineChartExample';
import BarChartExample from './components/BarChartExample';
import PieChartExample from './components/PieChartExample';
import LineChartExample from './components/LineChartExample';
import ListExample from './components/ListExample';

export class Dashboard extends React.Component<any> {
  componentDidMount() {
    setTimeout(() => this.setState({ cardLoading: false }), 1000);
    setTimeout(() => this.setState({ lineChartLoading: false }), 1500);
    setTimeout(() => this.setState({ barChartLoading: false }), 2000);
    setTimeout(() => this.setState({ pieChartLoading: false }), 1000);
  }

  state = {
    cardLoading: true,
    lineChartLoading: true,
    barChartLoading: true,
    pieChartLoading: true,
  };

  render() {
    const { cardLoading, lineChartLoading, barChartLoading, pieChartLoading } = this.state;

    const visitorStatisticList = [
      { title: 'TODAY', body: '1.200 user' },
      { title: 'YESTERDAY', body: '3.872 user' },
      { title: 'LAST WEEK', body: '26.582 user' },
    ];

    const statCards = [
      { name: 'New Task', counter: 125, icon: <CheckOutlined />, variant: 'accent' },
      { name: 'New Ticket', counter: 257, icon: <QuestionOutlined />, variant: 'dark' },
      { name: 'New Comments', counter: 243, icon: <MessageOutlined />, variant: 'light' },
      { name: 'New Visitors', counter: 1225, icon: <UserAddOutlined />, variant: 'light' },
    ];

    const trendCards = [
      { title: 'Visitors', color: '#e6b800' },
      { title: 'Social Trends', color: '#15171c' },
      { title: 'Answered Tickets', color: '#8a8f98' },
    ];

    return (
      <div className="dashboard">
        <Row gutter={[20, 20]}>
          {statCards.map(card => (
            <Col key={card.name} xs={24} sm={12} xl={6}>
              <Card className={`dashboardCard dashboardCard-${card.variant}`} loading={cardLoading} bordered={false}>
                <div className="dashboardCardBody">
                  <div>
                    <p className="dashboardCardName">{card.name}</p>
                    <span className="dashboardCardCounter">{card.counter.toLocaleString()}</span>
                  </div>
                  <span className="dashboardCardIcon">{card.icon}</span>
                </div>
              </Card>
            </Col>
          ))}

          <Col span={24}>
            <Card className="dashboardBox" title="Visit Statistics" loading={lineChartLoading} bordered={false}>
              <LineChartExample />
            </Card>
          </Col>

          {trendCards.map(card => (
            <Col key={card.title} xs={24} lg={8}>
              <Card className="dashboardBox" title={card.title} loading={barChartLoading} bordered={false}>
                <TinyLineChartExample color={card.color} />
                <ListExample value={visitorStatisticList} />
              </Card>
            </Col>
          ))}

          <Col xs={24} xl={16}>
            <Card title="Payment Statistics" className="dashboardBox" loading={barChartLoading} bordered={false}>
              <BarChartExample />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
            <Card title="Browser Usage" className="dashboardBox" loading={pieChartLoading} bordered={false}>
              <PieChartExample />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
