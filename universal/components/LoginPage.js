import React, { PropTypes, Component } from 'react';

import EventInput from '../components/EventInput';
import * as PulseActions from '../actions/PulseActions';

export default class LoginPage extends Component {
  static propTypes = {
    submitLogin: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    login: PropTypes.string,
    password: PropTypes.string
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoggedIn: false,
      login: '',
      password: ''
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const login = this.props.login;
    const password = this.props.password;
    if (this.state.login == login && this.state.password == password) {
      this.setState({ isLoggedIn: true });
      this.props.submitLogin(true);
    }
  }

  handleLogout(e) {
    e.preventDefault();
    this.setState({ isLoggedIn: false });
    this.props.submitLogin(false);
  }

  handleLoginChange(e) {
    this.setState({ login: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div className="portfolio-login">
        {!this.props.isLoggedIn ?
          <div className="overlay">
            <form className='form' method="post" action="/api/0/login">
              <h1>Вход</h1>
              <fieldset>
                <input
                  type='text'
                  placeholder='Логин'
                  onChange={::this.handleLoginChange} />
                <input
                  type='password'
                  placeholder='******'
                  onChange={::this.handlePasswordChange} />
                <button
                  type='submit'
                  className='button'
                  onClick={::this.handleSubmit}>
                  Войти
                </button>
              </fieldset>
            </form>
          </div>
          :
          <div>
            <header className="portfolio-header">
              <h1>Админка</h1>
              <button
                type='submit'
                className='button'
                onClick={::this.handleLogout}>
                Выйти
              </button>
            </header>
            <section className='portfolio-form'>
              <EventInput onSubmit={ this.props.addEvent }
                          editing={ true }
                          onImageSubmit={ this.props.uploadImage } />
            </section>
          </div>
        }
      </div>
    );
  }
}
