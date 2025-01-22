import { Col, Container, Row } from '@dataesr/react-dsfr';
import axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import GraphComments from '../../../components/Charts/graph-comments';
import ChartWrapper from '../../../components/ChartWrapper';
import customComments from '../../../utils/chartComments';
import { getGraphOptions } from '../../../utils/chartOptions';
import { getCSSValue, getPercentageYAxis } from '../../../utils/helpers';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const END_YEAR = 2024;
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
      url += `/fr-esr-politiques-so-etablissements/records?limit=${limit}&offset=${offset}&order_by=uo_lib`;
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
    const years = [...Array(END_YEAR - START_YEAR + 1).keys()].map(
      (year) => year + START_YEAR,
    );
    const tmp = {};
    // eslint-disable-next-line no-return-assign
    years.forEach((year) => (tmp[year] = { y: 0, y_percent: 0 }));
    data.forEach((item) => {
      if (
        item?.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
      ) {
        tmp[
          item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
        ].y += 1;
      }
    });
    const series1 = {};
    Object.keys(tmp).forEach((year) => {
      const y = Object.keys(tmp)
        .filter((key) => key <= year)
        .reduce((acc, curr) => acc + tmp[curr].y, 0);
      series1[year] = {
        name: year,
        total: data.length,
        y,
        y_percent: (y / data.length) * 100,
      };
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

    const orderFromPolicyExists = {
      Oui: 3,
      Non: 2,
      'Pas encore, mais nous y travaillons': 1,
    };

    let series2 = [];
    data.forEach((item) => {
      if (
        !series2.find(
          (serie) => serie.name
            === item[
              '1_2_existe_t_il_un_document_cadre_charte_politique_precisant_votre_politique_de_science_ouverte'
            ],
        )
      ) {
        series2.push({
          name: item[
            '1_2_existe_t_il_un_document_cadre_charte_politique_precisant_votre_politique_de_science_ouverte'
          ],
          y: 0,
        });
      }
      series2.find(
        (serie) => serie.name
          === item[
            '1_2_existe_t_il_un_document_cadre_charte_politique_precisant_votre_politique_de_science_ouverte'
          ],
      ).y += 1;
    });
    series2 = series2
      .map((item) => ({
        ...item,
        color: colorFromPolicyExists[item?.name] ?? getCSSValue('--g-500'),
        name: intl.formatMessage({
          id: `other.policy.${item.name.toLowerCase()}`,
          default: 'Pas de réponse',
        }),
        order: orderFromPolicyExists[item?.name] ?? 0,
        total: data.length,
        y_percent: (item.y / data.length) * 100,
      }))
      .sort((a, b) => b.order - a.order);
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
    setChartComments1(
      customComments(
        {
          comments: {},
          ctas: ['https://hal-lara.archives-ouvertes.fr/hal-04842977'],
        },
        id1,
        intl,
      ),
    );
    setChartComments2(
      customComments(
        {
          comments: {},
          ctas: ['https://hal-lara.archives-ouvertes.fr/hal-04842977'],
        },
        id2,
        intl,
      ),
    );
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
              <FormattedMessage
                id='other.policy.open-science-policy-contact'
                values={{
                  cta0: (chunks) => (
                    <a
                      className='external_link'
                      href='https://hal-lara.archives-ouvertes.fr/hal-04842977'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta1: (chunks) => (
                    <a
                      className='external_link'
                      href='https://www.ouvrirlascience.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta2: (chunks) => (
                    <a
                      className='external_link'
                      href='mailto:coso@recherche.gouv.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  linebreak: (chunks) => (
                    <>
                      {chunks}
                      <br />
                    </>
                  ),
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col n='12' className='fr-mt-5w'>
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
          <Row>
            <Col n='12' className='fr-mt-5w'>
              <span>
                <h3 className='fs-16-24 marianne-bold'>
                  <FormattedMessage
                    id='other.policy.open-science-table.title'
                    defaultMessage='Etablissements ayant publié en ligne un document de politique de science ouverte'
                  />
                </h3>
              </span>
              <table>
                <thead>
                  <tr>
                    <th scope='col'>
                      <FormattedMessage
                        id='other.policy.institutions'
                        defaultMessage='Etablissement'
                      />
                    </th>
                    <th scope='col'>
                      <FormattedMessage
                        id='other.policy.publication_year'
                        defaultMessage='Année de publication du document-cadre'
                      />
                    </th>
                    <th scope='col'>
                      <FormattedMessage
                        id='other.policy.link'
                        defaultMessage='Lien vers le document-cadre le plus récent'
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter(
                      (item) => item?.lien_vers_le_document_cadre_le_plus_recent,
                    )
                    .map((item) => (
                      <tr>
                        <td>{item.uo_lib}</td>
                        <td>
                          {
                            item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
                          }
                        </td>
                        <td>
                          <a
                            href={
                              item.lien_vers_le_document_cadre_le_plus_recent
                            }
                            rel='noreferrer'
                            target='_blank'
                          >
                            <FormattedMessage
                              id='other.policy.link2'
                              defaultMessage='lien'
                            />
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col n='12' className='fr-mt-5w'>
              <FormattedMessage
                id='other.policy.open-science-policy-contact'
                values={{
                  cta0: (chunks) => (
                    <a
                      className='external_link'
                      href='https://hal-lara.archives-ouvertes.fr/hal-04842977'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta1: (chunks) => (
                    <a
                      className='external_link'
                      href='https://www.ouvrirlascience.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta2: (chunks) => (
                    <a
                      className='external_link'
                      href='mailto:coso@recherche.gouv.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  linebreak: (chunks) => (
                    <>
                      {chunks}
                      <br />
                    </>
                  ),
                }}
              />
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Policy;
