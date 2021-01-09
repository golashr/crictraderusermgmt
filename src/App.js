import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import ProductAdmin from './components/ProductAdmin';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import RegisterConfirm from './components/auth/RegisterConfirm';
import Footer from './components/Footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
library.add(faEdit);

export const StateContext = React.createContext();

const initialState = {
  username: '',
  password: '',
  email: '',
  error: '',
  isAuthenticated: false,
};

const reducer = (state, action) => {
  console.log('From reducer function !', state, action);
  switch (action.type) {
    case 'AUTH_INIT':
      console.log('From AUTH_INIT');
      return initialState;
    case 'CLEAR_ERROR':
      console.log('From CLEAR_ERROR');
      return {
        ...state,
        error: '',
      };
    case 'COGNITO_ERROR':
      console.log('From COGNITO_ERROR');
      return {
        ...state,
        error: action.state.error,
      };

    case 'AUTH_SUCCESS':
      console.log('From AUTH_SUCCESS', action.state.username);
      return {
        ...state,
        isAuthenticated: true,
        username: action.state.username,
        email: action.state.email,
      };

    case 'VALUE_UPDATE':
      console.log('From VALUE_UPDATE');
      return {
        ...state,
        username: action.state.username,
      };

    case 'AUTH_FAILURE':
      console.log('From AUTH_FAILURE');
      return {
        isAuthenticated: false,
        username: '',
        error: action.state.error,
      };

    default:
      console.log('From reducer default !');
      return state;
  }
};

export default function App() {
  const [store, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <StateContext.Provider value={{ globalState: store, globalStateDispatch: dispatch }}>
        <Router>
          <div>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/products" component={Products} />
              <Route exact path="/admin" component={ProductAdmin} />
              <Route exact path="/login" component={LogIn} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/forgotpassword" component={ForgotPassword} />
              <Route
                exact
                path="/forgotpasswordverification"
                component={ForgotPasswordVerification}
              />
              <Route exact path="/changepassword" component={ChangePassword} />
              <Route exact path="/changepasswordconfirmation" component={ChangePasswordConfirm} />
              <Route exact path="/welcome" component={Welcome} />
              <Route exact path="/RegisterConfirm" component={RegisterConfirm} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </StateContext.Provider>
    </div>
  );
}
