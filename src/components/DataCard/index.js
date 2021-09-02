import { Button, Card, CardDescription } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

import Loader from '../Loader';
import Gauge from './Gauge';

function DataCard({
  background,
  sentence,
  buttonLabel,
  topData,
  percentage,
  nbGaugePosition,
}) {
  return (
    <Card
      hasArrow={false}
      href='/'
      className='bso-datacard text-center'
      bodyClassName={background}
    >
      <CardDescription as='div'>
        {topData || percentage ? (
          <>
            {topData && (
              <p className='top-data marianne-extra-bold'>{topData}</p>
            )}
            {percentage && (
              <Gauge percentage={percentage} nbPosition={nbGaugePosition} />
            )}
          </>
        ) : (
          <Loader />
        )}
        <p className='sentence'>{sentence}</p>
        {buttonLabel && (
          <Button
            className='btn-bottom btn-blue text-white'
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
  nbGaugePosition: '66',
};

DataCard.propTypes = {
  sentence: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  background: PropTypes.oneOf([
    'yellow',
    'pink',
    'aqua',
    'green',
    'brown',
    'blue',
  ]),
  percentage: PropTypes.number,
  nbGaugePosition: PropTypes.string,
  topData: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  buttonLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default DataCard;
