/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import { StateContext } from '../App';

export default function Navbar() {
  const stateContext = useContext(StateContext);
  const { globalState } = stateContext;

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="crictrader-logo.png" width="112" height="28" alt="crictrader logo" />
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a href="/" className="navbar-item">
            Home
          </a>
          <a href="/products" className="navbar-item">
            Products
          </a>
          <a href="/admin" className="navbar-item">
            Admin
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {globalState.isAuthenticated && <a className="navbar-item">{globalState.username}</a>}
            <div className="buttons">
              <a href="/register" className="button is-primary">
                <strong>Register</strong>
              </a>
              <a href="/login" className="button is-light">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
