import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { domains, graphIds } from '../../../../../utils/constants';
import {
  getFetchOptions,
  getGraphOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data-taux-ouverture';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [agencies, setAgencies] = useState([]);
  const [agency, setAgency] = useState('*');
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading } = useGetData(
    lastObservationSnap,
    agency,
    domain,
  );
  const { dataGraph, categories } = allData;
  const query = getFetchOptions('allAgencies', domain, lastObservationSnap);
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setAgencies(
        response.data.aggregations.by_agency.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const optionsGraph = getGraphOptions(id, intl);

  optionsGraph.chart.type = 'column';
  optionsGraph.xAxis = {
    categories,
  };
  optionsGraph.yAxis = getPercentageYAxis();
  optionsGraph.plotOptions = {
    column: {
      dataLabels: {
        enabled: true,
        // eslint-disable-next-line
        formatter: function () {
          // eslint-disable-next-line
          return this.y.toFixed(0).concat(' %');
        },
      },
    },
  };
  optionsGraph.series = dataGraph;

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      isLoading={isLoading || !dataGraph || !categories}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.agencies-filter-label' })}
        onChange={(e) => setAgency(e.target.value)}
        options={agencies}
        selected={agency}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-agencies' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={id}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  id: 'app.national-publi.general.impact-financement.chart-taux-ouverture',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
