import { Card, CardDescription } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon';
import Loader from '../Loader';

function InfoCard({ title, data1, data2 }) {
  return (
    <Card
      className='info-card text-center'
      bodyClassName='bg-white'
      href='/test'
      hasArrow={false}
    >
      <CardDescription as='div'>
        <section className='pb-16 pt-32'>
          <Icon
            name='icon-bsso-33'
            color1='blue-dark-125'
            color2='orange-soft-50'
          />
          {title ? (
            <section>
              <div className='fs-20-20'>{title}</div>
              <div className='marianne-extra-bold'>
                <span className='fs-48-48'>{data1}</span>
                {data2 && <span className='fs-28-32'>{data2}</span>}
              </div>
            </section>
          ) : (
            <Loader />
          )}
        </section>
      </CardDescription>
    </Card>
  );
}

InfoCard.defaultProps = {
  data2: '',
};
InfoCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  data1: PropTypes.string.isRequired,
  data2: PropTypes.string,
};

export default InfoCard;
