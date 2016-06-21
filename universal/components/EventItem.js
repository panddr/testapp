import React, {PropTypes, Component} from 'react';
import moment from 'moment';
import EventInput from './EventInput';
import { Link } from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PulseActions from '../actions/PulseActions';

export default class EventItem extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    event: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    editEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    uploadImage: PropTypes.func,
    addImagesToStore: PropTypes.func,
    images: React.PropTypes.array
  };

  constructor(props, context){
    super(props, context);
    this.state = {
      editing: false
    };
  }

  handleClick() {
    const { event } = this.props;

    if (this.props.editable) {
      this.setState({ editing: true });

      this.props.addImagesToStore(event.images);
    }
  }

  rawMarkupTitle() {
    let { event } = this.props;
    const rawMarkup = event.titleFormated;
    return { __html: rawMarkup };
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

    const imageUrl = (event.images.length > 0) ? 'https://s3-eu-west-1.amazonaws.com/projectsuploads/uploads/images/' + event.images[0].key : null;

    const link = '/project/' + event.slug;

    return (
      <li className='portfolio-project-item'>
        <article>
          <Link to={link}>
            {event.images.length > 0 ?
              <div>
                <img src={imageUrl} />
              </div>
              : null}
            <h2><span dangerouslySetInnerHTML={this.rawMarkupTitle()} /></h2>
            {event.categories ?
              <div className="categories">
                {event.categories.map((category, index) => {
                  if (category.checked) {
                    return (
                      <span key = { index } >
                        { category.labelText }
                        ,&nbsp;
                      </span>
                    );
                  }
                })}
              </div>
              : null}
            <span className="date">{event.yearStart}</span>
            {event.yearEnd ?
              <span className="date">&ndash;{event.yearStart}</span>
              : null}
          </Link>
        </article>
      </li>
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
)(EventItem);
