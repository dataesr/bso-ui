import { Button, Card, CardDescription } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

import Gauge from './Gauge';

function DataCard({ sentence, buttonLabel, topData, percentage }) {
  return (
    <Card hasArrow={false} href='/' className='bso-datacard text-center'>
      <CardDescription>
        {topData && <p className='top-data marianne-extra-bold'>{topData}</p>}
        <Gauge percentage={percentage} />
        <p className='sentence'>{sentence}</p>
        {buttonLabel && (
          <Button
            icon='ri-arrow-down-line'
            iconPosition='right'
            size='sm'
            title={buttonLabel}
          >
            {buttonLabel}
          </Button>
        )}
      </CardDescription>
    </Card>
  );
}

DataCard.defaultProps = {
  buttonLabel: '',
  topData: '',
  sentence: '',
  percentage: null,
};

DataCard.propTypes = {
  sentence: PropTypes.string,
  percentage: PropTypes.number,
  topData: PropTypes.string,
  buttonLabel: PropTypes.string,
};

export default DataCard;
