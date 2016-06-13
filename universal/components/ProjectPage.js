import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import EventInput from './EventInput';
import marked from 'marked';
import EventItem from './EventItem';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PulseActions from '../actions/PulseActions';

if (process.env.BROWSER) {
  require("../../style/ProjectPage.scss");
}


export default class ProjectPage extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    editEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    uploadImage: PropTypes.func,
    addImagesToStore: PropTypes.func,
    slug: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool
  }

  constructor(props, context){
    super(props, context);
    this.state = {
      editing: false,
      loadMore: false
    };
  }

  rawMarkup() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );
    const rawMarkup = marked(project[0].description.toString(), {sanitize: true});
    return { __html: rawMarkup };
  }

  handleClick() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );

    if (this.props.isLoggedIn) {
      this.setState({ editing: true });

      this.props.addImagesToStore(project[0].images);
    }
  }

  handleSave(event) {
    if (event.title.length === 0) {
      this.props.deleteEvent(event);
    } else {
      this.props.editEvent(event);
    }
    this.setState({ editing: false });
  }

  handleLoadMore() {
    this.setState({ loadMore: true });
  }

  render() {
    let { slug } = this.props.slug;
    const projectArray = this.props.events.filter(project => project.slug === slug );
    const project = projectArray[0];
    const related = this.props.events;
    const artist = project.artist;
    const id = project.id;
    let element;
    let header;

    if (artist == 'nasedkin') {
      header = (
        <div className='portfolio-links'>
          <h1 className="active"><Link to='/nasedkin' activeClassName='active'>Владимир Наседкин</Link></h1>
          <h1><Link to='/badanina' activeClassName='active'>Татьяна Баданина</Link></h1>
        </div>
      );
    } else {
      header = (
        <div className='portfolio-links'>
          <h1><Link to='/nasedkin' activeClassName='active'>Владимир Наседкин</Link></h1>
          <h1 className="active"><Link to='/badanina' activeClassName='active'>Татьяна Баданина</Link></h1>
        </div>
      );
    }

    if (this.state.editing) {
      element = (
        <div>
          <h1>Редактирование</h1>
          <EventInput title={project.title}
                      description={project.description}
                      artist={project.artist}
                      editing={this.state.editing}
                      onSubmit={ (project) => this.handleSave(Object.assign({}, project, { id: id })) }
                      onImageSubmit={ this.props.uploadImage } />
        </div>
      );
    } else {
      let actions = (this.props.isLoggedIn) ?
        <div className="actions">
          <button onClick={::this.handleClick}>✎</button>
          <Link to='/nasedkin' onClick={ () => this.props.deleteEvent(project) }>X</Link>
        </div> :
        null;
      element = (
        <div>
          <section className="project-container">
            <header className='portfolio-header'>
              { header }
            </header>
            <div className="project-info">
              <h1>
                {project.title}
              </h1>
              <div className={ this.state.loadMore ? 'description active' : 'description' }>
                <div dangerouslySetInnerHTML={this.rawMarkup()} />
                <button onClick={::this.handleLoadMore}>Подробнее</button>
              </div>
              {actions}
            </div>
            {project.images.length > 0 ?
              <ul>{project.images.map((image, index) => {
                const imageUrl = 'https://s3-eu-west-1.amazonaws.com/projectsuploads/uploads/images/' + image.key;
                const key = image.key
                return (
                  <li key={index} className={image.size}>
                    <img src={imageUrl} />
                    {image.caption}
                  </li>
                )
              })}
              </ul>
              : null}
          </section>
          <section className="related">
            <h2>Другие проекты</h2>
            <ul className="portfolio-list">
              {related.slice(0,this.props.length).map((event, key) =>
                <EventItem key={key} row={key} id={event.id} event={event} />
              )}
            </ul>
          </section>
        </div>
      );
    }

    return (
      <div>
        {element}
      </div>
    );
  }
}

/**
 * Expose "Smart" Component that is connect-ed to Redux
 */
export default connect(
  state => ({
    images: state.pulseApp.images
  }),
  dispatch => bindActionCreators(PulseActions, dispatch)
)(ProjectPage);
