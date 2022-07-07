/* eslint-disable react/no-this-in-sfc */
import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsAnnotations from 'highcharts/modules/annotations';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { getObservationLabel, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);
HighchartsAnnotations(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isError, isLoading } = useGetData(lastObservationSnap, domain);
  const idWithDomain = withDomain(id, domain);
  const graphs = [];

  const dataTitle = {
    observationYear: getObservationLabel(lastObservationSnap, intl),
  };
  data?.tab?.forEach((oneGraph) => {
    const optionsGraph = chartOptions[id].getOptions(
      idWithDomain,
      intl,
      oneGraph,
    );
    graphs.push(optionsGraph);
  });

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <WrapperChart
      dataTitle={dataTitle}
      domain={domain}
      enableExport={false}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !data}
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
  id: 'publi.repositories.dynamique-depot.chart-nombre-documents-depots',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
