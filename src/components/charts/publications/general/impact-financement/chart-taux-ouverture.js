import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  getFetchOptions,
  getFormattedDate,
  getGraphOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import useLang from '../../../../../utils/Hooks/useLang';
import Loader from '../../../../Loader';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data-taux-ouverture';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lang } = useLang();
  const [agencies, setAgencies] = useState([]);
  const [agency, setAgency] = useState('*');
  const { lastObservationSnap, updateDate } = useGlobals();
  const { allData, isLoading } = useGetData(
    lastObservationSnap,
    agency,
    domain,
  );
  const { dataGraph, categories } = allData;
  const query = getFetchOptions('allAgencies', 'health', lastObservationSnap);
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setAgencies(
        response.data.aggregations.by_agency.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !dataGraph || !categories) {
    return <Loader />;
  }
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

  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

  return (
    <>
      <div className='graph-container'>
        <GraphTitle title={intl.formatMessage({ id: `${id}.title` })} />

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
        <GraphComments
          comments={intl.formatMessage({ id: `${id}.comments` })}
        />
      </div>
      <GraphFooter
        date={getFormattedDate(updateDate, lang)}
        source={intl.formatMessage({ id: `${id}.source` })}
        graphId={id}
        onPngButtonClick={exportChartPng}
        onCsvButtonClick={exportChartCsv}
      />
    </>
  );
};

Chart.defaultProps = {
  domain: '',
  id: 'app.national-publi.general.impact-financement.chart-taux-ouverture',
};
Chart.propTypes = {
  id: PropTypes.oneOf([
    'app.national-publi.general.impact-financement.chart-taux-ouverture',
    'app.sante-publi.general.genres-ouverture.chart-repartition-genres',
  ]),
  domain: PropTypes.oneOf(['health', '']),
};

export default Chart;
