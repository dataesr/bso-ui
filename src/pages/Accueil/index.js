import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';

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
    </div>
  );
}

export default Accueil;
