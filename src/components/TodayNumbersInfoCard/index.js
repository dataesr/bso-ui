import './style.scss';

import PropTypes from 'prop-types';
import React from 'react';

import { formatNumberByLang } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';
import Loader from '../Loader';

function TodayNumbersInfoCard({ title, subTitle, data1, data2, icon }) {
  const { lang } = useLang();

  return (
    <div className='josm-today-numbers-info-card'>
      <div className='josm-today-numbers-info-card__icon'>{icon}</div>
      <div className='josm-today-numbers-info-card__content'>
        {data1 ? (
          <>
            {title && (
              <div className='josm-today-numbers-info-card__title'>{title}</div>
            )}
            <div className='josm-today-numbers-info-card__value'>
              <span>
                {typeof data1 === 'number'
                  ? formatNumberByLang(data1, lang)
                  : data1}
              </span>
              {data2 && <span>{data2}</span>}
            </div>
            {subTitle && (
              <div className='josm-today-numbers-info-card__subtitle'>
                {subTitle}
              </div>
            )}
          </>
        ) : (
          <Loader size='50' spacing='py-3w' />
        )}
      </div>
    </div>
  );
}

TodayNumbersInfoCard.defaultProps = {
  data2: '',
  title: null,
  subTitle: null,
};
TodayNumbersInfoCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subTitle: PropTypes.element,
  data1: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]).isRequired,
  data2: PropTypes.string,
  icon: PropTypes.element.isRequired,
};

export default TodayNumbersInfoCard;
