import { Col, Container, Row } from '@dataesr/react-dsfr';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import BSOChart from '../../../components/Charts';

const OPENDATASOFT_LIMIT = 100;

function Policy() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getDataFromPage = async ({
      limit = OPENDATASOFT_LIMIT,
      offset = 0,
    } = {}) => {
      let url =
        'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets';
      url += `/fr-esr-politiques-so-etablissements/records?limit=${limit}&offset=${offset}&order_by=uo_lib`;
      const response = await axios.get(url, {
        headers: { accept: 'application/json; charset=utf-8' },
      });
      return response?.data;
    };
    const getData = async () => {
      let allData = [];
      let count = 0;
      let offset = 0;
      do {
        // eslint-disable-next-line no-await-in-loop
        const results = await getDataFromPage({ offset });
        count = results.total_count;
        offset += OPENDATASOFT_LIMIT;
        allData = [...allData, ...results?.results];
      } while (allData.length < count);
      setData(allData);
    };
    getData();
  }, []);

  return (
    <div className='policy no-arrow-link'>
      <Container>
        <section className='color-blue-dark-125 content py-48'>
          <Row gutters>
            <Col n='12'>
              <h2>
                <FormattedMessage id='app.header.nav.declinaisons.policy' />
              </h2>
            </Col>
          </Row>
          <Row>
            <Col n='12'>
              <FormattedMessage
                id='other.policy.open-science-policy-contact'
                values={{
                  cta0: (chunks) => (
                    <a
                      className='external_link'
                      href='https://hal-lara.archives-ouvertes.fr/hal-04842977'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta1: (chunks) => (
                    <a
                      className='external_link'
                      href='https://www.ouvrirlascience.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta2: (chunks) => (
                    <a
                      className='external_link'
                      href='mailto:coso@recherche.gouv.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  linebreak: (chunks) => (
                    <>
                      {chunks}
                      <br />
                    </>
                  ),
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col n='12' className='fr-mt-5w'>
              <BSOChart id='other.policy.open-science-policy-staff' />
            </Col>
          </Row>
          <Row>
            <Col n='12' className='fr-mt-5w'>
              <BSOChart id='other.policy.open-science-policy' />
            </Col>
          </Row>
          <Row>
            <Col n='12' className='fr-mt-5w'>
              <span>
                <h3 className='fs-16-24 marianne-bold'>
                  <FormattedMessage
                    id='other.policy.open-science-table.title'
                    defaultMessage='Etablissements ayant adopté une politique de science ouverte'
                  />
                </h3>
              </span>
              <table>
                <thead>
                  <tr>
                    <th scope='col'>
                      <FormattedMessage
                        id='other.policy.institutions'
                        defaultMessage='Etablissement'
                      />
                    </th>
                    <th scope='col'>
                      <FormattedMessage
                        id='other.policy.publication_year'
                        defaultMessage='Années de publication du document-cadre'
                      />
                    </th>
                    <th scope='col'>
                      <FormattedMessage
                        id='other.policy.link'
                        defaultMessage='Lien vers le document-cadre le plus récent'
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter(
                      (item) => item?.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre,
                    )
                    .map((item) => (
                      <tr key={item.identifiant_ror}>
                        <td>{item.uo_lib}</td>
                        <td>
                          {
                            item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
                          }
                        </td>
                        <td>
                          {item?.lien_vers_le_document_cadre_le_plus_recent ? (
                            <a
                              href={
                                item.lien_vers_le_document_cadre_le_plus_recent
                              }
                              rel='noreferrer'
                              target='_blank'
                            >
                              <FormattedMessage
                                id='other.policy.link2'
                                defaultMessage='lien'
                              />
                            </a>
                          ) : (
                            ''
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col n='12' className='fr-mt-5w'>
              <FormattedMessage
                id='other.policy.open-science-policy-contact'
                values={{
                  cta0: (chunks) => (
                    <a
                      className='external_link'
                      href='https://hal-lara.archives-ouvertes.fr/hal-04842977'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta1: (chunks) => (
                    <a
                      className='external_link'
                      href='https://www.ouvrirlascience.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  cta2: (chunks) => (
                    <a
                      className='external_link'
                      href='mailto:coso@recherche.gouv.fr'
                      rel='noreferrer'
                      target='_blank'
                    >
                      {chunks}
                    </a>
                  ),
                  linebreak: (chunks) => (
                    <>
                      {chunks}
                      <br />
                    </>
                  ),
                }}
              />
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Policy;
