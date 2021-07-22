import { Col } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '../Icon';
import InfoCard from '../InfoCard';
import Loader from '../Loader';

function TodaySectionItem({
  icoName,
  todayData,
  iconColor,
  intlSubTitle,
  backgroundColorClass,
  itemKey,
}) {
  console.debug('==== DEBUG ==== ', todayData, itemKey);
  return (
    <Col n='6 sm-4 md-6'>
      <InfoCard
        cardClassNames='text-left-l'
        small
        bodyClassName={backgroundColorClass}
        subTitle={<FormattedMessage id={intlSubTitle} />}
        data1={todayData[itemKey] || <Loader spacing='' size='80' />}
        icon={<Icon name={icoName} color1='blue-dark-125' color2={iconColor} />}
      />
    </Col>
  );
}

TodaySectionItem.defaultProps = {
  todayData: { publicationCount: '' },
};

TodaySectionItem.propTypes = {
  backgroundColorClass: PropTypes.string.isRequired,
  todayData: PropTypes.shape({ publicationCount: PropTypes.string }),
  intlSubTitle: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  itemKey: PropTypes.string.isRequired,
  icoName: PropTypes.string.isRequired,
};
export default TodaySectionItem;
