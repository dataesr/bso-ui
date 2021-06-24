import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import AnchorNavigation from '../../components/AnchorNavigaton';
import Banner from '../../components/Banner';
import Chip from '../../components/Chip';
import Icon from '../../components/Icon';

function BaroSante() {
  const renderChip = (
    <Chip
      label='Site mis à jour le 2 février 2021 avec les données 2013 à 2020'
      backgroundColor='blue-soft-125'
    />
  );
  const renderIcons = (
    <Row alignItems='middle' gutters>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-28'
          color1='blue-soft-125'
          color2='publication-25'
        />
      </Col>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-15'
          color1='blue-soft-125'
          color2='green-soft-50'
        />
      </Col>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-17'
          color1='blue-soft-125'
          color2='orange-medium-50'
        />
      </Col>
    </Row>
  );
  return (
    <div className='baro-sante'>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle='Baromètre français de la science ouverte'
        title='Santé'
        subTitle='Publications, essais cliniques, études observationnelles:
        Découvrez l’évolution de l’accès ouvert de la recherche en santé
en France à partir de données fiables, ouvertes et maîtrisées.'
        chip={renderChip}
        icons={renderIcons}
      />
      <AnchorNavigation
        tabs={[
          {
            mainLabel: 'Général',
            links: [
              {
                label: 'Lien vers quelque chose 1',
                href: '#anchor',
              },
              {
                label: 'Lien vers quelque chose 2',
                href: '#anchor',
              },
            ],
          },
          {
            mainLabel: 'La dynamique d’ouverture en santé',
            links: [
              {
                label: 'Les genres des productions ouvertes 1',
                href: '#anchor',
              },
              {
                label: 'Les genres des productions ouvertes 2',
                href: '#anchor',
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default BaroSante;
