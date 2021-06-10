import React from 'react';
import { Link } from 'react-router-dom';

function Theme() {
  return (
    <div className="themes">
      <h1>Themes page</h1>
      <Link to="/baro-national">Baromètre National</Link>
      <Link to="/baro-sante">Baromètre Santé</Link>
    </div>
  );
}

export default Theme;
