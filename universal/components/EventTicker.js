import React, {PropTypes, Component} from 'react';
import EventItem from './EventItem';

export default class EventTicker extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    uploadImage: React.PropTypes.func.isRequired
  };

  render() {
    const { events, userId, actions } = this.props;
    const otherEvents = events.filter(row => row.userId !== userId );
    let editable = true;

    return (
      <section className='Pulse-eventList'>
        <div className='Pulse-eventList-list'>
          <ul>
            {otherEvents.slice(0,this.props.length).map((event, key) =>
              <EventItem key={key} row={key} id={event.id} event={event} editable={editable} uploadImage={this.props.uploadImage} {...actions} />
            )}
          </ul>
        </div>
      </section>
    );
  }
}
