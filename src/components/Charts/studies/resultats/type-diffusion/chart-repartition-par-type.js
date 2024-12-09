import '../../../graph.scss';

import { Radio, RadioGroup } from '@dataesr/react-dsfr';
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
import {
  capitalize,
  cleanNumber,
  withContext,
  withDomain,
} from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [dataTitle, setDataTitle] = useState();
  const [options, setOptions] = useState([]);
  const [optionsGraph, setOptionsGraph] = useState();
  const [sort, setSort] = useState('sort-staff');
  const [sponsorType, setSponsorType] = useState('*');

  const { allData, isError, isLoading } = useGetData(studyType, sponsorType);
  const idWithDomainAndStudyType = withContext(id, domain, studyType);

  useEffect(() => {
    if (allData?.dataGraph2) {
      const field = sort === 'sort-percent' ? 'y_percent_results' : 'y_tot';
      const opts = {};
      // Deep copy
      const dataCopy = JSON.parse(JSON.stringify(allData.dataGraph2));
      opts.series = dataCopy.map((serie) => ({
        ...serie,
        data: serie.data.sort((a, b) => b[field] - a[field]),
      }));
      opts.categories = opts.series[0].data.map((item) => capitalize(item.intervention_type)
        .concat('<br><i>(')
        .concat(
          intl.formatMessage({
            id: 'app.effectif',
            defaultMessage: 'effectif',
          }),
        )
        .concat(' = ')
        .concat(cleanNumber(item.y_tot))
        .concat(')</i>'));
      setOptionsGraph(
        chartOptions[id].getOptions(
          withDomain(id, domain),
          intl,
          opts,
          studyType,
          dataTitle,
        ),
      );
    }
  }, [dataTitle, allData.dataGraph2, id, domain, intl, studyType, sort]);

  useEffect(() => {
    const translationId = sponsorType !== '*' ? `app.sponsor.${sponsorType}` : '';
    const sponsorTypeTitle = sponsorType !== '*'
      ? ` (${intl.formatMessage({ id: translationId })})`
      : '';
    setDataTitle({ sponsorTypeTitle });
  }, [intl, sponsorType]);

  useEffect(() => {
    const opts = allData?.sponsorTypes || [];
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      value: '*',
    });
    setOptions(opts);
  }, [allData.sponsorTypes, intl]);

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

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
      <RadioGroup
        className='d-inline-block'
        isInline
        legend={intl.formatMessage({ id: 'app.publi.sort' })}
        onChange={(newSort) => setSort(newSort)}
        value={sort}
      >
        <Radio
          label={intl.formatMessage({ id: 'app.publi.sort-staff' })}
          value='sort-staff'
        />
        <Radio
          label={intl.formatMessage({ id: 'app.clinical-trials.sort-results' })}
          value='sort-percent'
        />
      </RadioGroup>
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
};

Chart.defaultProps = {
  domain: 'health',
  hasComments: true,
  hasFooter: true,
  id: 'resultats.type-diffusion.chart-repartition-par-type',
  studyType: 'Interventional',
};

Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
