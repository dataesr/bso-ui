import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { isInProduction } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';
import Banner from '../Banner';
import Chip from '../Chip';
import Icon from '../Icon';

function BannerNational({ selected, title }) {
  const intl = useIntl();
  const { lang, urls } = useLang();
  const { search } = useLocation();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-28'
          color1='blue-soft-125'
          color2='publication-25'
        />
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
      selectNavigation={
        isInProduction()
          ? false
          : {
            title: intl.formatMessage({
              id: 'app.navigation.objet-recherche',
            }),
            selected: intl.formatMessage({ id: selected }),
            options: [
              {
                label: intl.formatMessage({ id: 'app.baro-national.title' }),
                value: intl.formatMessage({ id: 'url.publications.general' }),
              },
              {
                label: intl.formatMessage({ id: 'app.publi.thesis' }),
                value: intl.formatMessage({ id: 'url.national.thesis' }),
              },
              {
                label: intl.formatMessage({ id: 'app.publi.researchdata' }),
                value: intl.formatMessage({
                  id: 'url.national.research-data',
                }),
              },
              {
                label: intl.formatMessage({ id: 'app.publi.softwarecodes' }),
                value: intl.formatMessage({
                  id: 'url.national.software-codes',
                }),
              },
            ],
          }
      }
    />
  );
}

BannerNational.propTypes = {
  selected: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BannerNational;