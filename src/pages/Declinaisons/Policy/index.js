import { Col, Container, Row } from '@dataesr/react-dsfr';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import GraphComments from '../../../components/Charts/graph-comments';
import ChartWrapper from '../../../components/ChartWrapper';
import customComments from '../../../utils/chartComments';
import { getGraphOptions } from '../../../utils/chartOptions';
import { getCSSValue, getPercentageYAxis } from '../../../utils/helpers';

const { REACT_APP_OPENDATASOFT_API_KEY } = process.env;
const OPENDATASOFT_LIMIT = 100;
const START_YEAR = 2016;

const Policy = () => {
  const [chartComments1, setChartComments1] = useState('');
  const [chartComments2, setChartComments2] = useState('');
  const [data, setData] = useState([]);
  const [options1, setOptions1] = useState();
  const [options2, setOptions2] = useState();

  const intl = useIntl();
  const chartRef1 = useRef();
  const chartRef2 = useRef();

  const id1 = 'other.policy.open-science-policy';
  const id2 = 'other.policy.open-science-document';

  useEffect(() => {
    const getDataFromPage = async ({
      limit = OPENDATASOFT_LIMIT,
      offset = 0,
    } = {}) => {
      let url = 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets';
      url += `/fr-esr-resultats-de-l-enquete-sur-la-mise-en-oeuvre-des-politiques-de-science-ou/records?limit=${limit}&offset=${offset}`;
      url += `&apikey=${REACT_APP_OPENDATASOFT_API_KEY}`;
      const response = await axios.get(url, {
        headers: { accept: 'application/json; charset=utf-8' },
      });
      return response?.data;
    };
    const getData = async () => {
      let allData = [];
      let count = 0;
      let offset = 0;
      do {
        // eslint-disable-next-line no-await-in-loop
        const results = await getDataFromPage({ offset });
        count = results.total_count;
        offset += OPENDATASOFT_LIMIT;
        allData = [...allData, ...results?.results];
      } while (allData.length < count);
      setData(allData);
    };
    getData();
  }, []);

  useEffect(() => {
    const years = [
      ...Array(new Date().getFullYear() - START_YEAR + 1).keys(),
    ].map((year) => year + START_YEAR);
    const tmp = {};
    // eslint-disable-next-line no-return-assign
    years.forEach((year) => (tmp[year] = { y: 0, y_percent: 0 }));
    data.forEach((item) => {
      if (item?.first_year_of_publication) {
        tmp[item.first_year_of_publication].y += 1;
      }
    });
    const series1 = {};
    Object.keys(tmp).forEach((year) => {
      const y = Object.keys(tmp)
        .filter((key) => key <= year)
        .reduce((acc, curr) => acc + tmp[curr].y, 0);
      series1[year] = { name: year, y, y_percent: (y / data.length) * 100 };
    });
    const options1Tmp = getGraphOptions({ id: id1, intl });
    options1Tmp.xAxis.tickInterval = 1;
    options1Tmp.xAxis.plotBands = [
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
    options1Tmp.yAxis = getPercentageYAxis();
    options1Tmp.legend.enabled = false;
    options1Tmp.plotOptions = {
      series: {
        color: getCSSValue('--ouvrir-la-science-blue'),
        pointStart: START_YEAR,
      },
    };
    options1Tmp.series = [
      {
        data: Object.values(series1),
      },
    ];
    options1Tmp.exporting.chartOptions.legend.enabled = false;
    setOptions1(options1Tmp);

    const colorFromPolicyExists = {
      Oui: getCSSValue('--ouvrir-la-science-blue'),
      Non: getCSSValue('--ouvrir-la-science-green'),
      'Pas encore, mais nous y travaillons': getCSSValue(
        '--ouvrir-la-science-yellow',
      ),
    };

    let series2 = [];
    data.forEach((item) => {
      if (
        !series2.find(
          (serie) => serie.name === item.charter_policy_open_science_exists,
        )
      ) {
        series2.push({
          color:
            colorFromPolicyExists?.[item.charter_policy_open_science_exists]
            ?? getCSSValue('--g-500'),
          name: item?.charter_policy_open_science_exists,
          y: 0,
        });
      }
      series2.find(
        (serie) => serie.name === item.charter_policy_open_science_exists,
      ).y += 1;
    });
    series2 = series2.map((item) => ({
      ...item,
      name: item?.name ?? 'Pas de réponse',
      y_percent: (item.y / data.length) * 100,
    }));
    const options2Tmp = getGraphOptions({ id: id2, intl });
    options2Tmp.chart.type = 'pie';
    options2Tmp.series = [
      {
        data: series2,
        innerSize: '60%',
      },
    ];
    options2Tmp.plotOptions = {
      pie: {
        dataLabels: {
          enabled: true,
          format: '{point.name}<br/>{point.y_percent:.0f} %',
        },
      },
    };
    options2Tmp.exporting.chartOptions.legend.enabled = false;
    setOptions2(options2Tmp);
  }, [data, intl]);

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
              <ChartWrapper
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
              </ChartWrapper>
            </Col>
          </Row>
          <Row>
            <Col n='12'>
              <ChartWrapper
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
              </ChartWrapper>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Policy;
