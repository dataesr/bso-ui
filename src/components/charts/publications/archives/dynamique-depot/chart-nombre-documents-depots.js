/* eslint-disable react/no-this-in-sfc */
import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { domains, graphIds } from '../../../../../utils/constants';
import { getGraphOptions } from '../../../../../utils/helpers';
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

  if (isLoading || !data) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const graphs = [];

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
    optionsGraph.yAxis = {
      title: {
        enabled: false,
      },
    };
    optionsGraph.series = [
      {
        data: oneGraph.data,
        color: oneGraph.color,
        name: oneGraph.name,
      },
    ];
    graphs.push(optionsGraph);
  });

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
  id: 'app.national-publi.repositories.dynamique-depot.chart-nombre-documents-depots',
  domain: '',
};
Chart.propTypes = {
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
