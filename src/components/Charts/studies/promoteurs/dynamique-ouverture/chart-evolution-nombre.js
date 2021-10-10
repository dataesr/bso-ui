import './chart-evolution-nombre.scss';
import '../../../graph.scss';

import { Col, Container, Row } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import {
  domains,
  graphIds,
  studiesTypes,
} from '../../../../../utils/constants';
import { withDomain, withtStudyType } from '../../../../../utils/helpers';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { allData, isLoading, isError } = useGetData(studyType);
  const { dataGraph2 } = allData;
  const idWithDomainAndStudyType = withtStudyType(
    withDomain(id, domain),
    studyType,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  const graphs = [];

  dataGraph2?.forEach((oneGraph) => {
    const optionsGraph = chartOptions[id].getOptions(
      withDomain(id, domain),
      intl,
      oneGraph,
      studyType,
    );
    graphs.push(optionsGraph);
  });

  return (
    <WrapperChart
      isLoading={isLoading || !allData}
      isError={isError}
      id={id}
      domain={domain}
      studyType={studyType}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={false}
    >
      {/* Add home made legend */}
      <div className='legend'>
        <span>
          <span className='legend-bullet legend-academique' />
          <span className='px-7 legend-label'>
            {intl.formatMessage({ id: 'app.sponsor.academique' })}
          </span>
        </span>
        <span className='px-20'>
          <span className='legend-bullet legend-industriel' />
          <span className='px-7 legend-label'>
            {intl.formatMessage({ id: 'app.sponsor.industriel' })}
          </span>
        </span>
      </div>
      <Container>
        <Row>
          {graphs.map((graphOptions, i) => (
            <Col n='3' key={graphOptions.series[0].name}>
              <HighchartsReact
                highcharts={Highcharts}
                options={graphOptions}
                id={`${idWithDomainAndStudyType}-${i}`}
              />
            </Col>
          ))}
        </Row>
      </Container>
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  domain: 'health',
  studyType: 'Interventional',
  id: 'promoteurs.dynamique-ouverture.chart-evolution-nombre',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
