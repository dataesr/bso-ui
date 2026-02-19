/* eslint-disable react/require-default-props */
import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import {
  domains,
  graphIds,
  studiesTypes,
} from '../../../../../utils/constants';
import { capitalize, withDomain, withtStudyType } from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data-historical';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({
  domain = 'health',
  hasComments = true,
  hasFooter = true,
  id = 'general.dynamique.chart-evolution-within-3-years-historical-all',
  studyType = 'Interventional',
}) {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [sponsorType, setSponsorType] = useState('*');
  const { allData, isError, isLoading } = useGetData(studyType, '*', false, sponsorType);
  const { dataTitle } = allData;

  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);

  useEffect(() => {
    const opts = allData?.sponsorTypes || [];
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      value: '*',
    });
    setOptions(opts);
  }, [allData, intl]);

  useEffect(() => {
    // Deepcopy of the collected data
    const dgS = JSON.parse(JSON.stringify(allData?.dataGraph?.series ?? []));
    const sponsorTypeI18nId = sponsorType === '*' ? 'app.all-sponsor-types' : `app.sponsor.${sponsorType}`;
    const series = dgS?.map((serie) => serie.data.find((item) => item.name === capitalize(intl.formatMessage({ id: sponsorTypeI18nId })))).reverse() ?? [];
    const categories = series.map((serie) => `${capitalize(intl.formatMessage({ id: 'app.observedin' }))} ${serie.observationSnap.substring(0, 4)}`);
    setOptionsGraph(chartOptions[id].getOptions(
      idWithDomain,
      intl,
      { categories, series: [{ data: series }] },
      studyType,
    ));
    const comments = { comments: {
      obsMax: series[0].observationSnap.substring(0, 4),
      obsMin: series[series.length - 1].observationSnap.substring(0, 4),
      valueMax: Math.round(series[0].y),
      valueMin: Math.round(series[series.length - 1].y),
      yearMax: dataTitle?.yearMax,
      yearMin: dataTitle?.yearMin,
    } };
    setChartComments(customComments(comments, idWithDomainAndStudyType, intl));
  }, [allData, dataTitle, id, idWithDomain, idWithDomainAndStudyType, intl, sponsorType, studyType]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !allData}
      studyType={studyType}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.sponsor-type-filter-label' })}
        onChange={(e) => setSponsorType(e.target.value)}
        options={options}
        selected={sponsorType}
      />
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomainAndStudyType}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </ChartWrapper>
  );
}

Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
