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
import {
  getCSSValue,
  getPercentageYAxis,
  isInProduction,
} from '../../../utils/helpers';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const END_YEAR = new Date().getFullYear();
const OPENDATASOFT_LIMIT = 100;
const START_YEAR = 2016;

function Policy() {
  const [chartComments, setChartComments] = useState('');
  const [chartCommentsStaff, setChartCommentsStaff] = useState('');
  const [data, setData] = useState([]);
  const [options, setOptions] = useState();
  const [optionsStaff, setOptionsStaff] = useState();
  const intl = useIntl();
  const chartRef = useRef();
  const id = 'other.policy.open-science-policy';
  const idStaff = 'other.policy.open-science-policy-staff';

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
    years.forEach((year) => {
      tmp[year] = { y: 0, y_percent: 0, y_tot: data.length, y_abs: 0 };
    });
    data.forEach((item) => {
      if (
        item?.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
      ) {
        tmp[
          item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre.split(
            ',',
          )[0]
        ].y_abs += 1;
      }
    });
    const series = {};
    Object.keys(tmp).forEach((year) => {
      const yAbs = Object.keys(tmp)
        .filter((key) => key <= year)
        .reduce((acc, curr) => acc + tmp[curr].y_abs, 0);
      series[year] = {
        name: year,
        total: data.length,
        y_abs: yAbs,
        y_tot: data.length,
        y: (yAbs / data.length) * 100,
        y_percent: (yAbs / data.length) * 100,
      };
    });
    const optionsTmp = getGraphOptions({ id, intl });
    optionsTmp.xAxis.tickInterval = 1;
    optionsTmp.xAxis.plotBands = [
      {
        color: getCSSValue('--ouvrir-la-science-green'),
        from: 2018,
        label: { text: 'PNSO 1' },
        to: 2021,
      },
      {
        color: getCSSValue('--ouvrir-la-science-yellow'),
        from: 2021,
        label: { text: 'PNSO 2' },
        to: END_YEAR,
      },
    ];
    optionsTmp.yAxis = { ...getPercentageYAxis(), max: 100 };
    optionsTmp.legend.enabled = true;
    optionsTmp.plotOptions = {
      series: {
        pointStart: START_YEAR,
      },
    };
    optionsTmp.series = [
      {
        color: getCSSValue('--ouvrir-la-science-blue'),
        data: Object.values(series),
        marker: { symbol: 'circle' },
        name: intl.formatMessage({ id: 'other.policy.open-science-policy.legend-structures' }),
        tooltip: {
          pointFormat: intl.formatMessage({ id: 'other.policy.open-science-policy.tooltip-structures' }),
        },
      },
    ];
    optionsTmp.exporting.chartOptions.legend.enabled = false;
    optionsTmp.tooltip.shared = true;
    setOptions(optionsTmp);
    if (!isInProduction()) {
      const optionsTmpStaff = { ...optionsTmp };
      optionsTmpStaff.series = [
        {
          color: getCSSValue('--ouvrir-la-science-purple'),
          data: [
            {
              name: 2016,
              y: 3.9410879218,
              y_abs: 5210,
              y_tot: 132197,
              y_percent: 3.9410879218,
            },
            {
              name: 2017,
              y: 3.9410879218,
              y_abs: 5210,
              y_tot: 132197,
              y_percent: 3.9410879218,
            },
            {
              name: 2018,
              y: 4.0787612427,
              y_abs: 5392,
              y_tot: 132197,
              y_percent: 4.0787612427,
            },
            {
              name: 2019,
              y: 29.6292654145,
              y_abs: 39169,
              y_tot: 132197,
              y_percent: 29.6292654145,
            },
            {
              name: 2020,
              y: 31.43944265,
              y_abs: 41562,
              y_tot: 132197,
              y_percent: 31.43944265,
            },
            {
              name: 2021,
              y: 54.7970074964,
              y_abs: 72440,
              y_tot: 132197,
              y_percent: 54.7970074964,
            },
            {
              name: 2022,
              y: 71.4010151516,
              y_abs: 94390,
              y_tot: 132197,
              y_percent: 71.4010151516,
            },
            {
              name: 2023,
              y: 76.777839134,
              y_abs: 101498,
              y_tot: 132197,
              y_percent: 76.777839134,
            },
            {
              name: 2024,
              y: 85.3309833052,
              y_abs: 112805,
              y_tot: 132197,
              y_percent: 85.3309833052,
            },
            {
              name: 2025,
              y: 86.4815389154,
              y_abs: 114326,
              y_tot: 132197,
              y_percent: 86.4815389154,
            },
            {
              name: 2026,
              y: 87.5428338011,
              y_abs: 115729,
              y_tot: 132197,
              y_percent: 87.5428338011,
            },
          ],
          marker: { symbol: 'square' },
          name: intl.formatMessage({ id: 'other.policy.open-science-policy.legend-researchers' }),
          tooltip: {
            pointFormat: intl.formatMessage({ id: 'other.policy.open-science-policy.tooltip-employees' }),
          },
        },
      ];
      optionsTmpStaff.exporting.chartOptions.legend.enabled = false;
      optionsTmpStaff.tooltip.shared = true;
      setOptionsStaff(optionsTmpStaff);
    }
  }, [data, intl]);

  useEffect(() => {
    setChartComments(
      customComments(
        {
          comments: {},
          ctas: ['https://hal-lara.archives-ouvertes.fr/hal-04842977'],
        },
        id,
        intl,
      ),
    );
    setChartCommentsStaff(
      customComments(
        {
          comments: { first: optionsStaff?.series?.[0]?.data?.[2]?.y.toFixed(0), last: optionsStaff?.series?.[0]?.data?.[10]?.y.toFixed(0) },
        },
        idStaff,
        intl,
      ),
    );
  }, [id, idStaff, intl, optionsStaff]);

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
          {!isInProduction() && (
            <Row>
              <Col n='12' className='fr-mt-5w'>
                <ChartWrapper
                  chartRef={chartRef}
                  date='2026-07-20'
                  domain=''
                  hasComments={false}
                  id={idStaff}
                  isError={false}
                  isLoading={false}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    id={id}
                    options={optionsStaff}
                    ref={chartRef}
                  />
                  {chartCommentsStaff && (
                    <GraphComments comments={chartCommentsStaff} hasFooter />
                  )}
                </ChartWrapper>
              </Col>
            </Row>
          )}
          <Row>
            <Col n='12' className='fr-mt-5w'>
              <ChartWrapper
                chartRef={chartRef}
                date='2026-07-20'
                domain=''
                hasComments={false}
                id={id}
                isError={false}
                isLoading={false}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  id={id}
                  options={options}
                  ref={chartRef}
                />
                {chartComments && (
                  <GraphComments comments={chartComments} hasFooter />
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
                    defaultMessage='Etablissements ayant adopté une politique de science ouverte'
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
                        defaultMessage='Années de publication du document-cadre'
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
                      (item) => item?.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre,
                    )
                    .map((item) => (
                      <tr key={item.identifiant_ror}>
                        <td>{item.uo_lib}</td>
                        <td>
                          {
                            item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
                          }
                        </td>
                        <td>
                          {
                            item?.lien_vers_le_document_cadre_le_plus_recent ? (
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
                            ) : ''
                          }
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
}

export default Policy;
