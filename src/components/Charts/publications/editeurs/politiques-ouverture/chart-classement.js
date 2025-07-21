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
import { getObservationLabel, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({ domain, hasComments, hasFooter, id }) {
  const chartRef = useRef();
  const [displayType, setDisplayType] = useState('display-open-access');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const { allData, isError, isLoading } = useGetData(
    beforeLastObservationSnap,
    lastObservationSnap,
    domain,
  );
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    allData.dataTitle = {
      publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
    };
    const { categories, dataGraph, dataTitle } = allData;
    /* eslint-disable no-param-reassign */
    if (allData && allData.dataGraph && displayType === 'display-open-access') {
      allData.dataGraph.forEach((dataItem) => {
        if (dataItem.name_code === 'closed') {
          dataItem.visible = false;
        }
        dataItem.data.forEach((dataPoint) => {
          dataPoint.y = dataPoint.y_rel;
          dataPoint.y_suffix = ' %';
        });
      });
    } else if (
      allData
      && allData.dataGraph
      && displayType === 'display-staff'
    ) {
      allData.dataGraph.forEach((dataItem) => {
        dataItem.visible = true;
        dataItem.data.forEach((dataPoint) => {
          dataPoint.y = dataPoint.y_abs;
          dataPoint.y_suffix = '';
        });
      });
    }
    /* eslint-enable no-param-reassign */
    setOptionsGraph(
      chartOptions[id].getOptions(
        idWithDomain,
        intl,
        categories,
        dataGraph,
        dataTitle,
        displayType,
      ),
    );
  }, [allData, beforeLastObservationSnap, id, idWithDomain, intl, displayType]);

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomain, intl));
  }, [allData, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={allData.dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !allData.dataGraph || !allData.categories}
    >
      <RadioGroup
        className='d-inline-block'
        isInline
        legend={intl.formatMessage({ id: 'app.publi.display' })}
        onChange={(newValue) => setDisplayType(newValue)}
        value={displayType}
      >
        <Radio
          label={intl.formatMessage({ id: 'app.publi.display-open-access' })}
          value='display-open-access'
        />
        <Radio
          label={intl.formatMessage({
            id: 'app.publi.display-staff-open-access',
          })}
          value='display-staff'
        />
      </RadioGroup>
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </ChartWrapper>
  );
}

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.publishers.politiques-ouverture.chart-classement',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
