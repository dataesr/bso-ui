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
  getObservationLabel,
  withDomain,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const [dataTitle, setDataTitle] = useState({});
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [sort, setSort] = useState('sort-staff');
  const idWithDomain = withDomain(id, domain);
  const { allData, isError, isLoading } = useGetData(
    beforeLastObservationSnap,
    lastObservationSnap,
    domain,
  );
  const { categories, dataGraph } = allData;

  useEffect(() => {
    setDataTitle({
      publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
    });
  }, [beforeLastObservationSnap, intl]);

  useEffect(() => {
    let sortKey;
    if (sort === 'sort-staff') {
      categories?.sort((a, b) => b.staff - a.staff);
      sortKey = 'y_tot';
    } else {
      categories?.sort((a, b) => b.percent - a.percent);
      sortKey = 'oaRate';
    }
    const categoriesLabel = categories?.map((item) => capitalize(intl.formatMessage({ id: `${item.key}` }))
      .concat('</br>(')
      .concat(intl.formatMessage({ id: 'app.effectif' }))
      .concat(' = ')
      .concat(cleanNumber(item.staff))
      .concat(')')) || [];
    setOptionsGraph(
      chartOptions[id].getOptions(
        idWithDomain,
        intl,
        categoriesLabel,
        dataGraph,
        dataTitle,
        sortKey,
      ),
    );
    setChartComments(customComments(allData, idWithDomain, intl));
  }, [allData, categories, dataGraph, dataTitle, id, idWithDomain, intl, sort]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !allData || !categories}
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
          label={intl.formatMessage({ id: 'app.publi.sort-staff' })}
          value='sort-staff'
        />
        <Radio
          label={intl.formatMessage({ id: 'app.publi.sort-open-access' })}
          value='sort-open-rate'
        />
      </RadioGroup>
      <HighchartsReact
        highcharts={Highcharts}
        id={id}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'thesis.disciplines.voies-ouverture.chart-repartition-thesis',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
