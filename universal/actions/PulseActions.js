import * as types from '../constants/ActionTypes';
import request from 'superagent';

const serverUrl = '';
const eventsUrl = `${serverUrl}/api/0/events`;

export function setUserId(userId) {
  return {
    type: types.SET_USER_ID,
    userId
  };
}

export function loadEvents() {
  return dispatch => {
    dispatch(loadEventsRequest());
    return request
      .get(eventsUrl)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch(loadEventsFailure(err));
        } else {
          dispatch(loadEventsSuccess(res.body));
        }
      });
  };
}

export function loadEventsRequest() {
  return {
    type: types.LOAD_EVENTS_REQUEST
  };
}

export function loadEventsSuccess(events) {
  return {
    type: types.LOAD_EVENTS_SUCCESS,
    events
  };
}

export function loadEventsFailure(error) {
  return {
    type: types.LOAD_EVENTS_FAILURE,
    error
  };
}

export function addEvent(event) {
  return dispatch => {
    dispatch(addEventRequest(event));

    // const form = new FormData();

    // // for (var i = 0; i < event.images.length; i++) {
    //   form.append("images", event.images[0]);
    // // }

    // return request
    //   .post(eventsUrl)
    //   .attach("images", event.images[0])
    //   .end((err, res) => {
    //     if (err) {
    //       dispatch(addEventFailure(err, event));
    //     } else {
    //       dispatch(addEventSuccess(res.body));
    //     }
    //   });


    return request
      .post(eventsUrl)
      // .send(event)
      .set('Accept', 'application/json')
      .field('text', event.text)
      .field('name', event.name)
      .field('value', event.value)
      .field('userId', event.userId)
      .attach('images', event.images)
      .end((err, res) => {
        if (err) {
          dispatch(addEventFailure(err, event));
          console.log(err)
        } else {
          console.log(res.body)
          console.log(res.file)
          dispatch(addEventSuccess(res.body));
        }
      });
  };
}

export function addEventRequest(event) {
  return {
    type: types.ADD_EVENT_REQUEST,
    event
  };
}

export function addEventSuccess(event) {
  return {
    type: types.ADD_EVENT_SUCCESS,
    event
  };
}

export function addEventFailure(error, event) {
  return {
    type: types.ADD_EVENT_FAILURE,
    error
  };
}

export function deleteEvent(event) {
  return dispatch => {
    dispatch(deleteEventRequest(event));

    return request
      .del(eventsUrl + '/' + event.id)
      .set('Accept', 'application/json')
      .set('images', event.images)
      .end((err, res) => {
        if (err) {
          dispatch(deleteEventFailure(err, event));
        } else {
          dispatch(deleteEventSuccess(res.body));
        }
      });
  };
}

export function deleteEventRequest(event) {
  return {
    type: types.DELETE_EVENT_REQUEST,
    event
  };
}

export function deleteEventSuccess(event) {
  return {
    type: types.DELETE_EVENT_SUCCESS,
    event
  };
}

export function deleteEventFailure(error, event) {
  return {
    type: types.DELETE_EVENT_FAILURE,
    error,
    event
  };
}

export function editEvent(event) {
  return dispatch => {
    dispatch(editEventRequest(event));

    return request
      .post(eventsUrl + '/' + event.id)
      .send(event)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch(editEventFailure(err, event));
        } else {
          dispatch(editEventSuccess(res.body));
        }
      });
  };
}

export function editEventRequest(event) {
  return {
    type: types.EDIT_EVENT_REQUEST,
    event
  };
}

export function editEventSuccess(event) {
  return {
    type: types.EDIT_EVENT_SUCCESS,
    event
  };
}

export function editEventFailure(error, event) {
  return {
    type: types.EDIT_EVENT_FAILURE,
    error,
    event
  };
}
