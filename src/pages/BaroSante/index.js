import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../components/Banner';
import Chip from '../../components/Chip';
import Icon from '../../components/Icon';
import TabNavigation from '../../components/TabNavigation';

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
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        molestias neque ratione repudiandae tempore! Dolorem dolorum excepturi
        fugiat illo, iusto labore laboriosam nobis quo sequi veritatis. Commodi
        ex quo tempore.
      </p>
      <TabNavigation />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        commodi consequuntur deleniti dicta earum, excepturi fugiat incidunt nam
        necessitatibus officia quae quo sunt veritatis! Explicabo laudantium
        nostrum perspiciatis saepe ut.
      </p>
    </div>
  );
}

export default BaroSante;
