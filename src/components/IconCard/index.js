import {
  Card,
  CardDescription,
  CardTitle,
  Icon as DSIcon,
  Link as DSLink,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

function IconCard({ title, linkUrl, icon }) {
  return (
    <Card bodyClassName='bg-white' href='/' isHorizontal hasArrow={false}>
      <CardTitle>{icon}</CardTitle>
      <CardDescription as='div'>
        <h6 className='m-0'>{title}</h6>
        <DSIcon name='ri-link' size='2x' as='div'>
          <DSLink className='w-100 text-right' as={<Link to={linkUrl} />} />
        </DSIcon>
      </CardDescription>
    </Card>
  );
}

IconCard.propTypes = {
  title: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default IconCard;
