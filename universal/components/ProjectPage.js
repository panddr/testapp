import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import marked from 'marked';
import EventItem from './EventItem';

if (process.env.BROWSER) {
  require("../../style/ProjectPage.scss");
}


export default class ProjectPage extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    slug: PropTypes.object.isRequired
  }

  rawMarkup() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );
    const rawMarkup = marked(project[0].description.toString(), {sanitize: true});
    return { __html: rawMarkup };
  }

  render() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );
    const related = this.props.events;
    const artist = project[0].artist;
    let element;

    if (artist == 'nasedkin') {
      element = (
        <div className='portfolio-links'>
          <h1 className="active"><Link to='/nasedkin' activeClassName='active'>Владимир Наседкин</Link></h1>
          <h1><Link to='/badanina' activeClassName='active'>Татьяна Баданина</Link></h1>
        </div>
      );
    } else {
      element = (
        <div className='portfolio-links'>
          <h1><Link to='/nasedkin' activeClassName='active'>Владимир Наседкин</Link></h1>
          <h1 className="active"><Link to='/badanina' activeClassName='active'>Татьяна Баданина</Link></h1>
        </div>
      );
    }

    return (
      <div className="project-container">
        <header className='portfolio-header'>
          { element }
        </header>
        <div className="project-info">
          <h1>{project[0].title}</h1>
          <div className="description" dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
        {project[0].images.length > 0 ?
          <ul>{project[0].images.map((image, index) => {
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
        <section className="related">
          <ul>
            {related.slice(0,this.props.length).map((event, key) =>
              <EventItem key={key} row={key} id={event.id} event={event} />
            )}
          </ul>
        </section>
      </div>
    );
  }
}
