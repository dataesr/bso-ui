import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import useLang from '../../utils/Hooks/useLang';
import Banner from '../Banner';
import Chip from '../Chip';
import Icon from '../Icon';

function BannerNational({ selected, title, iconId }) {
  const intl = useIntl();
  const { lang, urls } = useLang();
  const { search } = useLocation();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters className='mb-32'>
      <Col n='12'>
        <Icon name={iconId} color1='blue-soft-125' color2='publication-25' />
      </Col>
    </Row>
  );

  return (
    <Banner
      backgroundColor='blue-soft-150'
      homeLink={urls.national[lang] + search}
      supTitle={<FormattedMessage id='app.header.title-national' />}
      title={<FormattedMessage id={title} />}
      chip={<Chip />}
      icons={renderIcons}
      selectNavigation={{
        title: intl.formatMessage({
          id: 'app.navigation.objet-recherche',
        }),
        selected: intl.formatMessage({ id: selected }),
        options: [
          {
            label: intl.formatMessage({
              id: 'app.baro-national.data.title.beta',
            }),
            value: intl.formatMessage({ id: 'url.data.general' }),
          },
          {
            label: intl.formatMessage({
              id: 'app.baro-national.software.title.beta',
            }),
            value: intl.formatMessage({ id: 'url.software.general' }),
          },
        ],
      }}
    />
  );
}

BannerNational.propTypes = {
  iconId: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BannerNational;
