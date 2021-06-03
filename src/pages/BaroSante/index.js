import React from 'react';

import Banner from '../../components/Banner';

function BaroSante() {
  return (
    <div className='BaroSante'>
      <Banner
        backgroundColor='--blue-soft-100'
        supTitle='Baromètre français de la science ouverte'
        title='Santé'
        subTitle='Publications, essais cliniques, études observationnelles :
Découvrez l’évolution de l’accès ouvert de la recherche en santé
en France à partir de données fiables, ouvertes et maîtrisées.'
        chip={{
          title:
            'Site mis à jour le 2 février 2021 avec les données 2013 à 2020',
          backgroundColor: '--blue-soft-125',
        }}
      />
    </div>
  );
}

export default BaroSante;
