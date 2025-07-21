import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../utils/chartComments';
import { chartOptions } from '../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../utils/constants';
import {
  getCSSValue,
  getObservationLabel,
  withDomain,
} from '../../../../utils/helpers';
import useGlobals from '../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../ChartWrapper';
import GraphComments from '../../graph-comments';
import useGetData from './get-data-indicator-these';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({ domain, hasComments, hasFooter, id }) {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const { allData, isError, isLoading } = useGetData(
    beforeLastObservationSnap,
    lastObservationSnap,
    domain,
    'has_these',
    'first_these_year',
    'has_orcid',
    'app.orcid.active',
    getCSSValue('--thesesfr'),
    100,
  );
  const { categories, dataGraph } = allData;
  const dataTitle = {
    observationYear: getObservationLabel(lastObservationSnap, intl),
  };
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    categories,
    dataGraph,
    dataTitle,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomain, intl));
  }, [allData, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph || !categories}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </ChartWrapper>
  );
}

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'orcid.general.chart-indicator-these-year',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
