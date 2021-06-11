import { Col, Container, Link as DSLink, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { Link } from 'react-router-dom';

import DataCard from '../../components/DataCard';

function Accueil() {
  return (
    <div className='accueil'>
      <Container>
        <Row gutters>
          <Col n='12 sm-6'>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col n='12 sm-6'>
            <DataCard
              percentage={20}
              buttonLabel='Voir en détail'
              sentence='des publications françaises en santé sont ouvertes dans le millésime 2020'
            />
          </Col>
        </Row>
      </Container>
      <ul>
        <li>
          <DSLink as={<Link to='/baro-national' />} href='/my-page' isSimple>
            Baromètre National
          </DSLink>
        </li>
        <li>
          <Link to='/baro-sante'>Baromètre Santé</Link>
          <ul>
            <li>
              <Link to='/baro-sante/essais-cliniques'>Essai Cliniques</Link>
            </li>
            <li>
              <Link to='/baro-sante/publications'>
                Baromètre Santé Publications
              </Link>
            </li>
            <li>
              <Link to='/baro-sante/etudes'>Etudes Observationnelles</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to='/theme'>Thèmes</Link>
        </li>
      </ul>
    </div>
  );
}

export default Accueil;
