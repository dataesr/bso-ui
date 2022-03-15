import { Col, Container, Row, TitleDisplay } from '@dataesr/react-dsfr';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';

import BSOChart from '../../components/Charts';
import Loader from '../../components/Loader';
import { getURLSearchParams } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';

const Integration = () => {
  const { language, graphId, domain, studyType } = useParams();
  const { pathname, search } = useLocation();
  const intl = useIntl();
  const { switchLang } = useLang();
  const { displayTitle, displayFooter } = getURLSearchParams(search, intl);
  switchLang(language, pathname, search);
  return (
    <Container fluid>
      {displayTitle && (
        <Row justifyContent='center'>
          <Col spacing='px-3w'>
            <TitleDisplay as='h4' size='xs' className='title-xxs'>
              {intl.formatMessage({ id: 'app.header.title' })}
            </TitleDisplay>
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
};

export default Integration;
