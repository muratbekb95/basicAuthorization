import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

async function loginUser(credentials) {
  return fetch('http://localhost:9090/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
}

export default function Login({ setToken, setGeo }) {
  const [username, setUserName] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username
    })
    const r = token.json().then(function(result) {
      setGeo(result.geo);
      setToken(token.headers.get('Authorization'));
      sessionStorage.setItem('username', JSON.stringify(username));
    });
  }

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" required="required" onChange={e => setUserName(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  setGeo: PropTypes.func.isRequired
}
