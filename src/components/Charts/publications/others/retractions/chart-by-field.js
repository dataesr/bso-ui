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
import { domains, graphIds } from '../../../../../utils/constants';
import {
  capitalize,
  cleanNumber,
  withDomain,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data-by-field';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [sort, setSort] = useState('sort-count');
  const { observationSnaps } = useGlobals();
  const { data, isError, isLoading } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    let field = 'y_count';
    let yAxisTitleId = 'app.publi.nb-publications-retracted';
    switch (sort) {
    case 'sort-percent':
      field = 'y_percent';
      yAxisTitleId = 'app.publi.percent-publications-retracted';
      break;
    case 'sort-total':
      field = 'y_total';
      yAxisTitleId = 'app.publi.nb-publications';
      break;
    default:
    }

    const dataGraph = data
      .sort((a, b) => b[field] - a[field])
      .map((item) => ({ ...item, y: item[field] }));
    const categories = dataGraph.map((item) => capitalize(
      intl.formatMessage({
        id: `app.discipline.${item.field
          .replace(/\n/g, '')
          .replace('  ', ' ')}`,
      }),
    )
      .concat('</br>(')
      .concat(intl.formatMessage({ id: 'app.effectif-short' }))
      .concat(' = ')
      .concat(cleanNumber(item.y_total))
      .concat(')'));

    setOptionsGraph(
      chartOptions[id].getOptions(
        idWithDomain,
        intl,
        categories,
        [{ data: dataGraph }],
        sort,
        yAxisTitleId,
      ),
    );
  }, [data, id, idWithDomain, intl, sort]);

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !data}
    >
      <RadioGroup
        className='d-inline-block'
        isInline
        onChange={(newValue) => setSort(newValue)}
        value={sort}
      >
        <Radio
          label={intl.formatMessage({
            id: 'app.publi.display-count-retracted',
          })}
          value='sort-count'
        />
        <Radio
          label={intl.formatMessage({
            id: 'app.publi.display-percent-retracted',
          })}
          value='sort-percent'
        />
        <Radio
          label={intl.formatMessage({
            id: 'app.publi.display-total-retracted',
          })}
          value='sort-total'
        />
      </RadioGroup>
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </WrapperChart>
  );
};
// TODO remove publi studyType from id
Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.others.retractions.chart-by-field',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
