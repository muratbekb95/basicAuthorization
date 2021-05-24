import { useState } from 'react';

export default function useLogin(){
  const getLogin = () => {
    const loginString = sessionStorage.getItem('login');
    const userLogin = JSON.parse(loginString);
    return userLogin
  };
  const [login, setLogin] = useState(getLogin());

  const saveLogin = userLogin => {
    sessionStorage.setItem('login', JSON.stringify(userLogin));
    setLogin(userLogin);
  };

  return {
    setLogin: saveLogin,
    login
  }
}