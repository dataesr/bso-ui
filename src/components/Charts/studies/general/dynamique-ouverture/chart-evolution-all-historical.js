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
  id = 'general.dynamique.chart-evolution-all-historical',
  studyType = 'Interventional',
}) {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [collectedData, setCollectedData] = useState({});
  const [options, setOptions] = useState([]);
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [sponsorType, setSponsorType] = useState('*');
  const { allData, isError, isLoading } = useGetData(studyType, '*', false, sponsorType);
  const { dataTitle } = allData;

  const sponsorTypeTitle = sponsorType !== '*'
    ? ` (${intl.formatMessage({ id: `app.sponsor.${sponsorType}` })})`
    : '';
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);

  useEffect(() => {
    const opts = allData?.sponsorTypes || [];
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      value: '*',
    });
    setOptions(opts);
    const dgS = JSON.parse(JSON.stringify(allData?.dataGraph?.series ?? []));
    const tmpTmp = {};
    opts.forEach((o) => {
      const sponsorTypeI18nId = o.value === '*' ? 'app.all-sponsor-types' : `app.sponsor.${o.value}`;
      const series = dgS?.map((serie) => serie.data.find((item) => item.name === capitalize(intl.formatMessage({ id: sponsorTypeI18nId })))).reverse() ?? [];
      const categories = series.map((serie) => `${capitalize(intl.formatMessage({ id: 'app.observedin' }))} ${serie.observationSnap.substring(0, 4)}`);
      tmpTmp[o.value] = { categories, series: [{ data: series }] };
    });
    setCollectedData(tmpTmp);
  }, [allData?.sponsorTypes, allData?.dataGraph, intl]);

  useEffect(() => {
    setOptionsGraph(chartOptions[id].getOptions(
      idWithDomain,
      intl,
      collectedData[sponsorType],
      studyType,
    ));
    const comments = { comments: {
      academicMax: Math.round(collectedData?.academique?.series?.[0]?.data?.[0]?.y),
      academicMin: Math.round(collectedData?.academique?.series?.[0]?.data?.[collectedData?.academique?.series?.[0]?.data.length - 1]?.y),
      allMax: Math.round(collectedData?.['*']?.series?.[0]?.data?.[0]?.y),
      allMin: Math.round(collectedData?.['*']?.series?.[0]?.data?.[collectedData?.['*']?.series?.[0]?.data.length - 1]?.y),
      industrialMax: Math.round(collectedData?.industriel?.series?.[0]?.data?.[0]?.y),
      industrialMin: Math.round(collectedData?.industriel?.series?.[0]?.data?.[collectedData?.industriel?.series?.[0]?.data.length - 1]?.y),
      obsMax: collectedData?.['*']?.series?.[0]?.data?.[0]?.observationSnap?.substring(0, 4),
      obsMin: collectedData?.['*']?.series?.[0]?.data?.[collectedData?.['*']?.series?.[0]?.data?.length - 1]?.observationSnap?.substring(0, 4),
      yearMax: dataTitle?.yearMax,
      yearMin: dataTitle?.yearMin,
    } };
    setChartComments(customComments(comments, idWithDomainAndStudyType, intl));
  }, [dataTitle?.yearMax, dataTitle?.yearMin, id, idWithDomain, idWithDomainAndStudyType, intl, sponsorType, studyType, collectedData]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={{ ...dataTitle, sponsorTypeTitle }}
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
