import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PulseActions from '../actions/PulseActions';

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
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: [],
      title: this.props.title || '',
      description: this.props.description || ''
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
      this.props.onSubmit({title: this.state.title, description: this.state.description, userId: 'f5f5756d-628b-4eee-85fb-a0b32b317d42', images: this.props.images});
      this.setState({title: ''});
    }
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  handleCaptionChange(index, image, e) {
    image.caption = e.target.value;
    const images = this.props.images.slice();
    images.splice(index,1,image);

    this.props.addImagesToStore(images);
  }

  handleImageDelete(index, image, e) {
    const images = this.props.images.slice();
    images.splice(index,1);
    this.props.removeImagesFromStore(images);
  }

  onDrop(files) {
    this.props.onImageSubmit({files: files});
  }

  handleDragStart(e) {
    console.log('drag start')
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';

    // Firefox requires calling dataTransfer.setData
    // for the drag to properly work
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  handleDragEnd(e) {
    console.log('drag end')

    this.dragged.style.display = "block";
    this.dragged.parentNode.removeChild(this.placeholder);

    // Update state
    const images = this.props.images.slice();
    console.log('before', images)
    const from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);
    if (from < to) to--;
    if (this.nodePlacement == "after") to++;
    images.splice(to, 0, images.splice(from, 1)[0]);
    console.log('after', images)
    console.log('from', from)
    console.log('to', to)

    this.props.addImagesToStore(images);
  }

  handleDragOver(e) {
    console.log('drag over')
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
            <input type='text' placeholder={this.props.titleLabel} value={this.state.title} onChange={::this.handleTitleChange} />
            <textarea placeholder={this.props.descriptionLabel} value={this.state.description} onChange={::this.handleDescriptionChange} />
            {this.props.editing ?
              <Dropzone
                onDrop={::this.onDrop}
                onImageSubmit={this.props.onImageSubmit}
                accept={'image/*'}
                disableClick >
                <div>Try dropping some files here, or click to select files to upload.</div>
              </Dropzone>
              : null}
            {this.props.images.length > 0 ?
              <ul onDragOver = { this.handleDragOver.bind(this) }>{this.props.images.map((image, index) => {
                const url = 'https://s3-eu-west-1.amazonaws.com/projectsuploads/uploads/images/' + image.key;

                return (
                  <li
                    onDragStart = { this.handleDragStart.bind(this) }
                    onDragEnd = { this.handleDragEnd.bind(this) }
                    data-id = {index}
                    key = {index} >
                    <img src={url} />
                    <input value={image.caption} onChange={ this.handleCaptionChange.bind(this, index, image) } />
                    <button onClick={::this.handleImageDelete.bind(this, index, image)}>Удалить</button>
                  </li>
                )
              })}
              </ul>
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
