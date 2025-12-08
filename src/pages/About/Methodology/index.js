import { Col, Container, Link as DSLink, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import useLang from '../../../utils/Hooks/useLang';
import Citations from '../Citation/citations';

function Methodology() {
  const { lang } = useLang();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters className='mb-32'>
      <Col n='12'>
        <Icon
          name='icon-bsso-22'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );

  return (
    <>
      <div className='methodology'>
        <Banner
          backgroundColor='blue-soft-50'
          textColor='blue-dark-150'
          supTitle={<FormattedMessage id='app.header.title' />}
          title={<FormattedMessage id='app.header.nav.about.methodology' />}
          icons={renderIcons}
        />
      </div>
      <Container>
        <section className='content py-4'>
          <Row gutters>
            <Col n='12 md-6 lg-6'>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.methodologie.publication' />
              </h4>
              <div>
                <DSLink
                  href='/assets/methodologie_publications_fr.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.publication.description-fr' />
                </DSLink>
              </div>
              <div>
                <DSLink
                  href='/assets/methodologie_publications_en.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.publication.description-en' />
                </DSLink>
              </div>
              <img
                src={`/assets/methodologie_publications_${lang}.png`}
                alt='flyer bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
              />
            </Col>
            <Col n='12 md-6 lg-6'>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.methodologie.data_software' />
              </h4>
              <div>
                <DSLink
                  href='/assets/methodologie_data_software_fr.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.data_software.description-fr' />
                </DSLink>
              </div>
              <div>
                <DSLink
                  href='/assets/methodologie_data_software_en.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.data_software.description-en' />
                </DSLink>
              </div>
              <img
                src={`/assets/methodologie_data_software_${lang}.png`}
                alt='flyer resultats bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
              />
            </Col>
          </Row>
        </section>
      </Container>
      <Container>
        <p className='content py-28'>
          <FormattedMessage id='app.methodo-contact' />
          {' '}
          <a href='mailto:bso@recherche.gouv.fr'>
            <FormattedMessage id='app.variations.email' />
          </a>
          .
        </p>
      </Container>
      <Container>
        <section className='color-blue-dark-125 content py-48'>
          <Row gutters>
            <Citations />
          </Row>
        </section>
      </Container>
    </>
  );
}

export default Methodology;
