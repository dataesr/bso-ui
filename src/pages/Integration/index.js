/* eslint-disable import/no-dynamic-require */
import { Container } from '@dataesr/react-dsfr';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import React from 'react';

const Integration = ({ match }) => {
  let GraphComponent = '';
  switch (match.params.graphId) {
  case 'app.sante-publi.general.dynamique-ouverture.chart-taux-ouverture':
    GraphComponent = loadable(() => import('../../components/charts/publications/general/dynamique-ouverture/chart-taux-ouverture'));
    break;
  case 'app.sante-publi.general.dynamique-ouverture.chart-evolution-proportion':
    GraphComponent = loadable(() => import('../../components/charts/publications/general/dynamique-ouverture/chart-evolution-proportion'));
    break;
  case 'app.sante-publi.general.voies-ouverture.chart-evolution-taux':
    GraphComponent = loadable(() => import('../../components/charts/publications/general/voies-ouverture/chart-evolution-taux'));
    break;
  case 'app.sante-publi.general.voies-ouverture.chart-repartition-taux':
    GraphComponent = loadable(() => import('../../components/charts/publications/general/voies-ouverture/chart-repartition-taux'));
    break;
  case 'app.sante-publi.general.voies-ouverture.chart-repartition-publications':
    GraphComponent = loadable(() => import('../../components/charts/publications/general/voies-ouverture/chart-repartition-publications'));
    break;
  default:
    break;
  }
  return (
    <Container>
      <GraphComponent />
    </Container>
  );
};

export default Integration;

Integration.propTypes = {
  match: PropTypes.string.isRequired,
};
