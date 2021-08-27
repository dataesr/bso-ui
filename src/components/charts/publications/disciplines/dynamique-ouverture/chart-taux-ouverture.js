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
import {
  getGraphOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphComments }) => {
  const intl = useIntl();
  const graphId = 'app.sante-publi.disciplines.dynamique-ouverture.chart-taux-ouverture';
  const { lastObservationSnap } = useGlobals();
  const { data, isLoading, isError } = useGetData(lastObservationSnap);

  if (isLoading || !data || data.length <= 0) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  let graphs = [];
  data.forEach((oneGraph) => {
    const optionsGraph = getGraphOptions(graphId, intl);
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
  graphs = graphs.sort((a, b) => b.series[0].data[serieLength].y - a.series[0].data[serieLength].y);

  return (
    <>
      <div className='graph-container'>
        <GraphTitle title={intl.formatMessage({ id: `${graphId}.title` })} />
        <Container>
          <Row>
            {graphs.map((graphOptions, i) => (
              <Col n='3' key={graphOptions.series[0].name}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={graphOptions}
                  id={`${graphId}-${i}`}
                />
              </Col>
            ))}
          </Row>
        </Container>

        {graphComments && (
          <GraphComments
            comments={intl.formatMessage({ id: `${graphId}.comments` })}
          />
        )}
      </div>
    </>
  );
};

Chart.defaultProps = {
  graphComments: true,
};
Chart.propTypes = {
  graphComments: PropTypes.bool,
};

export default Chart;
