import React, { useState, useContext } from 'react';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { StateContext } from '../../App';

export default function Register() {
  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    passwordmatch: false,
  };

  const [localState, setLocalState] = useState(initialState);
  const { globalState, globalStateDispatch } = useContext(StateContext);
  const history = useHistory();

  const clearErrorState = () => {
    setLocalState({
      ...localState,
      error: '',
      passwordmatch: false,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, localState);
    if (error) {
      setLocalState({
        ...localState,
        error,
      });
    }

    // AWS Cognito integration here
    const { username, password, email } = localState;
    console.log(`username ${username} password ${password} email ${email}`);
    try {
      const signUpResponse = await Auth.signUp({
        username: username,
        password,
        attributes: {
          email,
        },
      });
      console.log('signUpResponse', signUpResponse);
      history.push('/RegisterConfirm');
    } catch (err) {
      console.log(`${err.message}`);
      let error = null;
      !err.message ? (error = { message: 'cognito error' }) : (error = err);
      setLocalState({
        ...localState,
        error,
      });
      globalStateDispatch({
        type: 'COGNITO_ERROR',
        state: {
          ...globalState,
          error,
        },
      });
      setLocalState({
        error: {
          ...localState.error,
          cognito: error,
        },
      });
    }
  };

  const onInputChange = event => {
    setLocalState({
      ...localState,
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove('is-danger');
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Register</h1>
        <FormErrors formerrors={localState.error} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter username"
                value={localState.username}
                onChange={onInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="email"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={localState.email}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="password"
                placeholder="Password"
                value={localState.password}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={localState.confirmPassword}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">Register</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
