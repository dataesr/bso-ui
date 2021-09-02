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
  editeurplateforme100,
  g800,
} from '../../../../../style/colours.module.scss';
import { domains, graphIds } from '../../../../../utils/constants';
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

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState('*');
  const { lastObservationSnap, observationSnaps, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    publisher,
    domain,
  );
  const { dataGraph1 } = data;
  const query = getFetchOptions(
    'publishersList',
    'health',
    lastObservationSnap,
  );
  const term = {};
  term[`oa_details.${lastObservationSnap}.oa_host_type`] = 'publisher';
  query.query.bool.filter.push({ term });
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setPublishers(
        response.data.aggregations.by_publisher.buckets.map((item) => item.key),
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

  const optionsGraph1 = getGraphOptions(id, intl);
  optionsGraph1.chart.type = 'bar';
  optionsGraph1.colors = [editeurplateforme100];
  optionsGraph1.yAxis = { visible: false, min: 0, max: 100 };
  optionsGraph1.plotOptions = {
    bar: {
      dataLabels: {
        enabled: true,
        format: '{point.y:.0f} %',
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
    { id: `${id}.comments` },
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
        <GraphTitle title={intl.formatMessage({ id: `${id}.title` })} />
        <SimpleSelect
          label={intl.formatMessage({ id: 'app.publishers-filter-label' })}
          onChange={(e) => setPublisher(e.target.value)}
          options={publishers}
          selected={publisher}
          firstValue='*'
          firstLabel={intl.formatMessage({ id: 'app.all-publishers' })}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph1}
          ref={chartRef}
          iid={id}
        />
        {graphComments && <GraphComments comments={chartComments} />}
      </div>
      {graphFooter && (
        <GraphFooter
          date={updateDate}
          source={intl.formatMessage({ id: `${id}.source` })}
          graphId={id}
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
  id: 'app.national-publi.publishers.dynamique-ouverture.chart-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};
export default Chart;
