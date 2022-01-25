import { Card, CardDescription, CardDetail, Link } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function FlashCard({ intlTitle, url, urlData, urlPdf }) {
  return (
    <Card
      bodyClassName='bso-flash-card bg-yellow'
      hasArrow={false}
      enlargeLink={false}
    >
      <CardDetail className='fs-14-24 marianne-bold'>
        <FormattedMessage id='app.notes.flash.title' />
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
          {urlPdf && (
            <div>
              <Link target='_blank' href={urlPdf}>
                <FormattedMessage id='app.notes.flash.pdf' />
              </Link>
            </div>
          )}
          {urlData && (
            <div>
              <Link target='_blank' href={urlData}>
                <FormattedMessage id='app.notes.flash.data' />
              </Link>
            </div>
          )}
        </section>
      </CardDescription>
    </Card>
  );
}

FlashCard.defaultProps = {
  urlData: undefined,
  urlPdf: undefined,
};

FlashCard.propTypes = {
  intlTitle: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  urlData: PropTypes.string,
  urlPdf: PropTypes.string,
};

export default FlashCard;
