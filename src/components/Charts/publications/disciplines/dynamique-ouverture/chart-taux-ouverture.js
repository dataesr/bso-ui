/* eslint-disable react/no-this-in-sfc */
import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const [chartComments, setChartComments] = useState('');
  const intl = useIntl();
  const { observationSnaps } = useGlobals();
  const { data, isError, isLoading } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);
  let graphs = [];
  if (data.dataHist) {
    data?.dataHist.forEach((oneGraph) => {
      const optionsGraph = chartOptions[id].getOptions(
        idWithDomain,
        intl,
        oneGraph,
      );
      graphs.push(optionsGraph);
    });
  }
  const serieLength = graphs[0]?.series[0].data.length - 1;
  // classement par ordre décroissant (en taux d'oa) des disciplines
  graphs = graphs.sort(
    (a, b) => b.series[0].data[serieLength].y - a.series[0].data[serieLength].y,
  );

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <WrapperChart
      domain={domain}
      enableExport={false}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !data || data.length <= 0}
    >
      <Container>
        <Row>
          {graphs.map((graphOptions, i) => (
            <Col n='3' key={graphOptions.series[0].name}>
              <HighchartsReact
                highcharts={Highcharts}
                id={`${idWithDomain}-${i}`}
                options={graphOptions}
              />
            </Col>
          ))}
        </Row>
      </Container>
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.disciplines.dynamique-ouverture.chart-taux-ouverture',
};

Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
