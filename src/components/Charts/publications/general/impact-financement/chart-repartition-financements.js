/* eslint-disable react/no-this-in-sfc */
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
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data-repartition-financements';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [agency, setAgency] = useState('ANR - global');
  const { lastObservationSnap } = useGlobals();
  const { data, isError, isLoading } = useGetData(
    lastObservationSnap,
    agency,
    domain,
  );
  const { categories, dataGraph2 } = data;
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    const agencyTitle = agency !== 'ANR - global' ? ` (${agency})` : '';
    data.dataTitle = { agencyTitle };
    setOptionsGraph(
      chartOptions[id].getOptions(
        idWithDomain,
        intl,
        categories,
        dataGraph2,
        agency,
      ),
    );
  }, [data, idWithDomain, intl, agency, categories, dataGraph2, id]);
  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={data.dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph2}
    >
      <RadioGroup
        className='d-inline-block'
        isInline
        legend={intl.formatMessage({ id: 'app.publi.display' })}
        onChange={(newValue) => setAgency(newValue)}
        // onChange={(newValue) => console.log('ttt', newValue)}
        value={agency}
      >
        <Radio
          // label={intl.formatMessage({ id: 'app.publi.display-open-access' })}
          label='ANR - global'
          value='ANR - global'
        />
        <Radio label='ANR DOS' value='ANR DOS' />
        <Radio label='ANR PIA' value='ANR PIA' />
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
  id: 'publi.general.impact-financement.chart-repartition-financements',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
