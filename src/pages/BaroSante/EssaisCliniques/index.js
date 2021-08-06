import { Container } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Banner from '../../../components/Banner';
import Chip from '../../../components/Chip';

function EssaisCliniques() {
  const intl = useIntl();

  return (
    <Container fluid className='page essais'>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle={<FormattedMessage id='app.baro-sante.sub-title' />}
        title={<FormattedMessage id='app.header.nav.baro-sante-essais' />}
        chip={<Chip />}
        selectNavigation={{
          title: <FormattedMessage id='app.navigation.objet-recherche' />,
          selected: intl.formatMessage({ id: 'url.sante.essais' }),
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

export default EssaisCliniques;
