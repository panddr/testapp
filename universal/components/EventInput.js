import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import { VALUE_CLASSES } from '../constants/ActionTypes.js';

export default class EventInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    textLabel: PropTypes.string,
    nameLabel: PropTypes.string,
    valueLabel: PropTypes.string,
    editing: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: [],
      text: this.props.text || '',
      name: this.props.name || '',
      files: this.props.files || '',
      images: this.props.images || '',
      value: this.props.value || 50
    };
  }

  handleSubmit(e) {
    let errors;
    e.preventDefault();

    if (this.state.text.length === 0) {
      errors = ['You have not said what happened!'];
    }

    if (this.state.value < 1 || this.state.value > 100) {
      errors = [...errors, 'You have somewhere set an invalid value!'];
    }

    if (errors && errors.length > 0) {
      this.setState({errors: errors});
    } else {
      this.props.onSubmit({text: this.state.text, name: this.state.name, files: this.state.files, images: this.state.images, value: this.state.value, userId: this.props.userId});
      this.setState({text: '', value: 50});
    }
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleValueChange(e) {
    this.setState({ value: parseInt(e.target.value, 10) });
  }

  handleImagesChange(e) {
    this.setState({ images: e.target.files[0] });
  }

  onDrop(files) {
    this.setState({ files: files });
    console.log('Received files: ', files);
  }

  render() {
    let self = this;
    let saveText = (this.props.editing) ? 'Save' : 'Add';
    let className = Object.keys(VALUE_CLASSES).reduce((current, key) => {
      if (!current && self.state.value <= key) {
        return VALUE_CLASSES[key];
      } else {
        return current;
      }
    }, null);

    return (
      <form className='Pulse-eventInput pure-form' enctype="multipart/form-data">
        <fieldset>
          <input type='text' placeholder={this.props.textLabel} autoFocus='true' value={this.state.text} onChange={::this.handleTextChange} />
          <input type='text' placeholder={this.props.nameLabel} value={this.state.name} onChange={::this.handleNameChange} />
          <label htmlFor='value'>{this.props.valueLabel}</label>
          <input className={className} type='range' id='value' min='1' max='100' value={this.state.value} onChange={::this.handleValueChange} />
          <span className='Pulse-eventInput-value'>{this.state.value}</span>
          <input type="file" name="images" onChange={::this.handleImagesChange} />
          <Dropzone onDrop={::this.onDrop}>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <button type='submit' className='save pure-button' onClick={::this.handleSubmit}>{saveText}</button>
        </fieldset>
      </form>
    );
  }
}
