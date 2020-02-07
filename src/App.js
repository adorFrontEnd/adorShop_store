import React, { Component } from 'react';
import Router from './router/router'
import zh_CN  from 'antd/lib/locale-provider/zh_CN';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ConfigProvider } from 'antd';
moment.locale('zh-cn');
class App extends Component {
  render() {
    return (
      <ConfigProvider locale={zh_CN}>
        <Router />
      </ConfigProvider>
    );
  }
}

export default App;

