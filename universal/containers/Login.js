import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoginPage from '../components/LoginPage';
import * as PulseActions from '../actions/PulseActions';

class Login extends Component {
  static propTypes = {
    addEvent: React.PropTypes.func.isRequired,
    submitLogin: React.PropTypes.func.isRequired,
    isLoggedIn: React.PropTypes.bool,
    uploadedImages: React.PropTypes.Array
  }

  render() {
    console.log(this.props.uploadedImages)
    return (
      <LoginPage submitLogin={this.props.submitLogin} isLoggedIn={this.props.isLoggedIn} addEvent={this.props.addEvent} />
    );
  }
}

/**
 * Expose "Smart" Component that is connect-ed to Redux
 */
export default connect(
  state => ({
    isLoggedIn: state.pulseApp.isLoggedIn,
    uploadedImages: state.pulseApp.uploadedImages
  }),
  dispatch => bindActionCreators(PulseActions, dispatch)
)(Login);