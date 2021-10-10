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
  value,
  isPercentage,
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
        {value || isPercentage ? (
          <>
            {isPercentage ? (
              <Gauge value={value} nbPosition={nbGaugePosition} />
            ) : (
              <p className='top-data marianne-extra-bold'>{value}</p>
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
  value: 0,
  sentence: '',
  isPercentage: false,
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
  isPercentage: PropTypes.bool,
  buttonHref: PropTypes.string,
  nbGaugePosition: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  buttonLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default DataCard;
