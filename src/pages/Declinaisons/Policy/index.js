import { Alert, Col, Container, Row } from '@dataesr/react-dsfr';
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

function Policy() {
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
    const dataFitered = data.filter((item) => SELECTED_TYPES.includes(item.type)).length;
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
        total: dataFitered,
        y_abs: yAbs,
        y_tot: dataFitered,
        y: (yAbs / dataFitered) * 100,
        y_percent: (yAbs / dataFitered) * 100,
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
    optionsTmp.yAxis = { ...getPercentageYAxis() };
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
    // @eric: MEP policy
    if (!isInProduction()) {
      optionsTmp.series.push(
        {
          color: getCSSValue('--ouvrir-la-science-purple'),
          data: [
            {
              name: 2016,
              y: 4.0927265729,
              y_abs: 5210.0,
              y_tot: 127299.0,
              y_percent: 4.0927265729,
            },
            {
              name: 2017,
              y: 4.0927265729,
              y_abs: 5210.0,
              y_tot: 127299.0,
              y_percent: 4.0927265729,
            },
            {
              name: 2018,
              y: 4.2356970597,
              y_abs: 5392.0,
              y_tot: 127299.0,
              y_percent: 4.2356970597,
            },
            {
              name: 2019,
              y: 30.7692911963,
              y_abs: 39169.0,
              y_tot: 127299.0,
              y_percent: 30.7692911963,
            },
            {
              name: 2020,
              y: 32.3796730532,
              y_abs: 41219.0,
              y_tot: 127299.0,
              y_percent: 32.3796730532,
            },
            {
              name: 2021,
              y: 56.3861460027,
              y_abs: 71779.0,
              y_tot: 127299.0,
              y_percent: 56.3861460027,
            },
            {
              name: 2022,
              y: 71.8183175045,
              y_abs: 91424.0,
              y_tot: 127299.0,
              y_percent: 71.8183175045,
            },
            {
              name: 2023,
              y: 77.4020220112,
              y_abs: 98532.0,
              y_tot: 127299.0,
              y_percent: 77.4020220112,
            },
            {
              name: 2024,
              y: 85.5701930102,
              y_abs: 108930.0,
              y_tot: 127299.0,
              y_percent: 85.5701930102,
            },
            {
              name: 2025,
              y: 86.7650177928,
              y_abs: 110451.0,
              y_tot: 127299.0,
              y_percent: 86.7650177928,
            },
            {
              name: 2026,
              y: 87.0635276004,
              y_abs: 110831.0,
              y_tot: 127299.0,
              y_percent: 87.0635276004,
            },
          ],
          marker: { symbol: 'circle' },
          name: intl.formatMessage({ id: 'other.policy.open-science-policy.legend-researchers' }),
          tooltip: {
            pointFormat: intl.formatMessage({ id: 'other.policy.open-science-policy.tooltip-employees' }),
          },
        },
      );
    }
    optionsTmp.exporting.chartOptions.legend.enabled = false;
    optionsTmp.tooltip.shared = true;
    setOptions(optionsTmp);
    const optionsSelectedTypesTmp = { ...optionsTmp };
    optionsSelectedTypesTmp.series = [
      {
        color: getCSSValue('--ouvrir-la-science-blue'),
        data: Object.values(seriesSelectedTypes),
        marker: { symbol: 'circle' },
        name: intl.formatMessage({ id: 'other.policy.open-science-policy.legend-structures' }),
        tooltip: {
          pointFormat: intl.formatMessage({ id: 'other.policy.open-science-policy.tooltip-structures' }),
        },
      },
    ];
    // @eric: MEP policy
    if (!isInProduction()) {
      optionsSelectedTypesTmp.series.push(
        {
          color: getCSSValue('--ouvrir-la-science-purple'),
          data: [
            {
              name: 2016,
              y: 0.0,
              y_abs: 0.0,
              y_tot: 76700.0,
              y_percent: 0.0,
            },
            {
              name: 2017,
              y: 0.0,
              y_abs: 0.0,
              y_tot: 76700.0,
              y_percent: 0.0,
            },
            {
              name: 2018,
              y: 0.2372881356,
              y_abs: 182.0,
              y_tot: 76700.0,
              y_percent: 0.2372881356,
            },
            {
              name: 2019,
              y: 15.5723598435,
              y_abs: 11944.0,
              y_tot: 76700.0,
              y_percent: 15.5723598435,
            },
            {
              name: 2020,
              y: 17.1147327249,
              y_abs: 13127.0,
              y_tot: 76700.0,
              y_percent: 17.1147327249,
            },
            {
              name: 2021,
              y: 42.7144719687,
              y_abs: 32762.0,
              y_tot: 76700.0,
              y_percent: 42.7144719687,
            },
            {
              name: 2022,
              y: 65.2033898305,
              y_abs: 50011.0,
              y_tot: 76700.0,
              y_percent: 65.2033898305,
            },
            {
              name: 2023,
              y: 73.1747066493,
              y_abs: 56125.0,
              y_tot: 76700.0,
              y_percent: 73.1747066493,
            },
            {
              name: 2024,
              y: 80.258148631,
              y_abs: 61558.0,
              y_tot: 76700.0,
              y_percent: 80.258148631,
            },
            {
              name: 2025,
              y: 82.2411994785,
              y_abs: 63079.0,
              y_tot: 76700.0,
              y_percent: 82.2411994785,
            },
            {
              name: 2026,
              y: 82.2411994785,
              y_abs: 63079.0,
              y_tot: 76700.0,
              y_percent: 82.2411994785,
            },
          ],
          marker: { symbol: 'circle' },
          name: intl.formatMessage({ id: 'other.policy.open-science-policy.legend-researchers' }),
          tooltip: {
            pointFormat: intl.formatMessage({ id: 'other.policy.open-science-policy.tooltip-employees' }),
          },
        },
      );
    }
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
                date='2025-07-17'
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
                <Alert
                  description={intl.formatMessage({
                    id: 'app.commons.graph-warning',
                  })}
                />
                <ChartWrapper
                  chartRef={chartRefSelectedTypes}
                  date='2025-04-02'
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
                    id='other.policy.secret-stat.title'
                    defaultMessage='Etablissements sous secret statistique'
                  />
                </h3>
              </span>
              <ul>
                <li>Ecole d'ingénieur généraliste en informatique et technologies du numérique</li>
                <li>Institut national d'enseignement supérieur pour l'agriculture, l'alimentation et l'environnement</li>
                <li>Institut Pasteur</li>
                <li>Ecole supérieure d'agriculture</li>
                <li>Ecole supérieure des sciences économiques et commerciales</li>
                <li>Institut supérieur d'électronique de Paris</li>
                <li>Montpellier Business School</li>
                <li>Institut des sciences et industries du vivant et de l'environnement</li>
                <li>Institut Mines-Télécom</li>
                <li>Skema Business School</li>
                <li>Vet Agro Sup</li>
              </ul>
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
}

export default Policy;
