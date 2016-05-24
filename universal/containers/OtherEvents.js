import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EventTicker from '../components/EventTicker';
import * as PulseActions from '../actions/PulseActions';

class OtherEvents extends Component {
  static propTypes = {
    editEvent: React.PropTypes.func.isRequired,
    deleteEvent: React.PropTypes.func.isRequired,
    uploadImage: React.PropTypes.func.isRequired,
    uploadedImages: React.PropTypes.array.isRequired,
    userId: React.PropTypes.string,
    events: React.PropTypes.array
  };

  render() {
    let actions = {
      editEvent: this.props.editEvent,
      deleteEvent: this.props.deleteEvent
    };

    return (
      <EventTicker events={this.props.events} userId={this.props.userId} actions={actions} uploadImage={this.props.uploadImage} uploadedImages={this.props.uploadedImages} />
    );
  }
}

/**
 * Expose "Smart" Component that is connect-ed to Redux
 */
export default connect(
  state => ({
    events: state.pulseApp.events,
    userId: state.pulseApp.userId,
    uploadedImages: state.pulseApp.uploadedImages
  }),
  dispatch => bindActionCreators(PulseActions, dispatch)
)(OtherEvents);
