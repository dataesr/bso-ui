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
import {
  getCSSValue,
  withDomainAndStudyType,
} from '../../../../../utils/helpers';
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
  const idWithDomainAndStudyType = withDomainAndStudyType(
    id,
    domain,
    studyType,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  const graphs = [];

  dataGraph2?.forEach((oneGraph) => {
    const optionsGraph = chartOptions[id].getOptions(
      id,
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
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={false}
    >
      {/* Add home made legend */}
      <div>
        <span>
          <span
            style={{
              backgroundColor: getCSSValue('--lead-sponsor-public'),
              borderRadius: '6px',
              display: 'inline-block',
              height: '12px',
              width: '12px',
            }}
          />
          <span
            className='px-7'
            style={{ color: '#333333', fontSize: '12px', fontWeight: 'bold' }}
          >
            {intl.formatMessage({ id: 'app.sponsor.academique' })}
          </span>
        </span>
        <span className='px-20'>
          <span
            style={{
              backgroundColor: getCSSValue('--lead-sponsor-privee'),
              borderRadius: '6px',
              display: 'inline-block',
              height: '12px',
              width: '12px',
            }}
          />
          <span
            className='px-7'
            style={{ color: '#333333', fontSize: '12px', fontWeight: 'bold' }}
          >
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
  id: 'studies.promoteurs.dynamique-ouverture.chart-evolution-nombre',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
