import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import urls from '../../config/urls';
import useLang from '../../utils/Hooks/useLang';
import Banner from '../Banner';
import Chip from '../Chip';
import Icon from '../Icon';

function BannerHealth({ selected, title }) {
  const intl = useIntl();
  const { lang } = useLang();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-15'
          color1='blue-soft-125'
          color2='green-soft-50'
        />
      </Col>
    </Row>
  );

  return (
    <Banner
      backgroundColor='blue-soft-100'
      homeLink={urls.sante[lang]}
      supTitle={<FormattedMessage id='app.header.title-health' />}
      title={<FormattedMessage id={title} />}
      chip={<Chip />}
      icons={renderIcons}
      selectNavigation={{
        title: intl.formatMessage({ id: 'app.navigation.objet-recherche' }),
        selected: intl.formatMessage({ id: selected }),
        options: [
          {
            label: intl.formatMessage({ id: 'app.baro-sante.title' }),
            value: intl.formatMessage({
              id: 'url.sante.publications.general',
            }),
          },
          {
            label: intl.formatMessage({
              id: 'app.baro-sante.trials.main-title',
            }),
            value: intl.formatMessage({ id: 'url.sante.essais' }),
          },
          {
            label: intl.formatMessage({
              id: 'app.baro-sante.studies.main-title',
            }),
            value: intl.formatMessage({ id: 'url.sante.etudes' }),
          },
        ],
      }}
    />
  );
}

BannerHealth.propTypes = {
  selected: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BannerHealth;
