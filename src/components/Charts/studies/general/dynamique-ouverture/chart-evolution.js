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
import { domains, graphIds, studiesTypes } from '../../../../../utils/constants';
import { withDomainAndStudyType } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { observationSnaps } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isLoading, isError } = useGetData(observationSnaps, studyType);
  const idWithDomainAndStudyType = withDomainAndStudyType(id, domain, studyType);

  return (
    <div>
      {idWithDomainAndStudyType}
    </div>
  );
//   const { dataGraph1 } = data;

//   useEffect(() => {
//     setChartComments(customComments(dataGraph1, idWithDomainAndStudyType, intl));
//   }, [dataGraph1, idWithDomainAndStudyType, intl]);

//   const optionsGraph = chartOptions[id].getOptions(
//     idWithDomainAndStudyType,
//     intl,
//     dataGraph1,
//   );

//   return (
//     <WrapperChart
//       isLoading={isLoading || !dataGraph1}
//       isError={isError}
//       id={id}
//       domain={domain}
//       chartRef={chartRef}
//       graphFooter={graphFooter}
//       graphComments={false}
//     >
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={optionsGraph}
//         ref={chartRef}
//         id={idWithDomainAndStudyType}
//       />
//       {graphComments && <GraphComments comments={chartComments} />}
//     </WrapperChart>
//   );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  domain: 'health',
  studyType: 'interventional',
  id: 'studies.general.dynamique.chart-evolution',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
