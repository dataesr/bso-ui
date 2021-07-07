import { Button, Card, CardDescription } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

import Loader from '../Loader';
import Gauge from './Gauge';

function DataCard({ background, sentence, buttonLabel, topData, percentage }) {
  return (
    <Card
      hasArrow={false}
      href='/test'
      className='bso-datacard text-center'
      bodyClassName={background}
    >
      <CardDescription as='div'>
        {topData && <p className='top-data marianne-extra-bold'>{topData}</p>}
        {percentage ? <Gauge percentage={percentage} /> : <Loader />}
        <div className='sentence'>{sentence}</div>
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
  background: 'green',
};

DataCard.propTypes = {
  sentence: PropTypes.string,
  background: PropTypes.oneOf(['yellow', 'pink', 'aqua', 'green', 'brown']),
  percentage: PropTypes.number,
  topData: PropTypes.string,
  buttonLabel: PropTypes.string,
};

export default DataCard;
