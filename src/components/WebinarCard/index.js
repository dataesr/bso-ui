/* eslint-disable react/require-default-props */
import { Card, CardDescription, CardDetail, Link } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function WebinarCard({
  doi = undefined,
  intlTitle,
  urlVisio = undefined,
  urlPresentation = undefined,
}) {
  return (
    <Card
      bodyClassName='bso-flash-card bg-blue-soft-50'
      enlargeLink={false}
      hasArrow={false}
      hasBorder={false}
    >
      <CardDetail className='fs-14-24 marianne-bold'>
        <FormattedMessage id='app.notes.flash.title' />
      </CardDetail>
      <CardDescription as='div'>
        <div className='fs-20-20 marianne-bold pb-16'>
          <FormattedMessage id={intlTitle} />
        </div>
        <div className='fs-12-12 marianne pb-32'>
          {doi && <FormattedMessage id={doi} />}
        </div>
        <section className='text-right'>
          {urlVisio && (
            <div>
              <Link target='_blank' href={urlVisio}>
                <FormattedMessage id='app.notes.webinar.video' />
              </Link>
            </div>
          )}
          {urlPresentation && (
            <div>
              <Link target='_blank' href={urlPresentation}>
                <FormattedMessage id='app.notes.webinar.presentation' />
              </Link>
            </div>
          )}
        </section>
      </CardDescription>
    </Card>
  );
}

WebinarCard.propTypes = {
  doi: PropTypes.string,
  intlTitle: PropTypes.string.isRequired,
  urlVisio: PropTypes.string,
  urlPresentation: PropTypes.string,
};

export default WebinarCard;
