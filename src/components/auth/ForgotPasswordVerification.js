import React, { useState, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { StateContext } from '../../App';

export default function ForgotPasswordVerification() {
  const initialState = {
    username: '',
    verificationCode: '',
    newPassword: '',
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

  const handleForgotPassword = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    // AWS Cognito integration here
    const { username, verificationCode, newPassword } = localState;
    console.log(
      `username ${username} verificationCode ${verificationCode} newPassword ${newPassword}`,
    );
    try {
      Auth.forgotPasswordSubmit(username, verificationCode, newPassword)
        .then(data => {
          console.log(data);
          history.push('/LogIn');
        })
        .catch(err => console.log(err));
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
        <h1>Set new password</h1>
        <p>
          Please enter the verification code sent to your email address below, your email address
          and a new password.
        </p>
        <form onSubmit={handleForgotPassword}>
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
            <p className="control has-icons-left">
              <input
                className="input"
                type="username"
                id="username"
                aria-describedby="emailHelp"
                placeholder="Enter user name"
                value={localState.username}
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
                type="password"
                className="input"
                id="newPassword"
                placeholder="New password"
                value={localState.newPassword}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">Change Password</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
