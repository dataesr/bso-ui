import PropTypes from 'prop-types';
import React from 'react';

function Gauge({ percentage, nbPosition }) {
  const a = 340 * (percentage / 100);
  const b = 500 - a;

  return (
    (percentage === 0 || percentage) && (
      <div className='gauge'>
        <svg
          version='1.1'
          x='0px'
          y='0px'
          width='200'
          height='200'
          viewBox='0 0 200 200'
          xmlSpace='preserve'
        >
          <title>{`${percentage}%`}</title>
          <g>
            <path
              strokeDasharray='340'
              strokeDashoffset='0'
              d='M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0 Z'
              strokeLinecap='round'
              strokeWidth='26px'
              fill='none'
              stroke='#fff'
            />
            <path
              className='stroke'
              strokeDasharray='500'
              strokeDashoffset={b.toString()}
              d='M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0 Z'
              strokeLinecap='round'
              strokeWidth='8px'
              fill='none'
              stroke='currentColor'
            />
          </g>
          <text x={nbPosition} y='180' className='marianne-extra-bold'>
            {`${percentage}`}
            <tspan className='marianne-bold fs-24-32'>%</tspan>
          </text>
        </svg>
      </div>
    )
  );
}

Gauge.propTypes = {
  percentage: PropTypes.number.isRequired,
  nbPosition: PropTypes.string.isRequired,
};

export default Gauge;
