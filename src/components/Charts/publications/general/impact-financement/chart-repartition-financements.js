/* eslint-disable react/no-this-in-sfc */
import { Radio, RadioGroup } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data-repartition-financements';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const [chartComments, setChartComments] = useState('');
  const [dataTitle, setDataTitle] = useState({});
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [selectedSubAgency, setSelectedSubAgency] = useState('*');

  const { lastObservationSnap } = useGlobals();
  const { data, isError, isLoading } = useGetData(
    lastObservationSnap,
    selectedSubAgency,
    domain,
  );
  const { categories, dataGraph, subAgencies } = data;
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    setOptionsGraph(
      chartOptions[id].getOptions(idWithDomain, intl, categories, dataGraph),
    );
  }, [categories, dataGraph, id, idWithDomain, intl]);

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  useEffect(() => {
    const selectedSubAgencyTitle = selectedSubAgency !== '*' ? ` (${selectedSubAgency})` : '';
    setDataTitle({ agencyTitle: selectedSubAgencyTitle });
  }, [selectedSubAgency]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph}
    >
      {subAgencies?.length > 0 && (
        <RadioGroup
          className='d-inline-block'
          isInline
          legend={intl.formatMessage({ id: 'app.publi.display' })}
          onChange={(newValue) => setSelectedSubAgency(newValue)}
          value={selectedSubAgency}
        >
          <Radio
            label={intl.formatMessage({
              id: 'app.national-publi.general.impact-financement.chart-repartition-financements.source.all',
            })}
            value='*'
          />
          {subAgencies.slice(0, 2).map((subAgency) => (
            <Radio
              label={intl.formatMessage({
                id: `app.national-publi.general.impact-financement.chart-repartition-financements.source.${subAgency.key}`,
                defaultMessage: `${subAgency.key}`,
              })}
              value={subAgency.key}
            />
          ))}
        </RadioGroup>
      )}
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </WrapperChart>
  );
};
// TODO remove publi studyType from id
Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.general.impact-financement.chart-repartition-financements',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
