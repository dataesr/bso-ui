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
const SELECTED_TYPES = ['Grand établissement', 'Université'];
const START_YEAR = 2016;

const Policy = () => {
  const [chartComments, setChartComments] = useState('');
  const [chartCommentsSelectedTypes, setChartCommentsSelectedTypes] = useState('');
  const [data, setData] = useState([]);
  const [options, setOptions] = useState();
  const [optionsSelectedTypes, setOptionsSelectedTypes] = useState();

  const intl = useIntl();
  const chartRef = useRef();
  const chartRefSelectedTypes = useRef();

  const id = 'other.policy.open-science-policy';
  const idSelectedTypes = 'other.policy.open-science-policy-selected-types';

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
    const tmpSelectedTypes = {};
    years.forEach((year) => {
      tmp[year] = { y: 0, y_percent: 0, y_tot: data.length, y_abs: 0 };
      tmpSelectedTypes[year] = {
        y: 0,
        y_percent: 0,
        y_tot: data.length,
        y_abs: 0,
      };
    });
    const lll = data.filter((item) => SELECTED_TYPES.includes(item.type)).length;
    data.forEach((item) => {
      if (
        item?.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
      ) {
        tmp[
          item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre.split(
            ',',
          )[0]
        ].y_abs += 1;
        if (SELECTED_TYPES.includes(item.type)) {
          tmpSelectedTypes[
            item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre.split(
              ',',
            )[0]
          ].y_abs += 1;
        }
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
    const seriesSelectedTypes = {};
    Object.keys(tmpSelectedTypes).forEach((year) => {
      const yAbs = Object.keys(tmpSelectedTypes)
        .filter((key) => key <= year)
        .reduce((acc, curr) => acc + tmpSelectedTypes[curr].y_abs, 0);
      seriesSelectedTypes[year] = {
        name: year,
        total: lll,
        y_abs: yAbs,
        y_tot: lll,
        y: (yAbs / lll) * 100,
        y_percent: (yAbs / lll) * 100,
      };
    });
    const optionsTmp = getGraphOptions({ id, intl });
    optionsTmp.xAxis.tickInterval = 1;
    optionsTmp.xAxis.plotBands = [
      {
        from: 2018,
        to: 2021,
        color: getCSSValue('--ouvrir-la-science-green'),
      },
      {
        from: 2021,
        to: 2025,
        color: getCSSValue('--ouvrir-la-science-yellow'),
      },
    ];
    optionsTmp.yAxis = getPercentageYAxis();
    optionsTmp.legend.enabled = false;
    optionsTmp.plotOptions = {
      series: {
        color: getCSSValue('--ouvrir-la-science-blue'),
        pointStart: START_YEAR,
      },
    };
    optionsTmp.series = [
      {
        data: Object.values(series),
      },
    ];
    optionsTmp.exporting.chartOptions.legend.enabled = false;
    setOptions(optionsTmp);
    const optionsSelectedTypesTmp = { ...optionsTmp };
    optionsSelectedTypesTmp.series = [
      {
        data: Object.values(seriesSelectedTypes),
      },
    ];
    setOptionsSelectedTypes(optionsSelectedTypesTmp);
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
    setChartCommentsSelectedTypes(
      customComments(
        {
          comments: {},
          ctas: ['https://hal-lara.archives-ouvertes.fr/hal-04842977'],
        },
        idSelectedTypes,
        intl,
      ),
    );
  }, [id, idSelectedTypes, intl]);

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
                chartRef={chartRef}
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
          {!isInProduction() && (
            <Row>
              <Col n='12' className='fr-mt-5w'>
                <ChartWrapper
                  chartRef={chartRefSelectedTypes}
                  domain=''
                  hasComments={false}
                  id={idSelectedTypes}
                  isError={false}
                  isLoading={false}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    id={idSelectedTypes}
                    options={optionsSelectedTypes}
                    ref={chartRefSelectedTypes}
                  />
                  {chartCommentsSelectedTypes && (
                    <GraphComments
                      comments={chartCommentsSelectedTypes}
                      hasFooter
                    />
                  )}
                </ChartWrapper>
              </Col>
            </Row>
          )}
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
                      <tr key={item.identifiant_ror}>
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
