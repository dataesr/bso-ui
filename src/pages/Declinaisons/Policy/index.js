import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import GraphComments from '../../../components/Charts/graph-comments';
import WrapperChart from '../../../components/WrapperChart';
import customComments from '../../../utils/chartComments';
import { getGraphOptions } from '../../../utils/chartOptions';
import { getCSSValue, getPercentageYAxis } from '../../../utils/helpers';

const Policy = () => {
  const [chartComments1, setChartComments1] = useState('');
  const [chartComments2, setChartComments2] = useState('');

  const intl = useIntl();
  const chartRef1 = useRef();
  const chartRef2 = useRef();

  const id1 = 'other.policy.open-science-policy';
  const options1 = getGraphOptions({ id: id1, intl });
  options1.xAxis.tickInterval = 1;
  options1.xAxis.plotBands = [
    {
      from: 2018,
      to: 2021,
      color: getCSSValue('--ouvrir-la-science-green'),
    },
    {
      from: 2021,
      to: 2024,
      color: getCSSValue('--ouvrir-la-science-yellow'),
    },
  ];
  options1.yAxis = getPercentageYAxis();
  options1.legend.enabled = false;
  options1.plotOptions = {
    series: {
      color: getCSSValue('--ouvrir-la-science-blue'),
      pointStart: 2016,
    },
  };
  options1.series = [
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
  ];
  options1.exporting.chartOptions.legend.enabled = false;

  const id2 = 'other.policy.open-science-document';
  const options2 = getGraphOptions({ id: id2, intl });
  options2.chart.type = 'pie';
  options2.series = [
    {
      data: [
        {
          color: getCSSValue('--ouvrir-la-science-blue'),
          name: intl.formatMessage({
            id: 'app.commons.yes',
            defaultMessage: 'Yes',
          }),
          y: 60,
          y_percent: 60,
        },
        {
          color: getCSSValue('--ouvrir-la-science-green'),
          name: intl.formatMessage({
            id: 'app.commons.no',
            defaultMessage: 'No',
          }),
          y: 5,
          y_percent: 5,
        },
        {
          color: getCSSValue('--ouvrir-la-science-yellow'),
          name: intl.formatMessage({
            id: 'other.institution.open-science-document.label.not_yet',
            defaultMessage: 'Pas encore',
          }),
          y: 35,
          y_percent: 35,
        },
      ],
      innerSize: '60%',
    },
  ];
  options2.plotOptions = {
    pie: {
      dataLabels: {
        distance: -35,
        enabled: true,
        format: '{point.name}<br/>{y}%',
      },
    },
  };
  options2.exporting.chartOptions.legend.enabled = false;

  useEffect(() => {
    setChartComments1(customComments({ comments: {} }, id1, intl));
    setChartComments2(customComments({ comments: {} }, id2, intl));
  }, [id2, intl]);

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
                chartRef={chartRef1}
                domain=''
                hasComments={false}
                id={id1}
                isError={false}
                isLoading={false}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  id={id1}
                  options={options1}
                  ref={chartRef1}
                />
                {chartComments1 && (
                  <GraphComments comments={chartComments1} hasFooter />
                )}
              </WrapperChart>
            </Col>
          </Row>
          <Row>
            <Col n='12'>
              <WrapperChart
                chartRef={chartRef2}
                domain=''
                hasComments={false}
                id={id2}
                isError={false}
                isLoading={false}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  id={id1}
                  options={options2}
                  ref={chartRef2}
                />
                {chartComments2 && (
                  <GraphComments comments={chartComments2} hasFooter />
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
