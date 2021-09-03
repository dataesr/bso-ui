/* eslint-disable react/no-this-in-sfc */
import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import {
  discipline100,
  discipline125,
} from '../../../../../style/colours.module.scss';

import { domains, graphIds } from '../../../../../utils/constants';
import {
  getGraphOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphComments, id, domain }) => {
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { data, isLoading, isError } = useGetData(lastObservationSnap, domain);

  if (isLoading || !data || data.length <= 0) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  let graphs = [];
  data.forEach((oneGraph) => {
    const optionsGraph = getGraphOptions(id, intl);
    optionsGraph.chart.type = 'column';

    optionsGraph.xAxis = {
      type: 'category',
      categories: oneGraph.data.map((el) => el.name),
      labels: {
        style: {
          color: 'var(--g800)',
          fontSize: '14px',
        },
      },
    };
    optionsGraph.yAxis = getPercentageYAxis();

    optionsGraph.series = [
      {
        name: intl.formatMessage({ id: `app.discipline.${oneGraph.name}` }),
        color: discipline125,
        data: oneGraph.data.map((el, i) => ({
          name: el.name,
          y: el.y,
          y_abs: el.y_abs,
          y_tot: el.y_tot,
          color: i === oneGraph.data.length - 1 ? discipline100 : discipline125,
        })),
      },
    ];
    graphs.push(optionsGraph);
  });
  const serieLength = graphs[0].series[0].data.length - 1;
  // classement par ordre décroissant (en taux d'oa) des disciplines
  graphs = graphs.sort(
    (a, b) => b.series[0].data[serieLength].y - a.series[0].data[serieLength].y,
  );

  return (
    <WrapperChart id={id} graphComments={graphComments}>
      <Container>
        <Row>
          {graphs.map((graphOptions, i) => (
            <Col n='3' key={graphOptions.series[0].name}>
              <HighchartsReact
                highcharts={Highcharts}
                options={graphOptions}
                id={`${id}-${i}`}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphComments: true,
  id: 'app.national-publi.disciplines.dynamique-ouverture.chart-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
