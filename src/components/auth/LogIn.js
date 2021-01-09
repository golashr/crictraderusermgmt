import React, { useState, useContext } from 'react';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { StateContext } from '../../App';

export default function LogIn() {
  const initialState = {
    username: '',
    password: '',
    error: '',
  };
  const [localState, setLocalState] = useState(initialState);
  const { globalState, globalStateDispatch } = useContext(StateContext);
  const history = useHistory();

  const clearErrorState = () => {
    setLocalState({
      ...localState,
      error: '',
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const newError = Validate(event, {
      username: localState.username,
      password: localState.password,
    });
    if (newError) {
      console.log(newError);
      setLocalState({
        ...localState,
        error: newError,
      });
    }

    // AWS Cognito integration here
    console.log(`username ${localState.username} password ${localState.password}`);
    try {
      const user = await Auth.signIn(localState.username, localState.password);
      console.log(user);
      console.log(`username ${user.username} email ${user.attributes.email}`);
      globalStateDispatch({
        type: 'AUTH_SUCCESS',
        state: { username: user.username, email: user.attributes.email },
      });
      history.push('/Welcome');
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
          isAuthenticated: false,
          error,
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
        <h1>Log in</h1>
        <FormErrors formerrors={localState.error} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter username or email"
                value={localState.username}
                onChange={onInputChange}
              />
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
            <p className="control">
              <a href="/forgotpassword">Forgot password?</a>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">Login</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
