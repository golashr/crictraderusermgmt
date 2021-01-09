import React, { useState, useContext } from 'react';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { StateContext } from '../../App';

export default function ChangePassword() {
  const initialState = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
  };

  const [localState, setLocalState] = useState(initialState);
  const { globalState, globalStateDispatch } = useContext(StateContext);
  const history = useHistory();
  console.log(globalState);

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
    const { oldPassword, newPassword, confirmPassword } = localState;
    console.log(
      `oldPassword ${oldPassword} newPassword ${newPassword} confirmPassword ${confirmPassword}`,
    );
    try {
      Auth.currentAuthenticatedUser()
        .then(async user => {
          console.log(user);
          await Auth.changePassword(user, oldPassword, newPassword);
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
        <h1>Change Password</h1>
        <FormErrors formerrors={localState.errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="oldPassword"
                placeholder="Old password"
                value={localState.oldPassword}
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
              <button className="button is-success">Change password</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
