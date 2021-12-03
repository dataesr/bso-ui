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
import { domains, graphIds } from '../../../../../utils/constants';
import { capitalize, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [affiliation, setAffiliation] = useState('*');
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    lastObservationSnap,
    affiliation,
    domain,
  );
  const { dataGraph1 } = data;
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    setChartComments(customComments(dataGraph1, idWithDomain, intl));
  }, [dataGraph1, idWithDomain, intl]);

  const affiliationTitle = affiliation !== '*'
    ? ` (${intl.formatMessage({ id: `app.affiliations.${affiliation}` })})`
    : '';
  const dataTitle = { affiliationTitle };

  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph1,
    dataTitle,
  );

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph1}
    >
      <SimpleSelect
        firstLabel={capitalize(
          intl.formatMessage({ id: 'app.all-affiliations' }),
        )}
        firstValue='*'
        label={intl.formatMessage({ id: 'app.affiliations-filter-label' })}
        onChange={(e) => setAffiliation(e.target.value)}
        options={data?.affiliations || []}
        selected={affiliation}
      />
      <HighchartsReact
        id={idWithDomain}
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.affiliations.dynamique-ouverture.chart-taux-ouverture',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};
export default Chart;
