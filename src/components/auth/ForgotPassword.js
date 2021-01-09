import React, { useState, useContext } from 'react';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { StateContext } from '../../App';

export default function ForgotPassword() {
  const initialState = {
    email: '',
    errors: '',
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

  const forgotPasswordHandler = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, localState);
    if (error) {
      setLocalState({
        error: {
          ...localState.error,
          error,
        },
      });
    }

    // AWS Cognito integration here
    const { email } = localState;
    console.log(`email ${email}`);
    try {
      const data = await Auth.forgotPassword(email);
      console.log(data);
      history.push('/ForgotPasswordVerification');
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
        <h1>Forgot your password?</h1>
        <p>
          Please enter the email address associated with your account and we'll email you a password
          reset link.
        </p>
        <FormErrors formerrors={localState.errors} />

        <form onSubmit={forgotPasswordHandler}>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                type="email"
                className="input"
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
            <p className="control">
              <button className="button is-success">Forgot Password</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
