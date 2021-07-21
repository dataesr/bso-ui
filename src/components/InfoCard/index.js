import { Card, CardDescription } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

import Loader from '../Loader';

function InfoCard({ title, subTitle, bodyClassName, data1, data2, icon }) {
  return (
    <Card
      className='bso-info-card text-center'
      bodyClassName={bodyClassName}
      href='/'
      hasArrow={false}
    >
      <CardDescription as='div'>
        <section className='pb-16 pt-32'>
          {icon}
          {data1 ? (
            <section>
              {title && <div className='fs-20-20'>{title}</div>}
              <div className='marianne-extra-bold'>
                <span className='fs-48-48'>{data1}</span>
                {data2 && <span className='fs-28-32'>{data2}</span>}
              </div>
              {subTitle && <div className='fs-20-20'>{subTitle}</div>}
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
  title: null,
  subTitle: null,
  bodyClassName: 'bg-white',
};
InfoCard.propTypes = {
  bodyClassName: PropTypes.string,
  title: PropTypes.element,
  subTitle: PropTypes.element,
  data1: PropTypes.string.isRequired,
  data2: PropTypes.string,
  icon: PropTypes.element.isRequired,
};

export default InfoCard;
