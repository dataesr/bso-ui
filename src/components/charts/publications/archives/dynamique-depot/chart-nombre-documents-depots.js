/* eslint-disable react/no-this-in-sfc */
import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { archiveouverte100 } from '../../../../../style/colours.module.scss';
import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphComments }) => {
  const intl = useIntl();
  const graphId = 'app.sante-publi.repositories.dynamique-depot.chart-nombre-documents-depots';

  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps[0]);

  if (isLoading || !data) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const graphs = [];

  data.forEach((oneGraph) => {
    const optionsGraph = getGraphOptions(graphId, intl);
    optionsGraph.chart.type = 'column';
    optionsGraph.colors = [archiveouverte100];
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
        name: oneGraph.name,
      },
    ];

    graphs.push(optionsGraph);
  });

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
