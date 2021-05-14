import { useState } from 'react';

export default function useGeo(){
  const getGeo = () => {
    const geoString = sessionStorage.getItem('geo');
    const userGeo = JSON.parse(geoString);
    return userGeo
  };
  const [geo, setGeo] = useState(getGeo());

  const saveGeo = userGeo => {
    sessionStorage.setItem('geo', JSON.stringify(userGeo));
    setGeo(userGeo);
  };

  return {
    setGeo: saveGeo,
    geo
  }
}