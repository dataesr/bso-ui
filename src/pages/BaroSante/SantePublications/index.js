import React from 'react';
import QuestionSection from '../../../components/question-section';
import ChartsDynamiqueOuverture from '../../../components/charts/publications/general/charts-dynamique-ouverture';

const Publications = () => {
  return (
    <>
      <h1>Publications</h1>
      Chiffres clés
      <br />
      Tabs
      <QuestionSection
        title="Quelle est la dynamique d’ouverture de la santé en France ?"
        info="info text"
        description="description text"
        backgroundColor="#D5DBEF"
      >
        <ChartsDynamiqueOuverture />
      </QuestionSection>
    </>
  );
};

export default Publications;
