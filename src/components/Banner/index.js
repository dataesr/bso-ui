import React from 'react';
import { Callout, CalloutText, CalloutTitle } from '@dataesr/react-dsfr';
import './style.scss';

function Banner() {
  return (
    <div className="banner">
      <Callout hasInfoIcon={false}>
        <CalloutTitle as="h3">Callout title</CalloutTitle>
        <CalloutText>Callout text that might be short and concise.</CalloutText>
      </Callout>
    </div>
  );
}

export default Banner;
