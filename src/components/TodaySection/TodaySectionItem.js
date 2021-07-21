import { Col } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '../Icon';
import InfoCard from '../InfoCard';

function TodaySection({
  icoName,
  data,
  iconColor,
  intlSubTitle,
  backgroundColorClass,
}) {
  return (
    <Col n='6 sm-4 md-6'>
      <InfoCard
        cardClassNames='text-left-l'
        small
        bodyClassName={backgroundColorClass}
        subTitle={<FormattedMessage id={intlSubTitle} />}
        data1={data}
        icon={<Icon name={icoName} color1='blue-dark-125' color2={iconColor} />}
      />
    </Col>
  );
}

TodaySection.propTypes = {
  backgroundColorClass: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  intlSubTitle: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  icoName: PropTypes.string.isRequired,
};
export default TodaySection;
