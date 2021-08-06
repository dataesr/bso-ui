import { Container } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Banner from '../../../components/Banner';
import Chip from '../../../components/Chip';

function Etudes() {
  const intl = useIntl();

  return (
    <Container fluid className='page etudes'>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle={<FormattedMessage id='app.baro-sante.sub-title' />}
        title={<FormattedMessage id='app.baro-sante.etudes.title' />}
        chip={<Chip />}
        selectNavigation={{
          title: <FormattedMessage id='app.navigation.objet-recherche' />,
          selected: intl.formatMessage({ id: 'url.sante.etudes' }),
          options: [
            {
              label: intl.formatMessage({ id: 'app.baro-sante.title' }),
              value: intl.formatMessage({
                id: 'url.sante.publications.general',
              }),
            },
            {
              label: intl.formatMessage({
                id: 'app.header.nav.baro-sante-essais',
              }),
              value: intl.formatMessage({ id: 'url.sante.essais' }),
            },
            {
              label: intl.formatMessage({ id: 'app.baro-sante.etudes.title' }),
              value: intl.formatMessage({ id: 'url.sante.etudes' }),
            },
          ],
        }}
      />
    </Container>
  );
}

export default Etudes;
