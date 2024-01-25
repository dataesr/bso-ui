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
import { getObservationLabel, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const { allData, isError, isLoading } = useGetData(
    beforeLastObservationSnap,
    lastObservationSnap,
    domain,
    'datastet_details.has_created',
    false,
    false,
    'datastet_details.has_used',
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
  const hasBeta = true;
  useEffect(() => {
    setChartComments(customComments(allData, idWithDomain, intl));
  }, [allData, idWithDomain, intl]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasBeta={hasBeta}
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
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'data.general.voies-ouverture.chart-data-created',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
