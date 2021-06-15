import React from 'react';

import ChartEvolutionTaux from './chart-evolution-taux';
import ChartRepartitionPublications from './chart-repartition-publications';
import ChartRepartitionTaux from './chart-repartition-taux';

const Chart = () => (
  <>
    <ChartRepartitionTaux />
    <ChartEvolutionTaux />
    <ChartRepartitionPublications />
  </>
);

export default Chart;
