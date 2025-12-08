import { Col } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';

function Citations() {
  return (
    <>
      <section className='content py-4'>
        <h3>
          <FormattedMessage id='app.citation.all' />
        </h3>
      </section>
      <section className='content py-4'>
        <Col n='12 lg-10'>
          <strong>
            <FormattedMessage id='app.citation1' />
          </strong>
          <p>
            Eric Jeangirard. Monitoring Open Access at a national level: French
            case study. ELPUB 2019 23rd edition of the International Conference
            on Electronic Publishing, Jun 2019, Marseille, France. doi:
            {' '}
            <a
              href='https://doi.org/10.4000/proceedings.elpub.2019.20'
              target='_blank'
              rel='noreferrer'
            >
              10.4000/proceedings.elpub.2019.20
            </a>
          </p>
        </Col>
      </section>
      <section className='content py-4'>
        <Col n='12 lg-10'>
          <strong>
            <FormattedMessage id='app.citation2' />
          </strong>
          <p>
            Anne L'Hôte, Eric Jeangirard. Using Elasticsearch for entity
            recognition in affiliation disambiguation. 2021, arXiv:
            {' '}
            <a
              href='https://arxiv.org/abs/2110.01958'
              target='_blank'
              rel='noreferrer'
            >
              2110.01958
            </a>
            {' '}
            ; hal:
            {' '}
            <a
              href='https://hal.science/hal-03365806'
              target='_blank'
              rel='noreferrer'
            >
              hal-03365806
            </a>
          </p>
        </Col>
      </section>
      <section className='content py-4'>
        <Col n='12 lg-10'>
          <strong>
            <FormattedMessage id='app.citation3' />
          </strong>
          <p>
            Laetitia Bracco, Anne L'Hôte, Eric Jeangirard, Didier Torny.
            Extending the open monitoring of open science: A new framework for
            the French Open Science Monitor (BSO). 2022. hal:
            {' '}
            <a
              href='https://hal.science/hal-03651518'
              target='_blank'
              rel='noreferrer'
            >
              hal-03651518
            </a>
          </p>
        </Col>
      </section>
      <section className='content py-4'>
        <Col n='12 lg-10'>
          <strong>
            <FormattedMessage id='app.citation4' />
          </strong>
          <p>
            Aricia Bassinet, Laetitia Bracco, Anne L'Hôte, Eric Jeangirard,
            Patrice Lopez, et al.. Large-scale Machine-Learning analysis of
            scientific PDF for monitoring the production and the openness of
            research data and software in France. 2023. hal:
            {' '}
            <a
              href='https://hal.science/hal-04121339'
              target='_blank'
              rel='noreferrer'
            >
              hal-04121339
            </a>
          </p>
        </Col>
      </section>
      <section className='content py-4'>
        <Col n='12 lg-10'>
          <strong>
            <FormattedMessage id='app.citation5' />
          </strong>
          <p>
            Laetitia Bracco, Eric Jeangirard, Anne L'Hôte, Laurent Romary. How
            to build an Open Science Monitor based on publications? A French
            perspective ? 2024. hal:
            {' '}
            <a
              href='https://hal.science/hal-04854788'
              target='_blank'
              rel='noreferrer'
            >
              hal-04854788
            </a>
          </p>
        </Col>
      </section>
      <section className='content py-4'>
        <Col n='12 lg-10'>
          <strong>
            <FormattedMessage id='app.citation6' />
          </strong>
          <p>
            Aricia Bassinet, Laetitia Bracco, Eric Jeangirard, Anne L'Hôte,
            Patrice Lopez, et al.. Plan de gestion de données du projet
            "Baromètre Science Ouverte Données et codes". Ministère de
            l'Enseignement Supérieur et de la Recherche; Université de Lorraine;
            Inria. 2022. hal:
            {' '}
            <a
              href='https://hal.science/hal-05391570'
              target='_blank'
              rel='noreferrer'
            >
              hal-05391570
            </a>
          </p>
        </Col>
      </section>
    </>
  );
}

export default Citations;
