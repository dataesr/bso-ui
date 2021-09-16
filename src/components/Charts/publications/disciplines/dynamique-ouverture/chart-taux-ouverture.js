/* eslint-disable react/no-this-in-sfc */
import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphComments, id, domain }) => {
  const intl = useIntl();
  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);
  let graphs = [];

  data.forEach((oneGraph) => {
    const optionsGraph = chartOptions[id].getOptions(
      idWithDomain,
      intl,
      oneGraph,
    );
    graphs.push(optionsGraph);
  });

  const serieLength = graphs[0]?.series[0].data.length - 1;
  // classement par ordre décroissant (en taux d'oa) des disciplines
  graphs = graphs.sort(
    (a, b) => b.series[0].data[serieLength].y - a.series[0].data[serieLength].y,
  );

  console.log('tttt', data);
  return (
    <WrapperChart
      id={id}
      domain={domain}
      graphComments={graphComments}
      isLoading={isLoading || !data || data.length <= 0}
      isError={isError}
    >
      <Container>
        <Row>
          {graphs.map((graphOptions, i) => (
            <Col n='3' key={graphOptions.series[0].name}>
              <HighchartsReact
                highcharts={Highcharts}
                options={graphOptions}
                id={`${idWithDomain}-${i}`}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphComments: true,
  id: 'publi.disciplines.dynamique-ouverture.chart-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
