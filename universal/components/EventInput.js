import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PulseActions from '../actions/PulseActions';

import Switcher from "./Switcher";

export default class EventInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onImageSubmit: PropTypes.func.isRequired,
    titleLabel: PropTypes.string,
    descriptionLabel: PropTypes.string,
    addImagesToStore: PropTypes.func,
    editing: PropTypes.bool,
    images: React.PropTypes.array
  };

  componentDidMount() {
    this.placeholder = document.createElement("li");
    this.placeholder.className = "placeholder";

    setTimeout(() => {
      this.handleCoverDimensions();
    }, 300);
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: [],
      title: this.props.title || '',
      description: this.props.description || '',
      isFeatured: this.props.isFeatured || true,
      artist: this.props.artist || 'nasedkin',
      categories: this.props.categories || optionsCategories,
      yearStart: this.props.yearStart || '',
      yearEnd: this.props.yearEnd || '',
      coverWidth: this.props.coverWidth || '',
      coverHeight: this.props.coverHeight || ''
    };
  }

  handleSubmit(e) {
    let errors;
    e.preventDefault();

    if (this.state.title.length === 0) {
      errors = ['You have not said what happened!'];
    }

    if (errors && errors.length > 0) {
      this.setState({errors: errors});
    } else {
      this.props.onSubmit({title: this.state.title, description: this.state.description, artist: this.state.artist, isFeatured: this.state.isFeatured, coverWidth: this.state.coverWidth, coverHeight: this.state.coverHeight, categories: this.state.categories, yearStart: this.state.yearStart, yearEnd: this.state.yearEnd, userId: 'f5f5756d-628b-4eee-85fb-a0b32b317d42', images: this.props.images});
      this.setState({title: ''});
    }
  }

  handleCoverDimensions() {
    const img = document.querySelectorAll(".image img")[0];
    if (img) {
      this.setState({ coverWidth: img.naturalWidth.toString() });
      this.setState({ coverHeight: img.naturalHeight.toString() });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.handleCoverDimensions();
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  handleArtistChange(e) {
    this.setState({ artist: e });
  }

  handleCategoriesChange(checked, index, e) {
    let categories = this.state.categories;
    e.target.value;

    if (checked) {
      categories[index].checked = false;
      this.setState({ categories: categories });
    } else {
      categories[index].checked = true;
      this.setState({ categories: categories });
    }
  }

  handleFeaturedChange(e) {
    this.setState({ isFeatured: !this.state.isFeatured });
  }

  handleYearStartChange(e) {
    this.setState({ yearStart: e.target.value });
  }

  handleYearEndChange(e) {
    this.setState({ yearEnd: e.target.value });
  }

  handleCaptionChange(index, image, e) {
    image.caption = e.target.value;
    const images = this.props.images.slice();
    images.splice(index,1,image);

    this.props.addImagesToStore(images);
  }

  handleSizeChange(index, image, e) {
    image.size = e;
    const images = this.props.images.slice();
    images.splice(index,1,image);

    this.props.addImagesToStore(images);
  }

  handleImageDelete(index, image, e) {
    const images = this.props.images.slice();
    e.preventDefault();
    images.splice(index,1);
    this.props.removeImagesFromStore(images);
  }

  onDrop(files) {
    this.props.onImageSubmit({files: files});
  }

  handleDragStart(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';

    // Firefox requires calling dataTransfer.setData
    // for the drag to properly work
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  handleDragEnd(e) {
    this.dragged.style.display = "block";
    this.dragged.parentNode.removeChild(this.placeholder);

    // Update state
    const images = this.props.images.slice();
    const from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);
    if (from < to) to--;
    if (this.nodePlacement == "after") to++;
    images.splice(to, 0, images.splice(from, 1)[0]);

    this.props.addImagesToStore(images);
  }

  handleDragOver(e) {
    e.preventDefault();

    this.dragged.style.display = "none";
    if (e.target.className == "placeholder") return;
    if (e.target.nodeName !== "LI") return;
    this.over = e.target;

    var relY = e.clientY - this.over.offsetTop;
    var height = this.over.offsetHeight / 2;
    var parent = e.target.parentNode;

    if (relY > height) {
      this.nodePlacement = "after";
      parent.insertBefore(this.placeholder, e.target.nextElementSibling);
    } else if (relY < height) {
      this.nodePlacement = "before"
      parent.insertBefore(this.placeholder, e.target);
    }
  }

  render() {
    let self = this;
    let saveText = (this.props.editing) ? 'Сохранить' : 'Добавить';

    return (
      <div>
        <form className='form' encType="multipart/form-data" method="post" action="/api/0/events">
          <fieldset>
            <section>
              <input type='text' placeholder='Название проекта' value={this.state.title} onChange={::this.handleTitleChange} />
            </section>
            <section>
              <p className="tip">Добавьте описание проекта (первый параграф показывается большим, остальные параграфы можно будет увидеть, нажав на кнопку «ПОДРОБНЕЕ»):</p>
              <textarea className="description" placeholder='Описание' value={this.state.description} onChange={::this.handleDescriptionChange} />
            </section>
            <section>
              <p className="tip">Выберите художника:</p>
              <Switcher
                options  = { optionsArtist }
                type     = 'radio'
                value    = { this.state.artist }
                onChange = { this.handleArtistChange.bind(this) } />
            </section>
            <section>
              <p className="tip">Выберите одну или несколько категорий, соотвествующих проекту:</p>
              <div className="portfolio-switcher portfolio-switcher-categories">
                {this.state.categories.map((category, index) => {
                  const checked = category.checked;
                  return (
                    <label key = { index } >
                      <input type="checkbox" checked={checked} value={category.value} onChange={::this.handleCategoriesChange.bind(this, checked, index)} />
                      { category.labelText }
                    </label>
                  );
                })}
              </div>
            </section>
            <section>
              <p className="tip">Выберите год начала и окончания(если требуется) проекта:</p>
              <div className="years">
                <input type='text' placeholder='Год' value={this.state.yearStart} onChange={::this.handleYearStartChange} />
                <input type='text' placeholder='Год окончания' value={this.state.yearEnd} onChange={::this.handleYearEndChange} />
              </div>
            </section>
            <section>
              <div className="featured">
                <label>
                  <input type='checkbox' checked={this.state.isFeatured} value={this.state.isFeatured} onChange={::this.handleFeaturedChange} />
                  Вывести на главную
                </label>
              </div>
            </section>
            <div className="portfolio-drop-zone">
              <p className="tip">Добавьте картинки:</p>
              <Dropzone
                onDrop={::this.onDrop}
                onImageSubmit={this.props.onImageSubmit}
                accept={'image/*'} >
                <div>Перетащите картинку сюда или выберите файл.</div>
              </Dropzone>
            </div>
            {this.props.images.length > 0 ?
              <div>
                <ul className="form-images" onDragOver = { this.handleDragOver.bind(this) }>{this.props.images.map((image, index) => {
                  const url = 'https://s3-eu-west-1.amazonaws.com/nasedkinbadanina/uploads/images/' + image.key;

                  return (
                    <li
                      onDragStart = { this.handleDragStart.bind(this) }
                      onDragEnd = { this.handleDragEnd.bind(this) }
                      data-id = {index}
                      key = {index} >
                      <div className="image"><img src={url} /></div>
                      <textarea
                        placeholder = "Подпись"
                        value = {image.caption}
                        onChange = { this.handleCaptionChange.bind(this, index, image) } />
                      <div>
                        <Switcher
                          options  = { optionsImageSize }
                          type     = 'radio'
                          value    = { image.size }
                          onChange = { this.handleSizeChange.bind(this, index, image) } />
                      </div>
                      <button onClick={::this.handleImageDelete.bind(this, index, image)}>X</button>
                    </li>
                  )
                })}
                </ul>
              </div>
              : null}
            <button type='submit' className='button' onClick={::this.handleSubmit}>{saveText}</button>
          </fieldset>
        </form>
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
)(EventInput);

const optionsImageSize = [
  {
    value: "small",
    labelText: "S",
  },
  {
    value: "medium",
    labelText: "M"
  },
  {
    value: "large",
    labelText: "L"
  }
]

const optionsArtist = [
  {
    value: "nasedkin",
    labelText: "Владимир Наседкин",
  },
  {
    value: "badanina",
    labelText: "Татьяна Баданина"
  }
]

const optionsCategories = [
  {
    value: "painting",
    labelText: "Живопись",
    checked: false
  },
  {
    value: "graphics",
    labelText: "Графика",
    checked: false
  },
  {
    value: "sculpture",
    labelText: "Скульптура",
    checked: false
  },
  {
    value: "photography",
    labelText: "Фотография",
    checked: false
  },
  {
    value: "object",
    labelText: "Объект",
    checked: false
  },
  {
    value: "installation",
    labelText: "Инсталяция",
    checked: false
  }
]
