import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { routerConfig } from '../../config/router.config';
import { parsePath } from '../../router/routerParse';
import './common-page.less';

class CommonPage extends Component {
  componentDidMount() {

    let path = this.props.path;
    if (!path) {
      return;
    }
    let parsePathInfo = parsePath(path);
    let { title, parentTitle, grandParentTitle } = parsePathInfo;
    let pathInfo = {
      title: this.props.pathTitle || title,
      parentTitle: this.props.pathParentTitle || parentTitle,
      grandParentTitle: this.props.pathGrandParentTitle || grandParentTitle,
    }
    this.props.changeRoute({ path, ...pathInfo });
  }


  render() {
    return (
      <div className="page-body">
        <div className='page-meta'>
          <div className="page-title">{this.props.title}</div>
          <div className="page-description">{this.props.description}</div>
        </div>
        <div className="page-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommonPage)