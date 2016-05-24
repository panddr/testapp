import React, { PropTypes, Component } from 'react';

export default class ProjectPage extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    slug: PropTypes.object.isRequired
  }

  render() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );

    return (
      <div className="portfolio-login">
        <h1>{project[0].title}</h1>
        <p>{project[0].description}</p>
        {project[0].images.length > 0 ?
          <div>{project[0].images.map((image, index) => {
            const imageUrl = 'https://s3-eu-west-1.amazonaws.com/imagesuploads/uploads/images/' + image.key;
            const key = image.key
            return (
              <div key={index}>
                <img src={imageUrl} />
                {image.caption}
              </div>
            )
          })}
          </div>
          : null}
      </div>
    );
  }
}
