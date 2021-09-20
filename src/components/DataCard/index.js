import { Button, Card, CardDescription } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

import Loader from '../Loader';
import Gauge from './Gauge';

function DataCard({
  background,
  sentence,
  buttonLabel,
  buttonHref,
  topData,
  percentage,
  nbGaugePosition,
}) {
  const history = useHistory();

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
            onClick={() => buttonHref && history.push(buttonHref)}
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
  buttonHref: '',
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
  buttonHref: PropTypes.string,
  nbGaugePosition: PropTypes.string,
  topData: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  buttonLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default DataCard;
