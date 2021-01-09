import React, { useState, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { StateContext } from '../../App';

export default function RegisterConfirm() {
  const initialState = {
    username: '',
    verificationCode: '',
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

  const codeVerificationHandler = async event => {
    event.preventDefault();
    clearErrorState();

    // AWS Cognito integration here
    const { username, verificationCode } = localState;
    console.log(`username ${username} verificationCode ${verificationCode}`);
    try {
      await Auth.confirmSignUp(username, verificationCode);
      history.push('/LogIn');
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
        <h1>Confirm Verification code</h1>
        <p>Please enter the verification code sent to your email address below.</p>

        <form onSubmit={codeVerificationHandler}>
          <div className="field">
            <p className="control">
              <input
                type="text"
                className="input"
                id="username"
                aria-describedby="username"
                placeholder="username"
                value={localState.username}
                onChange={onInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <input
                type="text"
                className="input"
                id="verificationCode"
                aria-describedby="verificationCodeHelp"
                placeholder="Enter verification code"
                value={localState.verificationCode}
                onChange={onInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">Confirm Code</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
