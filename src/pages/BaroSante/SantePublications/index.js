import { Container } from '@dataesr/react-dsfr';
import React from 'react';

import ChartEvolutionProportion from '../../../components/charts/publications/general/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuverture from '../../../components/charts/publications/general/dynamique-ouverture/chart-taux-ouverture';
import ChartGenreOuverture from '../../../components/charts/publications/general/genres-ouverture/genres-ouverture';
import ChartEvolutionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-evolution-taux';
import ChartRepartitionPublications from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-publications';
import ChartRepartitionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-taux';
import QuestionSection from '../../../components/question-section';
import { bluesoft25, bluesoft50 } from '../../../style/colours.module.scss';

function SantePublications() {
  return (
    <>
      <Container>
        <h1>Publications</h1>
        Chiffres clés
      </Container>

      <QuestionSection
        intlKey='app.sante-publi.general.dynamique-ouverture'
        backgroundColor={bluesoft50}
      >
        <ChartTauxOuverture />
        <ChartEvolutionProportion />
      </QuestionSection>

      <QuestionSection
        intlKey='app.sante-publi.general.voies-ouverture'
        backgroundColor={bluesoft25}
      >
        <ChartRepartitionTaux />
        <ChartEvolutionTaux />
        <ChartRepartitionPublications />
      </QuestionSection>

      <QuestionSection
        intlKey='app.sante-publi.general.genres-ouverture'
        backgroundColor={bluesoft50}
      >
        <ChartGenreOuverture />
      </QuestionSection>
    </>
  );
}

export default SantePublications;
