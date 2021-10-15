/* eslint-disable react/no-this-in-sfc */
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
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [affiliation, setAffiliation] = useState('*');
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    lastObservationSnap,
    affiliation,
    domain,
  );
  const { dataGraph2 } = data;
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph2,
  );

  useEffect(() => {
    setChartComments(customComments(dataGraph2, idWithDomain, intl));
  }, [dataGraph2, idWithDomain, intl]);

  return (
    <WrapperChart
      domain={domain}
      isLoading={isLoading || !dataGraph2}
      isError={isError}
      id={id}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={false}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.affiliations-filter-label' })}
        onChange={(e) => setAffiliation(e.target.value)}
        options={data?.affiliations || []}
        selected={affiliation}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-affiliations' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'publi.affiliations.dynamique-ouverture.chart-evolution-proportion',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
