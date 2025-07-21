import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({ domain, hasComments, hasFooter, id }) {
  const chartRef = useRef();
  const intl = useIntl();
  const idWithDomain = withDomain(id, domain);
  const { beforeLastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isError, isLoading } = useGetData(
    beforeLastObservationSnap,
    intl,
  );

  const graphs = [];
  if (data?.dataGraph) {
    data.dataGraph.series?.[0]?.data.forEach((oneGraph) => {
      const optionsGraph1 = chartOptions[id].getOptions(idWithDomain, intl, {
        data: oneGraph.by_year,
        name: oneGraph.label,
      });
      graphs.push(optionsGraph1);
    });
  }

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
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
    </ChartWrapper>
  );
}

// TODO remove publi studyType from id
Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.others.hal-no-doi.hal-no-doi-by-field-by-year',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
