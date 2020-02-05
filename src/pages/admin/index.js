import React, { Component } from "react";
import { Row, Col, Layout } from "antd";
import Header from './Header';
import Footer from './Footer';
import LeftBar from './LeftBar';
import Nav from './Nav';
import './admin.less';
import { isUserLogin } from '../../middleware/localStorage/login';
import { baseRoute, routerConfig } from '../../config/router.config';
import { withRouter } from 'react-router-dom';
class Admin extends Component {

  state = {
    collapsed: false
  }

  componentDidMount() {
    document.title = '爱朵电商 | 门店后台系统'
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div>
        <Header myProps="ok" collapsed={this.state.collapsed} toggle={this.toggle} />
        <Row className="container">
          <Col className={`nav-left ${this.state.collapsed ? "" : "not-collapsed"}`} span={this.state.collapsed ? null : 4}>
            <Layout.Sider
              width={230} collapsible collapsed={this.state.collapsed}>
              <LeftBar collapsed={this.state.collapsed} />
            </Layout.Sider>
          </Col>
          <Col span={20} className="main">
            <Row className="content">
              <Nav />
              {this.props.children}
              <div id='__loading_Content'
                style={{ width: "100%", height: "100%", top: "0", left: "0", position: 'absolute', zIndex: "99999", justifyContent: 'center', alignItems: 'center' }}>
                <span className="ld ld-ring ld-spin" style={{ fontSize: 40 }}></span>
              </div>
            </Row>
            <Footer />
          </Col>
        </Row>
      </div>
    )
  }
}
export default withRouter(Admin)

