import { Radio, RadioGroup } from '@dataesr/react-dsfr';
import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import customComments from '../../../../../utils/chartComments';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import {
  capitalize,
  getObservationLabel,
  withDomain,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import SearchableSelect from '../../../../SearchableSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({ domain, hasComments, hasFooter, id }) {
  const [chartComments, setChartComments] = useState('');
  const [isPercent, setPercent] = useState(false);
  const [options, setOptions] = useState([]);
  const [scientificField, setScientificField] = useState('*');
  const chartRef = useRef();
  const intl = useIntl();
  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const { allData, isError, isLoading } = useGetData(
    lastObservationSnap,
    domain,
    isPercent,
    scientificField,
  );
  const { dataGraph, categories } = allData;
  const scientificFieldTitle = scientificField !== '*'
    ? ` (${capitalize(
      intl.formatMessage({
        id: `app.discipline.${scientificField
          .replace(/\n/g, '')
          .replace('  ', ' ')}`,
        defaultMessage: scientificField,
      }),
    )})`
    : '';
  const dataTitle = {
    publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
    scientificFieldTitle,
  };
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    categories,
    dataGraph,
    dataTitle,
    isPercent,
  );

  useEffect(() => {
    const query = getFetchOptions({
      key: 'scientificFieldList',
      domain,
      parameters: [lastObservationSnap],
    });

    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      const opts = response.data.aggregations.by_discipline.buckets.map(
        (item) => ({
          label: capitalize(
            intl.formatMessage({
              id: `app.discipline.${item.key
                .replace(/\n/g, '')
                .replace('  ', ' ')}`,
              defaultMessage: item.key,
            }),
          ),
          value: item.key,
        }),
      );
      opts.unshift({
        label: capitalize(
          intl.formatMessage({ id: 'app.all-scientific-fields' }),
        ),
        value: '*',
      });
      setOptions(opts);
    });
  }, [domain, intl, lastObservationSnap]);

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomain, intl));
  }, [allData, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph || !categories}
    >
      <RadioGroup
        className='d-inline-block'
        isInline
        legend={intl.formatMessage({ id: 'app.publi.display' })}
        onChange={(value) => setPercent(value === 'percent')}
        value={isPercent ? 'percent' : 'number'}
      >
        <Radio
          label={intl.formatMessage({ id: 'app.publi.nb-publications' })}
          value='number'
        />
        <Radio
          label={intl.formatMessage({
            id: 'app.commons.percent',
          })}
          value='percent'
        />
      </RadioGroup>
      <SearchableSelect
        label={intl.formatMessage({ id: 'app.scientific-field-filter-label' })}
        onChange={(e) => (e.length > 0 ? setScientificField(e) : null)}
        options={options}
        selected={scientificField}
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
}

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.general.langues.chart-publications-by-year',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
