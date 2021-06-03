import { Link as DSLink } from '@dataesr/react-dsfr';
import React from 'react';
import { Link } from 'react-router-dom';

import Banner from './../../components/Banner';

function Accueil() {
  return (
    <div className='accueil'>
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
      <ul>
        <li>
          <DSLink as={<Link to='/baro-national' />} href='/my-page' isSimple>
            Baromètre National
          </DSLink>
        </li>
        <li>
          <Link to='/baro-sante'>Baromètre Santé</Link>
          <ul>
            <li>
              <Link to='/baro-sante/essais-cliniques'>Essai Cliniques</Link>
            </li>
            <li>
              <Link to='/baro-sante/publications'>
                Baromètre Santé Publications
              </Link>
            </li>
            <li>
              <Link to='/baro-sante/etudes'>Etudes Observationnelles</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to='/theme'>Thèmes</Link>
        </li>
      </ul>
    </div>
  );
}

export default Accueil;
