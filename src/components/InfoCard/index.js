import { Card, CardDescription } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import useLang from '../../utils/Hooks/useLang';
import Loader from '../Loader';

function InfoCard({
  title,
  subTitle,
  bodyClassName,
  data1,
  data2,
  icon,
  small,
  cardClassNames,
}) {
  const { lang } = useLang();

  return (
    <Card
      className={classNames('bso-info-card text-center', cardClassNames)}
      bodyClassName={bodyClassName}
      href='/'
      hasArrow={false}
    >
      <CardDescription as='div'>
        <section className={classNames({ 'pb-16 pt-32': !small })}>
          {icon}
          {data1 ? (
            <section>
              {title && <div className='fs-20-26'>{title}</div>}
              <div className='marianne-extra-bold'>
                <span className='fs-48-48'>
                  {typeof data1 === 'number'
                    ? Intl.NumberFormat(`${lang}-${lang.toUpperCase()}`, {
                      maximumSignificantDigits: 3,
                    }).format(data1)
                    : data1}
                </span>
                {data2 && <span className='fs-28-32'>{data2}</span>}
              </div>
              {subTitle && <div className='fs-14-24'>{subTitle}</div>}
            </section>
          ) : (
            <Loader size='50' spacing='py-3w' />
          )}
        </section>
      </CardDescription>
    </Card>
  );
}

InfoCard.defaultProps = {
  data2: '',
  cardClassNames: '',
  title: null,
  small: false,
  subTitle: null,
  bodyClassName: 'bg-white',
};
InfoCard.propTypes = {
  bodyClassName: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subTitle: PropTypes.element,
  data1: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]).isRequired,
  data2: PropTypes.string,
  cardClassNames: PropTypes.string,
  small: PropTypes.bool,
  icon: PropTypes.element.isRequired,
};

export default InfoCard;
