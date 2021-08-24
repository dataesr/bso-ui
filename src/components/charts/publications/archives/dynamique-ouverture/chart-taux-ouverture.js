import '../../../graph.scss';

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
  archiveouverte100,
  g800,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions, getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.repositories.dynamique-ouverture.chart-taux-ouverture';
  const [archives, setArchives] = useState([]);
  const [archive, setArchive] = useState('*');
  const { observationDates, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationDates, archive);
  const { dataGraph1 } = data;

  const query = getFetchOptions('publishersList');
  const term = {};
  term[`oa_details.${observationDates[0]}.oa_host_type`] = 'repository';
  query.query.bool.filter.push({ term });
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setArchives(
        response.data.aggregations.by_publisher.buckets
          .map((item) => item.key)
          .sort(),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !dataGraph1) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph1 = getGraphOptions(graphId, intl);
  optionsGraph1.chart.type = 'bar';
  optionsGraph1.colors = [archiveouverte100];
  optionsGraph1.yAxis = { visible: false };
  optionsGraph1.plotOptions = {
    bar: {
      dataLabels: {
        enabled: true,
        format: '{point.y}%',
        style: {
          color: g800,
          fontSize: '20px',
          fontWeight: 'bold',
        },
      },
    },
  };
  optionsGraph1.xAxis = {
    type: 'category',
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: {
        color: 'var(--g800)',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
  };
  optionsGraph1.series = [
    {
      data: dataGraph1,
      showInLegend: false,
    },
  ];

  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

  const chartComments = intl.formatMessage(
    { id: `${graphId}.comments` },
    {
      a: dataGraph1[0] ? dataGraph1[0].y : '',
      b: dataGraph1[0] ? dataGraph1[0].publicationDate : '',
      c: dataGraph1[0] ? dataGraph1[0].publicationDate + 1 : '',
      d: dataGraph1[0] ? dataGraph1[0].name : '',
    },
  );

  return (
    <>
      <div className='graph-container'>
        <GraphTitle title={intl.formatMessage({ id: `${graphId}.title` })} />
        <SimpleSelect
          label={intl.formatMessage({ id: 'app.archives-filter-label' })}
          onChange={(e) => setArchive(e.target.value)}
          options={archives}
          selected={archive}
          firstValue='*'
          firstLabel={intl.formatMessage({ id: 'app.all-archives' })}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph1}
          ref={chartRef}
          iid={graphId}
        />
        {graphComments && <GraphComments comments={chartComments} />}
      </div>
      {graphFooter && (
        <GraphFooter
          date={updateDate}
          source={intl.formatMessage({ id: `${graphId}.source` })}
          graphId={graphId}
          onPngButtonClick={exportChartPng}
          onCsvButtonClick={exportChartCsv}
        />
      )}
    </>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
};
export default Chart;
