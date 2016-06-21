import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import EventInput from './EventInput';
import EventItem from './EventItem';
import DocumentMeta from 'react-document-meta';

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
      deleting: false,
      loadMore: false,
      related: [],
      projectCategories: [],
      imgWidthMeta: '',
      imgHeightMeta: ''
    };
  }

  componentDidMount() {
    let { slug } = this.props.slug;
    const projectArray = this.props.events.filter(project => project.slug === slug);

    const project = projectArray[0];
    const artist = project.artist;
    const categories = project.categories;
    const related = this.props.events.filter(project => project.artist === artist).filter(project => project.slug != slug);
    this.showRelated(related, categories);

    this.setState({ loadMore: false });

    const img = document.querySelectorAll(".project-container ul li .image img")[0];
    this.setState({ imgWidthMeta: img.naturalWidth });
    this.setState({ imgHeightMeta: img.naturalHeight });
  }

  componentWillReceiveProps(nextProps) {
    let { slug } = nextProps.slug;
    const projectArray = nextProps.events.filter(project => project.slug === slug);

    const project = projectArray[0];
    const artist = project.artist;
    const categories = project.categories;
    const related = nextProps.events.filter(project => project.artist === artist).filter(project => project.slug != slug);
    this.showRelated(related, categories);

    this.setState({ loadMore: false });
  }

  rawMarkup() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );
    const rawMarkup = project[0].descriptionFormated;
    return { __html: rawMarkup };
  }

  rawMarkupTitle() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );
    const rawMarkup = project[0].titleFormated;
    return { __html: rawMarkup };
  }

  handleClick() {
    let { slug } = this.props.slug;
    const project = this.props.events.filter(project => project.slug === slug );

    if (this.props.isLoggedIn) {
      this.setState({ editing: true });

      this.props.addImagesToStore(project[0].images);
      window.scrollTo(0, 0);
    }
  }

  handleConfirm() {
    console.log(this.state.deleting)
    this.setState({ deleting: !this.state.deleting });
  }

  showRelated(related, categories) {
    let results = new Array();
    let projectCategories = new Array();

    categories.map((category) => {
      if (category.checked) {
        projectCategories.push(category.value);
      }
    });

    related.map((project) => {
      if (project.categories) {
        project.categories.map((category) => {
          projectCategories.map((projectCategory) => {
            if (category.value === projectCategory && category.checked && !results.find(result => result.title === project.title)) {
              results.push(project);
            }
          })
        })
      }
    });

    this.setState({ related: results });
    this.setState({ projectCategories: projectCategories });
  }

  handleCancel() {
    this.setState({ editing: false });
    window.scrollTo(0, 0);
  }

  handleImageZoom(e) {
    const img = e.target;
    const body = document.getElementsByTagName("body")[0];

    if (img.parentNode.classList.contains("active")) {
      img.parentNode.classList.remove("active");
      body.classList.remove("hidden");

      img.setAttribute('style','transform:translate(0,0) scale(1); -webkit-transform:translate(0,0) scale(1); width:100%; height:auto;');
    } else {
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      const wDimensions = wWidth/wHeight;

      const imgNaturalWidth = img.naturalWidth;
      const imgNaturalHeight = img.naturalHeight;

      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgDimensions = imgWidth/imgHeight;

      img.parentNode.classList.add("active");
      body.classList.add("hidden");

      const x = wWidth/2 - img.offsetLeft - imgWidth/2;
      const y = wHeight/2 - img.offsetTop - imgHeight/2 + window.pageYOffset;
      let scale;

      if (wDimensions > 1) {
        if (wHeight > imgNaturalHeight) {
          scale = imgNaturalHeight/imgHeight;
        } else {
          scale = wHeight/imgHeight;
        }

        img.setAttribute('style','transform:translate(' + x + 'px,' + y + 'px) scale(' + scale + '); -webkit-transform:translate(' + x + 'px,' + y + 'px scale(' + scale + '); width:100%; height:auto;');
      } else {
        if (wWidth > imgNaturalWidth) {
          scale = imgNaturalWidth/imgWidth;
        } else {
          scale = wWidth/imgWidth;
        }

        img.setAttribute('style','transform:translate(' + x + 'px,' + y + 'px) scale(' + scale + '); -webkit-transform:translate(' + x + 'px,' + y + 'px scale(' + scale + '); width:100%; height:auto;');
      }
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
    const projectArray = this.props.events.filter(project => project.slug === slug);

    const project = projectArray[0];
    const artist = project.artist;
    const id = project.id;
    let element;
    let header;
    let confirmDeleting;

    const descriptionShortent = project.description.substring(0, 160);
    const urlMeta = 'http://nasedkin-badanina.com/project/' + slug;
    const imgMeta = 'https://s3-eu-west-1.amazonaws.com/projectsuploads/uploads/images/' + project.images[0].key;

    const meta = {
      title: project.title,
      description: descriptionShortent,
      canonical: urlMeta,
      meta: {
        charset: 'utf-8',
        name: {
          keywords: 'Наседкин,Владимир,Баданина,Татьяна'
        },
        property: {
          "og:title": project.title,
          "og:url": urlMeta,
          "og:description": descriptionShortent,
          "og:image": imgMeta,
          "og:image:width": this.state.imgWidthMeta,
          "og:image:height": this.state.imgHeightMeta,
          "twitter:title": project.title,
          "twitter:description": descriptionShortent,
          "twitter:image": imgMeta,
          "twitter:image:width": this.state.imgWidthMeta,
          "twitter:image:height": this.state.imgHeightMeta,
          "twitter:card": "summary_large_image"
        }
      }
    };

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

    if (this.state.deleting) {
      confirmDeleting = (
        <div className="confirm-deleting">
          Удалить проект?
          <button onClick={ () => this.props.deleteEvent(project) }>Да</button>
          <button onClick={ ::this.handleConfirm }>Нет</button>
        </div>
      );
    } else {
      confirmDeleting = (
        <button onClick={ ::this.handleConfirm }>X</button>
      );
    }

    if (this.state.editing) {
      element = (
        <div>
          <h1>Редактирование</h1>
          <EventInput title={project.title}
                      description={project.description}
                      yearStart={project.yearStart}
                      yearEnd={project.yearEnd}
                      artist={project.artist}
                      isFeatured={project.isFeatured}
                      categories={project.categories}
                      editing={this.state.editing}
                      onSubmit={ (project) => this.handleSave(Object.assign({}, project, { id: id })) }
                      onImageSubmit={ this.props.uploadImage } />
          <button type='submit' className='cancel-button' onClick={::this.handleCancel}>Отменить</button>
        </div>
      );
    } else {
      let actions = (this.props.isLoggedIn) ?
        <div className="actions">
          <button className="button-edit" onClick={::this.handleClick}>✎</button>
          { confirmDeleting }
        </div> :
        null;
      element = (
        <div>
          <section className="project-container">
            <header className='portfolio-header'>
              { header }
            </header>
            <div className="project-info">
              <div className={ this.state.loadMore ? 'description active' : 'description' }>
                <h1>
                  <span dangerouslySetInnerHTML={this.rawMarkupTitle()} />
                  <sup>
                    <span className="date">{project.yearStart}</span>
                    {project.yearEnd ?
                      <span className="date">&ndash;{project.yearStart}</span>
                      : null}
                  </sup>
                </h1>
                <div className="text" dangerouslySetInnerHTML={this.rawMarkup()} />
                <button className="button-load-more" onClick={::this.handleLoadMore}>Подробнее</button>
                {actions}
              </div>
            </div>
            {project.images.length > 0 ?
              <ul>{project.images.map((image, index) => {
                const imageUrl = 'https://s3-eu-west-1.amazonaws.com/projectsuploads/uploads/images/' + image.key;
                const key = image.key
                return (
                  <li key={index} className={image.size}>
                    <div className="image"><img onClick={::this.handleImageZoom} src={imageUrl} /></div>
                    {image.caption}
                  </li>
                )
              })}
              </ul>
              : null}
          </section>
          {this.state.related.length > 0 ?
            <section className="related">
              <h2>Похожие проекты</h2>
              <ul className="portfolio-list">
                {this.state.related.slice(0,this.props.length).map((event, key) =>
                  <EventItem key={key} row={key} id={event.id} event={event} />
                )}
              </ul>
            </section>
          : null}
        </div>
      );
    }

    return (
      <div>
        <DocumentMeta {...meta} />
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
