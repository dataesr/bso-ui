import './chart-evolution-nombre.scss';
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
import { withDomain, withtStudyType } from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({ domain, hasComments, hasFooter, id, studyType }) {
  const intl = useIntl();
  const chartRef = useRef();
  const [chartComments, setChartComments] = useState('');
  const [sort, setSort] = useState('sort-staff');
  const { allData, isError, isLoading } = useGetData(studyType);
  const { dataGraph2, yearMax, yearMin } = allData;
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);
  const [optionsGraph, setOptionsGraph] = useState(null);

  useEffect(() => {
    if (dataGraph2) {
      if (sort === 'sort-staff') {
        dataGraph2?.series2?.[0]?.data?.sort((a, b) => b.y_tot - a.y_tot);
      } else {
        dataGraph2?.series2?.[0]?.data?.sort((a, b) => b.y - a.y);
      }
      dataGraph2.categories2 = (dataGraph2?.series2?.[0]?.data ?? []).map((d) => `<b>${d.name}</b> (${d.y_tot} ${intl.formatMessage({ id: 'app.health-interventional.promoteurs.dynamique-ouverture.chart-evolution-nombre.label' })})`);
      setOptionsGraph(chartOptions[id].getOptions(idWithDomain, intl, dataGraph2, studyType));
      setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
    }
  }, [allData, dataGraph2, id, idWithDomain, idWithDomainAndStudyType, intl, sort, studyType]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={{ yearMax, yearMin }}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !allData}
      studyType={studyType}
    >
      <RadioGroup
        className='d-inline-block'
        isInline
        legend={intl.formatMessage({ id: 'app.publi.sort' })}
        onChange={(newValue) => setSort(newValue)}
        value={sort}
      >
        <Radio
          label={intl.formatMessage({ id: 'app.publi.sort-staff' })}
          value='sort-staff'
        />
        <Radio
          label={intl.formatMessage({ id: 'app.publi.sort-percent' })}
          value='sort-percent'
        />
      </RadioGroup>
      {/* Add home made legend */}
      <div className='legend'>
        <span>
          <span className='legend-bullet legend-academique' />
          <span className='px-7 legend-label'>
            {intl.formatMessage({ id: 'app.sponsor.academique' })}
          </span>
        </span>
        <span className='px-20'>
          <span className='legend-bullet legend-industriel' />
          <span className='px-7 legend-label'>
            {intl.formatMessage({ id: 'app.sponsor.industriel' })}
          </span>
        </span>
      </div>
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

Chart.defaultProps = {
  domain: 'health',
  hasComments: true,
  hasFooter: true,
  id: 'promoteurs.dynamique-ouverture.chart-evolution-nombre',
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
