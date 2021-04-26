import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

async function loginUser(credentials) {
  return fetch('http://localhost:5052/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(r=>r.headers)
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [geo, setGeo] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      geo
    });
    setToken(token.get('Authorization'));
  }

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" required="required" onChange={e => setUserName(e.target.value)}/>
        </label>
        <br/><br/>
        <label htmlFor="geo">Geo </label>
        <select id="geo" name="geo" onChange={e => setGeo(e.target.value)}>
          <option value="CENTRAL">Центральный офис</option>
          <option value="ALMATY">Алматы</option>
          <option value="NUR-SULTAN">Нур-Султан</option>
          <option value="ALMATY-OBL">Алматинская область</option>
          <option value="AKTAU">Актау</option>
          <option value="AKTOBE">Актобе</option>
          <option value="ATYRAU">Атырау</option>
          <option value="KARAGANDA">Караганда</option>
          <option value="KOKSHETAU">Кокшетау</option>
          <option value="KOSTANAY">Костанай</option>
          <option value="KYZYLORDA">Кызылорда</option>
          <option value="PAVLODAR">Павлодар</option>
          <option value="PETROPAVLOVSK">Петропавловск</option>
          <option value="URALSK">Уральск</option>
          <option value="UST-KAMENOGORSK">Усть-Каменогорск</option>
          <option value="TARAZ">Тараз</option>
          <option value="SHYMKENT">Шымкент</option>
        </select>
        <br/><br/>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
