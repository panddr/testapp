import React, {PropTypes, Component} from 'react';
import EventItem from './EventItem';

export default class EventList extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { events, userId, actions } = this.props;

    const myEvents = events.filter(row => row.userId === userId );
    let list;
    let editable = true;

    list = myEvents.map((event, key) =>
      <EventItem key={key} row={key} id={event.id} editable={editable} event={event} {...actions} />
    );

    return (
      <section className='portfolio-project-list'>
        <ul>
          {list}
        </ul>
      </section>
    );
  }
}
