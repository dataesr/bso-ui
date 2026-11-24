import './chart-evolution-nombre.scss';
import '../../../graph.scss';

import { Radio, RadioGroup } from '@dataesr/react-dsfr';
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
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [sort, setSort] = useState('sort-staff');
  const { allData, isError, isLoading } = useGetData(studyType);
  const { series2, yearMax, yearMin } = allData;
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);

  useEffect(() => {
    let sortKey;
    if (sort === 'sort-staff') {
      series2?.[0]?.data?.sort((a, b) => b.y_tot - a.y_tot);
      sortKey = 'y_tot';
    } else {
      series2?.[0]?.data?.sort((a, b) => b.y - a.y);
      sortKey = 'y';
    }
    const categories = series2?.[0]?.data?.map((d) => d.name);
    setOptionsGraph(chartOptions[id].getOptions(idWithDomain, intl, categories, series2, studyType, sortKey));
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, id, idWithDomain, idWithDomainAndStudyType, intl, series2, sort, studyType]);

  useEffect(() => {
  }, [allData, idWithDomainAndStudyType, intl]);

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
        onChange={(newValue) => {
          setOptionsGraph(
            chartOptions[id].getOptions(
              idWithDomain,
              intl,
              [],
              [],
              studyType,
              'y_tot',
            ),
          );
          setSort(newValue);
        }}
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
