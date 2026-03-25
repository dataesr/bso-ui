import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import useLang from '../../utils/Hooks/useLang';
import Banner from '../Banner';
import Chip from '../Chip';
import Icon from '../Icon';

function BannerHealth({ selected, title }) {
  const intl = useIntl();
  const { lang, urls } = useLang();
  const { search } = useLocation();

  const icons = {
    'url.sante.publications.general': {
      name: 'icon-bsso-28',
      color1: 'blue-soft-125',
      color2: 'publication-25',
    },
    'url.sante.etudes': {
      name: 'icon-bsso-17',
      color1: 'blue-soft-125',
      color2: 'orange-medium-50',
    },
    'url.sante.essais': {
      name: 'icon-bsso-15',
      color1: 'blue-soft-125',
      color2: 'green-soft-50',
    },
  };

  const options = [
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
  ];

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters className='mb-32'>
      <Col n='12'>
        <Icon
          name={icons[selected]?.name}
          color1={icons[selected]?.color1}
          color2={icons[selected]?.color2}
        />
      </Col>
    </Row>
  );

  return (
    <Banner
      backgroundColor='blue-soft-100'
      chip={<Chip domain='health' />}
      homeLink={urls.sante[lang] + search}
      icons={renderIcons}
      selectNavigation={{
        title: intl.formatMessage({ id: 'app.navigation.objet-recherche' }),
        selected: intl.formatMessage({ id: selected }),
        options,
      }}
      supTitle={<FormattedMessage id='app.header.title-health' />}
      title={<FormattedMessage id={title} />}
    />
  );
}

BannerHealth.propTypes = {
  selected: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BannerHealth;
