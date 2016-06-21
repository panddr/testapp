import React, {PropTypes, Component} from 'react';
import EventItem from './EventItem';
import { Link } from 'react-router';

export default class BadaninaList extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    uploadImage: React.PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      projects: this.props.events.filter(row => row.artist == 'badanina').filter(row => row.isFeatured == true) || []
    };
  }

  filterByCategory(projects, categorySelected) {
    let results = new Array();
    this.props.events.filter(row => row.artist == 'badanina').map((project) => {
      if (project.categories) {
        project.categories.map((category) => {
          if (category.value == categorySelected && category.checked) {
            results.push(project);
          }
        });
      }
    });

    this.setState({ projects: results });
  }

  filterByCategoryAll(projects) {
    this.setState({ projects: projects });
  }

  render() {
    const { events, userId, actions } = this.props;
    const badanina = events.filter(row => row.artist == 'badanina' ).filter(row => row.isFeatured == true);
    let editable = true;

    return (
      <section className='portfolio-project-list'>
        <header className='portfolio-header'>
          <div className='portfolio-links'>
            <h1><Link to='/nasedkin' activeClassName='active'>Владимир Наседкин</Link></h1>
            <h1><Link to='/badanina' activeClassName='active' onClick={::this.filterByCategoryAll.bind(this, badanina)}>Татьяна Баданина</Link></h1>
          </div>
        </header>
        <div>
          <p className="bio">
            <span>Татьяна Васильевна Баданина&nbsp;&mdash; российский </span>
              <a target="_blank" href="https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D1%81%D0%B5%D0%B4%D0%BA%D0%B8%D0%BD,_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%BE%D0%B2%D0%B8%D1%87">художник</a>
              <span>, </span>
              <Link to={'/badanina/painting'} activeClassName='active' onClick={::this.filterByCategory.bind(this, badanina, "painting")}>
                живописец
              </Link>
              <span>, </span>
              <Link to={'/badanina/graphics'} activeClassName='active' onClick={::this.filterByCategory.bind(this, badanina, "graphics")}>
                график
              </Link>
              <span>, автор </span>
              <Link to={'/badanina/object'} activeClassName='active' onClick={::this.filterByCategory.bind(this, badanina, "object")}>
                объектов
              </Link>
              <span> и&nbsp;</span>
              <Link to={'/badanina/installation'} activeClassName='active' onClick={::this.filterByCategory.bind(this, badanina, "installation")}>
                инсталляций
              </Link>
              <span>.</span>
          </p>
          <ul className="portfolio-list">
            {this.state.projects.slice(0,this.props.length).map((event, key) =>
              <EventItem key={key} row={key} id={event.id} event={event} editable={editable} uploadImage={this.props.uploadImage} {...actions} />
            )}
          </ul>
        </div>
      </section>
    );
  }
}
