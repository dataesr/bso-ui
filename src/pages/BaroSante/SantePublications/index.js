import React from 'react';
import BarsChart from '../../../components/charts/bars-chart';
import LinesChart from '../../../components/charts/lines-chart';

function Publications() {
  return (
    <div>
      <h1>Publications</h1>
      <div>
        <div>
          Quelle est la dynamique d’ouverture de la santé en France ?
          <span>i</span>
        </div>
        <div>Text intro du graph</div>
        <BarsChart idChart="chartPublicationsGeneral_1" />
        <LinesChart idChart="chartPublicationsGeneral_2" />
      </div>
    </div>
  );
}

export default Publications;
