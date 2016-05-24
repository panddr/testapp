import React, {PropTypes, Component} from 'react';
import moment from 'moment';
import EventInput from './EventInput';
import { Link } from 'react-router';

export default class EventItem extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    event: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    editEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    uploadImage: PropTypes.func,
    uploadedImages: PropTypes.array
  };

  constructor(props, context){
    super(props, context);
    this.state = {
      editing: false
    };
  }

  handleClick() {
    if (this.props.editable) {
      this.setState({ editing: true });
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

  render() {
    const { id, event, editEvent, deleteEvent } = this.props;

    let element;
    let modified = (event.updated) ? event.updated : event.created;

    const imageUrl = (event.images.length > 0) ? 'https://s3-eu-west-1.amazonaws.com/imagesuploads/uploads/images/' + event.images[0].key : null;

    const link = '/project/' + event.slug;

    let images = this.props.uploadedImages.concat(event.images);

    if (this.state.editing) {
      element = (
        <EventInput title={event.title}
                    description={event.description}
                    images={images}
                    uploadedImages={this.props.uploadedImages}
                    editing={this.state.editing}
                    onSubmit={ (event) => this.handleSave(Object.assign({}, event, { id: id })) }
                    onImageSubmit={ this.props.uploadImage } />
      );
    } else {
      let del = (this.props.editable) ?
        <button className='destroy pure-button' onClick={ () => deleteEvent(event) } /> :
        null;
      element = (
        <div className='portfolio-project-item'>
          <Link to={link}>{event.title}</Link>
          <p className='title' onClick={::this.handleClick}>
            {event.title}
          </p>
          {event.images.length > 0 ?
            <div>
              <img src={imageUrl} />
            </div>
            : null}
          {del}
        </div>
      );
    }

    return (
      <li>{element}</li>
    );
  }
}
