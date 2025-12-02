import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CardLogo from '../../../components/CardLogo';
import useLang from '../../../utils/Hooks/useLang';

function Project() {
  const { lang } = useLang();
  return (
    <div>
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-10' className='p-0'>
              <h2 id='project'>
                <FormattedMessage id='app.project.title' />
              </h2>
              <p>
                <FormattedMessage id='app.project.chronologie1' />
              </p>
              <p>
                <FormattedMessage id='app.project.chronologie2' />
              </p>
            </Col>
            <Col n='lg-3 md-4 sm-6'>
              <CardLogo
                alt='bso MESRE'
                href='https://www.enseignementsup-recherche.gouv.fr/fr'
                img='/logos/mesre.png'
              />
            </Col>
            <Col n='lg-3 md-4 sm-6'>
              <CardLogo
                alt='bso local UL'
                href='https://scienceouverte.univ-lorraine.fr'
                img='/declinaisons/ul.svg'
              />
            </Col>
            <Col n='lg-3 md-4 sm-6'>
              <CardLogo
                alt='inria'
                href='https://www.inria.fr'
                img='/declinaisons/inria.png'
              />
            </Col>
            <Col n='12 lg-8' className='p-0'>
              <p>
                <FormattedMessage id='app.project.chronologie3' />
              </p>
              <img
                src={`/assets/bso_chronologie_${lang}.png`}
                alt='flyer bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h2 className='mt-10' id='tool'>
                <FormattedMessage id='app.project.tool.title' />
              </h2>
              <p>
                <FormattedMessage id='app.project.tool.description' />
              </p>
              <p>
                <FormattedMessage id='app.project.bright.initiative' />
              </p>
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bright initiative'
                href='https://brightinitiative.com/'
                img='/logos/bright_initiative.png'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h2 className='mt-10' id='team'>
                <FormattedMessage id='app.project.team.title' />
              </h2>
              <p>
                <ul>
                  <li>
                    <FormattedMessage id='app.project.team.1' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.team.2' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.team.3' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.team.4' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.team.5' />
                  </li>
                </ul>
              </p>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h2 className='mt-10' id='copil'>
                <FormattedMessage id='app.project.copil.title' />
              </h2>
              <p>
                <ul>
                  <li>
                    <FormattedMessage id='app.project.copil.1' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.copil.2' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.copil.3' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.copil.4' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.copil.5' />
                  </li>
                </ul>
              </p>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h2 className='mt-10' id='ct'>
                <FormattedMessage id='app.project.ct.title' />
              </h2>
              <p>
                <FormattedMessage id='app.project.ct.description' />
                <ul>
                  <li>
                    <FormattedMessage id='app.project.ct.1' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.ct.2' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.ct.3' />
                  </li>
                  <li>
                    <FormattedMessage id='app.project.ct.4' />
                  </li>
                </ul>
              </p>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8' div='contact'>
              <h2 id='contact'>
                <FormattedMessage id='app.project.contact.title' />
              </h2>
              <p>
                <FormattedMessage id='app.project.contact' />
                {' '}
                <a href='mailto:bso@recherche.gouv.fr'>
                  <FormattedMessage id='app.variations.email' />
                </a>
              </p>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Project;
