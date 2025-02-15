import { Button, Icon as DSIcon } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import useScroll from '../../utils/Hooks/useScroll';

export default function ScrollTop() {
  const { scrollTop } = useScroll();
  return (
    <>
      {scrollTop > 1500 && (
        <div className='scroll-top-btn z-4000'>
          <DSIcon name='ri-arrow-up-line' size='lg' iconPosition='left'>
            <Button className='josm-btn' onClick={() => window.scrollTo(0, 0)}>
              <FormattedMessage
                id='app.scroll-to-top'
                defaultMessage='scroll to top'
              />
            </Button>
          </DSIcon>
        </div>
      )}
    </>
  );
}
