import { Col, Container, Row } from '@dataesr/react-dsfr';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';

import BSOChart from '../../components/Charts';
import Loader from '../../components/Loader';
import { getURLSearchParams } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';

function Integration() {
  const { domain, graphId, language, studyType } = useParams();
  const { pathname, search } = useLocation();
  const intl = useIntl();
  const { switchLang } = useLang();
  const { displayFooter, displayTitle } = getURLSearchParams(intl, graphId);
  switchLang(language, pathname, search);

  return (
    <Container fluid>
      {displayTitle && (
        <Row justifyContent='center'>
          <Col spacing='px-3w'>
            <h4 size='xs' className='title-xxs'>
              {intl.formatMessage({ id: 'app.header.title' })}
            </h4>
          </Col>
        </Row>
      )}
      <Row justifyContent='center'>
        <Col>
          <Suspense fallback={<Loader />}>
            <BSOChart
              id={graphId}
              domain={domain || ''}
              studyType={studyType || ''}
              hasFooter={displayFooter}
            />
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
}

export default Integration;
