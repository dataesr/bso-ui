import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

// import { getGraphOptions } from '../../../../../utils/helpers';
import {
  accesferme,
  archiveouverte100,
  editeurarchive,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { graphIds } from '../../../../../utils/constants';
import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap, updateDate } = useGlobals();
  const { data, isLoading } = useGetData(lastObservationSnap);

  if (isLoading || !data) {
    return <Loader />;
  }

  const colors = [
    {
      hostType: 'publisher;repository',
      color: editeurarchive,
    },
    {
      hostType: 'publisher',
      color: editeurplateforme100,
    },
    {
      hostType: 'repository',
      color: archiveouverte100,
    },
    {
      hostType: 'closed',
      color: accesferme,
    },
  ];

  const categories = data[
    data.length - 1
  ].by_oa_host_type.buckets[0].by_discipline.buckets
    .sort((a, b) => b.key - a.key)
    .map((item) => item.key);
  const series = data[data.length - 1].by_oa_host_type.buckets
    .filter((el) => el.key !== 'closed')
    .sort((a, b) => a.doc_count - b.doc_count)
    .map((el) => ({
      name: el.key,
      data: el.by_discipline.buckets
        .sort((a, b) => b.key - a.key)
        .map((item) => item.doc_count),
      color: colors.find((item) => item.hostType === el.key).color,
    }));

  const optionsGraph = getGraphOptions(id, intl);

  optionsGraph.chart = {
    type: 'bar',
    height: '600px',
  };

  optionsGraph.xAxis = {
    categories,
  };

  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${id}.legend` }),
    },
  };

  optionsGraph.plotOptions = {
    series: {
      stacking: 'normal',
    },
  };
  optionsGraph.series = series;

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
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph}
          ref={chartRef}
          id={id}
        />
        {graphComments && (
          <GraphComments
            comments={intl.formatMessage({ id: `${id}.comments` })}
          />
        )}
        {graphFooter && (
          <GraphFooter
            date={updateDate}
            source={intl.formatMessage({ id: `${id}.source` })}
            graphId={id}
            onPngButtonClick={exportChartPng}
            onCsvButtonClick={exportChartCsv}
          />
        )}
      </div>
    </>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'app.national-publi.disciplines.voies-ouverture.chart-repartition-publications',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
