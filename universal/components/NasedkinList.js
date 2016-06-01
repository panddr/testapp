import React, {PropTypes, Component} from 'react';
import EventItem from './EventItem';

export default class NasedkinList extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    uploadImage: React.PropTypes.func.isRequired
  };

  render() {
    const { events, userId, actions } = this.props;
    const nasedkin = events.filter(row => row.artist == 'nasedkin' );
    const badanina = events.filter(row => row.artist == 'badanina' );
    let editable = true;

    return (
      <section className='portfolio-project-list'>
        <div>
          <h1>Владимир Наседкин</h1>
          <p>Родился в городе Ивдель Свердловской области. В 1976 закончил художественно-графический факультет Нижнетагильского Государственного Педагогического Института. Учился у Перевалова Л. И. и Черепанова К. П. Работает совместно с женой, художницей Татьяной Баданиной. Дочь Анна Наседкина (1978 г. р.) — иконописец.</p>
          <h2>Биография | Выставки | Контакты</h2>
          <ul>
            {nasedkin.slice(0,this.props.length).map((event, key) =>
              <EventItem key={key} row={key} id={event.id} event={event} editable={editable} uploadImage={this.props.uploadImage} {...actions} />
            )}
          </ul>
        </div>
        <div>
          <h1>Татьяна Баданина</h1>
          <p>Татьяна Баданина родилась в 1955 году в г. Нижний Тагил, Урал. Училась на художественно-графическом факультете Нижнетагильского Государственного Педагогического Института (1973—1978).Учителя: Антоний В.П., Перевалов Л.И., Багаев И.И. Участник выставок с 1978 года.</p>
          <h2>Биография | Выставки | Контакты</h2>
          <ul>
            {badanina.slice(0,this.props.length).map((event, key) =>
              <EventItem key={key} row={key} id={event.id} event={event} editable={editable} uploadImage={this.props.uploadImage} {...actions} />
            )}
          </ul>
        </div>
      </section>
    );
  }
}
