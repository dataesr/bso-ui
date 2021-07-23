import { Card, CardDescription, CardDetail, Link } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function FlashCard({ url, intlTitle }) {
  return (
    <Card bodyClassName='bso-flash-card bg-yellow' hasArrow={false} href={url}>
      <CardDetail className='fs-14-24 marianne-bold'>
        Note flash du SIES
      </CardDetail>
      <CardDescription as='div'>
        <div className='fs-20-20 marianne-bold pb-32'>
          <FormattedMessage id={intlTitle} />
        </div>
        <section className='text-right'>
          <div>
            <Link target='_blank' href={url}>
              <FormattedMessage id='app.notes.flash.note' />
            </Link>
          </div>
          <div>
            <Link target='_blank' href={url}>
              <FormattedMessage id='app.notes.flash.data-graph' />
            </Link>
          </div>
        </section>
      </CardDescription>
    </Card>
  );
}

FlashCard.propTypes = {
  url: PropTypes.string.isRequired,
  intlTitle: PropTypes.string.isRequired,
};

export default FlashCard;
