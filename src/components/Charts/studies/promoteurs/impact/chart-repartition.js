import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import {
  domains,
  graphIds,
  studiesTypes,
} from '../../../../../utils/constants';
import { withDomain, withtStudyType } from '../../../../../utils/helpers';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { allData, isLoading, isError } = useGetData(studyType);
  const { dataGraph1 } = allData;
  const idWithDomainAndStudyType = withtStudyType(
    withDomain(id, domain),
    studyType,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph1,
    studyType,
  );

  return (
    <WrapperChart
      isLoading={isLoading || !allData}
      isError={isError}
      studyType={studyType}
      id={id}
      domain={domain}
      chartRef={chartRef}
      hasFooter={hasFooter}
      hasComments={false}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomainAndStudyType}
      />
      {hasComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  hasFooter: true,
  hasComments: true,
  domain: 'health',
  studyType: 'Interventional',
  id: 'promoteurs.impact.chart-repartition',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
