import { useState } from 'react';

export default function useCurrentGeo(){
  const getCurrentGeo = () => {
    const currentGeoString = sessionStorage.getItem('currentGeo');
    const userCurrentGeo = JSON.parse(currentGeoString);
    return userCurrentGeo
  };
  const [currentGeo, setCurrentGeo] = useState(getCurrentGeo());

  const saveCurrentGeo = userCurrentGeo => {
    sessionStorage.setItem('currentGeo', JSON.stringify(userCurrentGeo));
    setCurrentGeo(userCurrentGeo);
  };

  return {
    setCurrentGeo: saveCurrentGeo,
    currentGeo
  }
}