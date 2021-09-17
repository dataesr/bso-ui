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
import { withDomainAndStudyType } from '../../../../../utils/helpers';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { allData, isLoading, isError } = useGetData(studyType);
  const idWithDomainAndStudyType = withDomainAndStudyType(
    id,
    domain,
    studyType,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  const optionsGraph = chartOptions[id].getOptions(id, intl, allData);

  return (
    <WrapperChart
      isLoading={isLoading || !allData}
      isError={isError}
      id={id}
      domain={domain}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={false}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomainAndStudyType}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  domain: 'health',
  studyType: 'Interventional',
  id: 'studies.resultats.type-diffusion.chart-repartition',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
