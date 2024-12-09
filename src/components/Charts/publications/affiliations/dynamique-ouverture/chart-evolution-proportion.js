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
import { capitalize, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [affiliation, setAffiliation] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isError, isLoading } = useGetData(
    observationSnaps,
    lastObservationSnap,
    affiliation,
    domain,
  );
  const { categories, dataGraph2 } = data;
  const idWithDomain = withDomain(id, domain);
  const affiliationTitle = affiliation !== '*'
    ? ` (${intl.formatMessage({ id: `app.affiliations.${affiliation}` })})`
    : '';
  const dataTitle = { affiliationTitle };
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph2,
    categories,
    dataTitle,
  );

  useEffect(() => {
    setChartComments(customComments(dataGraph2, idWithDomain, intl));

    const opts = data?.affiliations || [];
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-affiliations' })),
      value: '*',
    });
    setOptions(opts);
  }, [data?.affiliations, dataGraph2, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph2}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.affiliations-filter-label' })}
        onChange={(e) => setAffiliation(e.target.value)}
        options={options}
        selected={affiliation}
      />
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
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.affiliations.dynamique-ouverture.chart-evolution-proportion',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
