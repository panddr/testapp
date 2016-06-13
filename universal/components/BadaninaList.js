import React, {PropTypes, Component} from 'react';
import EventItem from './EventItem';
import { Link } from 'react-router';

export default class BadaninaList extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    uploadImage: React.PropTypes.func.isRequired
  };

  render() {
    const { events, userId, actions } = this.props;
    const badanina = events.filter(row => row.artist == 'badanina' );
    let editable = true;

    return (
      <section className='portfolio-project-list'>
        <header className='portfolio-header'>
          <div className='portfolio-links'>
            <h1><Link to='/nasedkin' activeClassName='active'>Владимир Наседкин</Link></h1>
            <h1><Link to='/badanina' activeClassName='active'>Татьяна Баданина</Link></h1>
          </div>
        </header>
        <div>
          <p className="bio">
            <span>Татьяна Васильевна Баданина (род. 16 ноября 1955 года)&nbsp;&mdash; российский </span>
              <a target="_blank" href="https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D1%81%D0%B5%D0%B4%D0%BA%D0%B8%D0%BD,_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%BE%D0%B2%D0%B8%D1%87">художник</a>
              <span>, </span>
              <a href="#">живописец</a>
              <span>, </span>
              <a href="#">график</a>
              <span>, </span>
              <a href="#">автор объектов</a>
              <span> и&nbsp;</span>
              <a href="#">инсталляций</a>
              <span>.</span>
          </p>
          <ul className="portfolio-list">
            {badanina.slice(0,this.props.length).map((event, key) =>
              <EventItem key={key} row={key} id={event.id} event={event} editable={editable} uploadImage={this.props.uploadImage} {...actions} />
            )}
          </ul>
        </div>
      </section>
    );
  }
}
