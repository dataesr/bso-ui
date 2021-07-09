import {
  Card,
  CardDescription,
  Icon as DSIcon,
  Link as DSLink,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

function LinkCard({ title, linkUrl, icon }) {
  return (
    <Card bodyClassName='icon-card bg-white' href='/' hasArrow={false}>
      <CardDescription as='div'>
        {icon}
        <h6 className='m-0'>{title}</h6>
        <DSIcon
          name='ri-link'
          size='lg'
          as='span'
          iconPosition='right'
          className='ds-fr--v-middle'
        >
          <div className='w-100 text-right pt-16'>
            <DSLink as={<Link to={linkUrl} />}>
              Découvrir sur Ouvrir la Science
            </DSLink>
          </div>
        </DSIcon>
      </CardDescription>
    </Card>
  );
}

LinkCard.propTypes = {
  title: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default LinkCard;
