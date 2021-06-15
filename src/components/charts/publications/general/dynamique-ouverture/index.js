import React from 'react';

import ChartEvolutionProportion from './chart-evolution-proportion';
import ChartTauxOuverture from './chart-taux-ouverture';

const Chart = () => (
  <>
    <ChartTauxOuverture />
    <ChartEvolutionProportion />
  </>
);

export default Chart;
