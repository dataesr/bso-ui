import React from 'react';
import { Link } from 'react-router-dom';

function BaroSante() {
  return (
    <div className='baro-sante'>
      <h1>BaroSante</h1>
      <Link to='/'>Go to Home page</Link>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos
        dolorem et, explicabo id illum, laudantium molestias officia placeat
        porro provident quam quia quisquam rem sequi sint tempore velit, veniam!
        Facere!
      </p>
    </div>
  );
}

export default BaroSante;
