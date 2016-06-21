import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import EventItem from './EventItem';

export default class NasedkinList extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    uploadImage: React.PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      projects: this.props.events.filter(row => row.artist == 'nasedkin').filter(row => row.isFeatured == true) || []
    };
  }

  filterByCategory(projects, categorySelected) {
    let results = new Array();
    this.props.events.filter(row => row.artist == 'nasedkin').map((project) => {
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
    const { events, actions } = this.props;
    const nasedkin = events.filter(row => row.artist == 'nasedkin').filter(row => row.isFeatured == true);

    let editable = true;

    return (
      <section className='portfolio-project-list'>
        <header className='portfolio-header'>
          <div className='portfolio-links'>
            <h1><Link to='/nasedkin' activeClassName='active' onClick={::this.filterByCategoryAll.bind(this, nasedkin)}>Владимир Наседкин</Link></h1>
            <h1><Link to='/badanina' activeClassName='active'>Татьяна Баданина</Link></h1>
          </div>
        </header>
        <div>
          <p className="bio">
            <span>Владимир Никитович Наседкин&nbsp;&mdash; российский </span>
            <a target="_blank" href="https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D1%81%D0%B5%D0%B4%D0%BA%D0%B8%D0%BD,_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%BE%D0%B2%D0%B8%D1%87">художник</a>
            <span>, </span>
            <Link to={'/nasedkin/painting'} activeClassName='active' onClick={::this.filterByCategory.bind(this, nasedkin, "painting")}>
              живописец
            </Link>
            <span>, </span>
            <Link to={'/nasedkin/graphics'} activeClassName='active' onClick={::this.filterByCategory.bind(this, nasedkin, "graphics")}>
              график
            </Link>
            <span>, </span>
            <Link to={'/nasedkin/sculpture'} activeClassName='active' onClick={::this.filterByCategory.bind(this, nasedkin, "sculpture")}>
              скульптор
            </Link>
            <span>, </span>
            <Link to={'/nasedkin/photography'} activeClassName='active' onClick={::this.filterByCategory.bind(this, nasedkin, "photography")}>
              фотограф
            </Link>
            <span>, автор </span>
            <Link to={'/nasedkin/object'} activeClassName='active' onClick={::this.filterByCategory.bind(this, nasedkin, "object")}>
              объектов
            </Link>
            <span> и&nbsp;</span>
            <Link to={'/nasedkin/installation'} activeClassName='active' onClick={::this.filterByCategory.bind(this, nasedkin, "installation")}>
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
        <footer className="portfolio-footer">
          <a target="_blank" href="https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D1%81%D0%B5%D0%B4%D0%BA%D0%B8%D0%BD,_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%BE%D0%B2%D0%B8%D1%87#.D0.9A.D0.9E.D0.9B.D0.9B.D0.95.D0.9A.D0.A6.D0.98.D0.98">Выставки</a>
          <a href="mailto:nasedkin@gmail.com">nasedkin@gmail.com</a>
          +7 925 186 60 02
        </footer>
      </section>
    );
  }
}
