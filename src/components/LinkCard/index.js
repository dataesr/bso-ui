import {
  Card,
  CardDescription,
  Icon as DSIcon,
  Link as DSLink,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function LinkCard({ title, linkUrl, icon }) {
  return (
    <Card
      bodyClassName='bso-link-card bg-white'
      hasArrow={false}
      hasBorder={false}
      href='/'
    >
      <CardDescription as='div'>
        <div className='icon flex align-center'>{icon}</div>
        <h6 className='m-0'>{title}</h6>
        <DSIcon
          name='ri-link'
          size='lg'
          as='span'
          iconPosition='right'
          className='ds-fr--v-middle'
        >
          <div className='w-100 text-right pt-16'>
            <DSLink href={linkUrl} target='_blank'>
              <FormattedMessage id='app.card.footer.title' />
            </DSLink>
          </div>
        </DSIcon>
      </CardDescription>
    </Card>
  );
}

LinkCard.propTypes = {
  icon: PropTypes.element.isRequired,
  linkUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default LinkCard;
