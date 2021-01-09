import React, { useContext } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { StateContext } from '../../App';

export default function Welcome() {
  const { globalState, globalStateDispatch } = useContext(StateContext);
  console.log(globalState);
  const history = useHistory();
  const handleSignOut = () => {
    console.log('Sign Out');
    // AWS Cognito integration here
    try {
      Auth.currentAuthenticatedUser()
        .then(async user => {
          await Auth.signOut();
          globalStateDispatch({ type: 'AUTH_INIT' });
          history.push('/LogIn');
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log(`${err.message}`);
      let error = null;
      !err.message ? (error = { message: 'cognito error' }) : (error = err);
      globalStateDispatch({
        type: 'COGNITO_ERROR',
        state: {
          ...globalState,
          isAuthenticated: false,
          errors: { ...globalState.errors, cognito: error },
        },
      });
    }
  };
  return (
    <section className="section auth">
      <div className="container">
        <h1>Welcome {globalState.username}!</h1>
        <p>You have successfully registered a new account.</p>
        <p>Your password has been successfully updated!</p>
      </div>
      <div className="field">
        <p className="control">
          <button onClick={handleSignOut} className="button is-success">
            SignOut
          </button>
        </p>
        <p>
          <a href="/changepassword" className="button is-primary">
            <strong>Change Password</strong>
          </a>
        </p>
      </div>
    </section>
  );
}
