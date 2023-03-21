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
              <h3>Troisième version (BSO3)</h3>
              <p>
                En mars 2023, une nouvelle édition du Baromètre est publiée ! La
                mise à jour des données des publications s'associe à de nouveaux
                indicateurs sur les mentions d'utilisation, de production ou de
                création, et de réutilisation des jeux de donnée et des codes ou
                logiciels. Ces indicateurs sont pour le moment en bêta et ont
                été conçus grâce au travail conjoint de l'
                <a
                  href='https://www.univ-lorraine.fr/'
                  rel='noreferrer'
                  target='_blank'
                >
                  Université de Lorraine
                </a>
                , de l'
                <a
                  href='https://www.inria.fr/fr'
                  rel='noreferrer'
                  target='_blank'
                >
                  Inria
                </a>
                {' '}
                et du
                {' '}
                <a
                  href='https://www.enseignementsup-recherche.gouv.fr/fr'
                  rel='noreferrer'
                  target='_blank'
                >
                  MESR
                </a>
                . Cette nouvelle version a été financée par le Plan de Relance.
                <br />
                <a
                  href='https://www.ouvrirlascience.fr/vers-un-barometre-francais-de-la-science-ouverte-consacre-aux-donnees-de-la-recherche-et-codes-logiciels/'
                  rel='noreferrer'
                  target='_blank'
                >
                  Pour en savoir plus
                </a>
              </p>
              <h3>Et la suite (BSO4)</h3>
              <p>
                Bien sûr, nous avons encore plein d'idées pour faire évoluer ce
                Baromètre, tel que le suivi des ORCID en France ou encore
                l'amélioration de nos modèles d'IA...
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
                  Ministère de l'enseignement supérieur et de la recherche
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
                Les parties "Données de la recherche" et "Codes ou logiciels" a
                pu être réalisée grâce aux outils développés par Patrice Lopez
                de
                {' '}
                <a
                  href='https://science-miner.com/'
                  rel='noreferrer'
                  target='_blank'
                >
                  Science Miner
                </a>
                . Laetitia Bracco et Aricia Bassinet de l'
                <a
                  href='https://www.univ-lorraine.fr/'
                  rel='noreferrer'
                  target='_blank'
                >
                  Université de Lorraine
                </a>
                {' '}
                en ont été les chefs de projet. Et enfin Anne L'Hôte et Eric
                Jeangirard ont assuré l'intégration technique des briques
                logicielles de Science Miner.
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
