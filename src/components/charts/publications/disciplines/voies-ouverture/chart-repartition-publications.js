import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import {
  accesferme,
  archiveouverte100,
  editeurarchive,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { getGraphOptions } from '../../../../../utils/chartOptions';
import { graphIds } from '../../../../../utils/constants';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
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

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
    >
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
