import { Col, Container, Row, TitleDisplay } from '@dataesr/react-dsfr';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';

import BSOChart from '../../components/Charts';
import Loader from '../../components/Loader';
import useLang from '../../utils/Hooks/useLang';

const Integration = () => {
  const { language, graphId, domain, studyType } = useParams();
  const { pathname } = useLocation();
  const intl = useIntl();
  const { switchLang } = useLang();

  switchLang(language, pathname);

  return (
    <Container fluid>
      <Row justifyContent='center'>
        <Col n='10' spacing='px-3w'>
          <TitleDisplay as='h2'>
            {intl.formatMessage({ id: 'app.header.title' })}
          </TitleDisplay>
        </Col>
      </Row>
      <Row justifyContent='center'>
        <Col n='10'>
          <Suspense fallback={<Loader />}>
            <BSOChart
              id={graphId}
              domain={domain || ''}
              studyType={studyType || ''}
            />
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
};

export default Integration;
