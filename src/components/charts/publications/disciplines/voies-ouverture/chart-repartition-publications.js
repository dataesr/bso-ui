import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  accesferme,
  archiveouverte100,
  editeurarchive,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { data, isLoading } = useGetData(lastObservationSnap, domain);
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const idWithDomain = withDomain(id, domain);

  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    categories,
    series,
  );

  useEffect(() => {
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
    if (data && data.length > 0 && !categories.length) {
      setCategories(
        data[data.length - 1].by_oa_host_type.buckets[0].by_discipline.buckets
          .sort((a, b) => b.key - a.key)
          .map((item) => item.key),
      );
    }
    if (data && data.length > 0 && !series.length) {
      setSeries(
        data[data.length - 1].by_oa_host_type.buckets
          .filter((el) => el.key !== 'closed')
          .sort((a, b) => a.doc_count - b.doc_count)
          .map((el) => ({
            name: el.key,
            data: el.by_discipline.buckets
              .sort((a, b) => b.key - a.key)
              .map((item) => item.doc_count),
            color: colors.find((item) => item.hostType === el.key).color,
          })),
      );
    }
  }, [categories.length, data, series.length]);

  return (
    <WrapperChart
      id={id}
      isLoading={isLoading || !data}
      idWithDomain={idWithDomain}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'publi.disciplines.voies-ouverture.chart-repartition-publications',
  domain: '',
};

Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
