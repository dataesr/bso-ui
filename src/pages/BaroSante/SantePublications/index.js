import { Container } from '@dataesr/react-dsfr';
import React from 'react';

import ChartsDynamiqueOuverture from '../../../components/charts/publications/general/dynamique-ouverture';
import ChartsVoiesOuverture from '../../../components/charts/publications/general/voies-ouverture';
import QuestionSection from '../../../components/question-section';

function SantePublications() {
  return (
    <>
      <Container>
        <h1>Publications</h1>
        Chiffres clés
      </Container>
      <QuestionSection
        title="Quelle est la dynamique d’ouverture de la santé en France ?"
        info="info text"
        description="description text"
        backgroundColor="#D5DBEF"
      >
        <ChartsDynamiqueOuverture />
      </QuestionSection>
      <QuestionSection
        title="Quelles sont les voies d'ouverture choisies pour les publications en santé ?"
        info="info text"
        description="description text"
        backgroundColor="#EEF1F8"
      >
        <ChartsVoiesOuverture />
      </QuestionSection>
    </>
  );
}

export default SantePublications;
