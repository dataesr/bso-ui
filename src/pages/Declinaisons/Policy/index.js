import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import GraphComments from '../../../components/Charts/graph-comments';
import WrapperChart from '../../../components/WrapperChart';
import customComments from '../../../utils/chartComments';
import { chartOptions } from '../../../utils/chartOptions';

const Policy = () => {
  const [chartComments, setChartComments] = useState('');

  const intl = useIntl();
  const chartRef = useRef();

  const hasComments = true;
  const id = 'other.institution.open-science-policy';
  const idWithDomain = 'other.institution.open-science-policy';
  const optionsGraph = chartOptions[id].getOptions(idWithDomain, intl, [
    {
      data: [
        { y: 1, y_percent: 3 },
        { y: 1, y_percent: 3 },
        { y: 3, y_percent: 9 },
        { y: 9, y_percent: 27 },
        { y: 15, y_percent: 52 },
        { y: 22, y_percent: 120 },
        { y: 30, y_percent: 500 },
        { y: 32, y_percent: 500 },
        { y: 37, y_percent: 505 },
      ],
    },
  ]);

  useEffect(() => {
    setChartComments(customComments({ comments: {} }, idWithDomain, intl));
  }, [idWithDomain, intl]);

  return (
    <div className='policy no-arrow-link'>
      <Container>
        <section className='color-blue-dark-125 content py-48'>
          <Row gutters>
            <Col n='12'>
              <h2>
                <FormattedMessage id='app.header.nav.declinaisons.policy' />
              </h2>
            </Col>
          </Row>
          <Row>
            <Col n='12'>
              <WrapperChart
                chartRef={chartRef}
                domain=''
                hasComments={false}
                hasFooter={false}
                id='other.institution.open-science-policy'
                isError={false}
                isLoading={false}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  id={idWithDomain}
                  options={optionsGraph}
                  ref={chartRef}
                />
                {hasComments && chartComments && (
                  <GraphComments comments={chartComments} hasFooter />
                )}
              </WrapperChart>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Policy;
