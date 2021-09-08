import ChartEvolutionProportion from '../charts/publications/general/dynamique-ouverture/chart-evolution-proportion';

const obj = {
  'publi.general.dynamique-ouverture.chart-evolution-proportion':
    ChartEvolutionProportion,
};

export default function BSOChart({ id, ...props }) {
  const Chart = obj[id];
  return <Chart {...props} />;
}
