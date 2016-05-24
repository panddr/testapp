import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

export default class EventInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onImageSubmit: PropTypes.func.isRequired,
    titleLabel: PropTypes.string,
    descriptionLabel: PropTypes.string,
    editing: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: [],
      title: this.props.title || '',
      description: this.props.description || '',
      images: this.props.images || [],
      uploadedImages: this.props.uploadedImages || []
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
      this.props.onSubmit({title: this.state.title, description: this.state.description, userId: 'f5f5756d-628b-4eee-85fb-a0b32b317d42', images: this.state.images});
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
    const images = this.state.images.slice();
    images.splice(index,1,image);
    this.setState({ images: images });
  }

  onDrop(files) {
    this.props.onImageSubmit({files: files});

    setTimeout(() => {
      this.setState({
        images: this.props.images
      });
    }, 3000)
  }

  render() {
    console.log('images',this.state.images)
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
              <div>{this.props.images.map((image, index) => {
                const url = 'https://s3-eu-west-1.amazonaws.com/imagesuploads/uploads/images/' + image.key;
                const key = image.key
                const dimensions = image.dimensions

                return (
                  <div key={index}>
                    <img src={url} className={dimensions} />
                    <input value={image.caption} onChange={ this.handleCaptionChange.bind(this, index, image) } />
                  </div>
                )
              })}
              </div>
              : null}
            <button type='submit' className='button' onClick={::this.handleSubmit}>{saveText}</button>
          </fieldset>
        </form>
      </div>
    );
  }
}
