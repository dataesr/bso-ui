import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';

function Project() {
  return (
    <div>
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-8'>
              <h2>Le projet du Baromètre de la Science Ouverte (BSO)</h2>
              <h3>Première version (BSO1)</h3>
              <p>
                La mise en place du baromètre français de la science ouverte
                s'inscrit dans le cadre du
                {' '}
                <a
                  href='https://www.enseignementsup-recherche.gouv.fr/fr/le-plan-national-pour-la-science-ouverte-2021-2024-vers-une-generalisation-de-la-science-ouverte-en-48525'
                  rel='noreferrer'
                  target='_blank'
                >
                  Plan National pour la Science Ouverte (PNSO)
                </a>
                {' '}
                et du Plan d’Action National de la France au sein du
                {' '}
                <a
                  href='https://www.modernisation.gouv.fr/outils-et-formations/le-plan-daction-national-2021-2023-pour-un-gouvernement-ouvert'
                  rel='noreferrer'
                  target='_blank'
                >
                  Partenariat pour un Gouvernement Ouvert (PGO)
                </a>
                . Ce baromètre concerne dans un premier temps l'accès ouvert aux
                publications. Cette première version a été réalisée en 2018 et
                2019.
              </p>
              <h3>Seconde version (BSO2)</h3>
              <p>
                En plus de mettre à jour les données, cette nouvelle version
                apporte une vision bien plus détaillée des publications
                scientifiques françaises. Elle propose également un focus sur le
                domaine de la santé en étudiant spécifiquement les publications
                de cette discipline, mais également les essais cliniques et les
                études observationnelles français. Cette deuxième version a été
                réalisée en 2021 et ouverte le 28 janvier 2022.
              </p>
              <h3>Et la suite (BSO3)</h3>
              <p>
                Bien sûr, hors de question d’en rester là ! Une équipe associant
                {' '}
                <a
                  href='https://www.univ-lorraine.fr/'
                  rel='noreferrer'
                  target='_blank'
                >
                  Université de Lorraine
                </a>
                ,
                {' '}
                <a
                  href='https://www.inria.fr/fr'
                  rel='noreferrer'
                  target='_blank'
                >
                  Inria
                </a>
                {' '}
                et
                {' '}
                <a
                  href='https://www.enseignementsup-recherche.gouv.fr/fr'
                  rel='noreferrer'
                  target='_blank'
                >
                  MESRI
                </a>
                {' '}
                prépare déjà le BSO3. Elle s’attaquera à deux nouveaux objets de
                recherche : les codes sources et les jeux de données, toujours
                sous l’angle de la science ouverte. Cette future version,
                financée par le Plan de Relance, est prévue pour 2023.
                <br />
                <a
                  href='https://www.ouvrirlascience.fr/vers-un-barometre-francais-de-la-science-ouverte-consacre-aux-donnees-de-la-recherche-et-codes-logiciels/'
                  rel='noreferrer'
                  target='_blank'
                >
                  Pour en savoir plus
                </a>
              </p>
              <h2>L’équipe</h2>
              <p>
                Cet outil a été développé par le
                {' '}
                <a
                  href='https://www.enseignementsup-recherche.gouv.fr/fr'
                  rel='noreferrer'
                  target='_blank'
                >
                  Ministère de l’Enseignement Supérieur, de la Recherche et de
                  l'Innovation
                </a>
                . Les données ont patiemment été collectées, nettoyées,
                consolidées et ordonnées par Eric Jeangirard et Anne L’Hôte.
                Frédéric Olland a imaginé une infrastructure supportant la
                collecte et l’interrogation de ces centaines de milliers de
                publications scientifiques françaises. A l’écoute d’un panel
                d’experts,
                {' '}
                <a href='https://wedodata.fr/' rel='noreferrer' target='_blank'>
                  WeDoData
                </a>
                {' '}
                a imaginé la nouvelle interface. Pauline Gaudet-Chardonnet et
                Jérémy Peglion en ont assuré l’intégration. Tous ces résultats
                ont été questionnés et validés par les regards experts de Claire
                Leymonerie, Florian Naudet, Didier Torny et Marin Dacos. Nous
                avons aussi pu bénéficier d’échanges avec Nicholas DeVito. Les
                déclinaisons locales ont été réfléchies avec l’aide de Laetitia
                Bracco de l’Université de Lorraine. Enfin, en vrai chef
                d’orchestre, Emmanuel Weisenburger a fait en sorte que chacun
                puisse travailler sereinement et a apporté sa connaissance du
                paysage français de la recherche et de l’innovation.
              </p>
              <p>
                Pour toute remarque, n'hésitez pas à nous contacter à
                {' '}
                <a href='mailto:bso@recherche.gouv.fr'>bso@recherche.gouv.fr</a>
                .
              </p>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Project;
