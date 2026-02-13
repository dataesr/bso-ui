/* eslint-disable react/require-default-props */
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
import { domains, graphIds } from '../../../../../utils/constants';
import { capitalize, cleanNumber, getObservationLabel, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({
  domain = '',
  hasComments = true,
  hasFooter = true,
  id = 'publi.publishers.type-ouverture.chart-by-classifications-publishers',
}) {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [sort, setSort] = useState('Diamant');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const { allData, isError, isLoading } = useGetData(
    lastObservationSnap,
    domain,
  );
  const { dataGraphByClassificationsByPublishers } = allData;
  const dataTitle = {
    publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
  };
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    let categories = dataGraphByClassificationsByPublishers?.[0]?.data?.toSorted((a, b) => b.y_tot - a.y_tot) ?? [];
    if (sort !== 'sort-staff') {
      categories = dataGraphByClassificationsByPublishers?.find((item) => item.name === sort)?.data?.toSorted((a, b) => b.y - a.y) ?? [];
    }
    const categoriesLabels = categories.map((bucket) => capitalize(
      intl.formatMessage({
        defaultMessage: bucket.classification,
        id: `app.discipline.${bucket.classification
          .replace(/\n/g, '')
          .replace('  ', ' ')}`,
      }),
    )
      .concat('<br>(')
      .concat(intl.formatMessage({ id: 'app.effectif' }))
      .concat(' = ')
      .concat(cleanNumber(bucket.y_tot))
      .concat(')'));
    dataGraphByClassificationsByPublishers?.map((item) => {
      // eslint-disable-next-line no-param-reassign
      item.data = categories.map((category) => item.data.find((it) => it.classification === category.classification));
      return item;
    });
    setOptionsGraph(chartOptions[id].getOptions(
      idWithDomain,
      intl,
      categoriesLabels,
      dataGraphByClassificationsByPublishers,
    ));
  }, [dataGraphByClassificationsByPublishers, id, idWithDomain, intl, sort]);

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
      isLoading={isLoading || !allData}
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
              dataTitle,
              'y_tot',
            ),
          );
          setSort(newValue);
        }}
        value={sort}
      >
        <Radio
          label={capitalize(intl.formatMessage({ id: 'app.publishers.diamond' }))}
          value={capitalize(intl.formatMessage({ id: 'app.publishers.diamond' }))}
        />
        <Radio
          label={capitalize(intl.formatMessage({ id: 'app.publishers.gold-hybrid' }))}
          value={capitalize(intl.formatMessage({ id: 'app.publishers.gold-hybrid' }))}
        />
        <Radio
          label={capitalize(intl.formatMessage({ id: 'app.publishers.other' }))}
          value={capitalize(intl.formatMessage({ id: 'app.publishers.other' }))}
        />
        <Radio
          label={capitalize(intl.formatMessage({ id: 'app.effectif' }))}
          value='sort-staff'
        />
      </RadioGroup>
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
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
};

export default Chart;
