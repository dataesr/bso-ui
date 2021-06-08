import React from 'react';

import Banner from '../../components/Banner';

function BaroNational() {
  return (
    <div className='BaroNational'>
      <Banner
        backgroundColor='--blue-dark-125'
        supTitle='Bienvenue sur'
        title='le Baromètre français de la sciences Ouverte'
        subTitle='Il mesure l’évolution de l’accès ouvert de la recherche en France
à partir de données fiables, ouvertes et maîtrisées.'
        link={{ label: 'Voir la dernière note flash', url: '' }}
        chip={{
          title:
            'Site mis à jour le 2 février 2021 avec les données 2013 à 2020',
          backgroundColor: '--blue-soft-125',
        }}
      />
    </div>
  );
}

export default BaroNational;
