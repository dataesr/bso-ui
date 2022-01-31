import { Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL } from '../../config/config';
import getFetchOptions from '../../utils/chartFetchOptions';
import { domains } from '../../utils/constants';
import {
  cleanNumber,
  formatNumberByLang,
  getPublicationYearFromObservationSnap,
  getValueByPath,
} from '../../utils/helpers';
import useFetch from '../../utils/Hooks/useFetch';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import DataCard from '../DataCard';

export default function DataCardSection({ domain, lang }) {
  const intl = useIntl();
  const [apcCostSum, setApcCostSum] = useState(null);
  const [bestCollabCountry, setBestCollabCountry] = useState('');
  const [diamondPublicationRate, setDiamonPublicationRate] = useState(null);
  const [documentsByTypesByOA, setDocumentsByTypesByOA] = useState(null);
  const [frenchPublicationsRate, setFrenchPublicationRate] = useState(null);
  const [hostedDocuments, setHostedDocuments] = useState(null);
  const [hostedDocumentsPMC, setHostedDocumentsPMC] = useState(null);
  const [oaBooksRate, setOaBooksRate] = useState(null);
  const [
    openHealthPublicationPublisherRepository,
    setOpenHealthPublicationPublisherRepository,
  ] = useState(null);
  const [openPublicationRate, setOpenPublicationRate] = useState(null);
  const [publicationsNumber, setPublicationsNumber] = useState(null);
  const [totalHostedDocuments, setTotalHostedDocuments] = useState(null);
  const { lastObservationSnap } = useGlobals();
  const {
    fetch: fetchData,
    response,
    isMounted,
  } = useFetch({
    url: ES_API_URL,
    method: 'post',
  });
  const { search } = useLocation();

  const dataObj = useMemo(
    () => ({
      openPublicationRate: {
        fetch: (buckets) => (
          Math.round(
            (buckets.find((countObj) => countObj.key === 1).doc_count
                / publicationsNumber)
                * 100
                * 10,
          ) / 10
        ).toFixed(0),
        get: openPublicationRate,
        set: (data) => setOpenPublicationRate(data),
        pathToValue: 'by_is_oa.buckets',
        isPercentage: true,
        color: 'pink',
        intlKey:
          domain === ''
            ? 'app.national-publi.data.publications'
            : 'app.health-publi.data.publications',
        intlValues: {
          totalPublications: formatNumberByLang(publicationsNumber, lang),
          publicationYear:
            getPublicationYearFromObservationSnap(lastObservationSnap),
        },
        buttonHref: '?id=general.dynamique-ouverture',
        activeDomains: ['health', ''],
      },
      documentsByTypesByOA: {
        fetch: (buckets) => {
          const articles = buckets?.find(
            (item) => item.key === 'journal-article',
          );
          const articlesCount = articles?.doc_count;
          const oaArticlesCount = articles?.by_is_oa.buckets?.find(
            (item) => item.key === 1,
          )?.doc_count;
          return `${((oaArticlesCount / articlesCount) * 100).toFixed(0)} %`;
        },
        get: documentsByTypesByOA,
        set: (data) => setDocumentsByTypesByOA(data),
        pathToValue: 'by_genre.buckets',
        isPercentage: true,
        color: 'aqua',
        intlKey: 'app.national-publi.data.documents-by-types-by-oa',
        intlValues: {
          oaBooksRate,
        },
        buttonHref: 'general?id=general.genres-ouverture',
        activeDomains: [''],
      },
      diamondPublicationRate: {
        fetch: (buckets) => (
          ((buckets?.find((countObj) => countObj.key === 'diamond')
            ?.doc_count || 0)
              / ((buckets?.find((countObj) => countObj.key === 'hybrid')
                ?.doc_count || 0)
                + (buckets?.find((countObj) => countObj.key === 'diamond')
                  ?.doc_count || 0)
                + (buckets?.find((countObj) => countObj.key === 'other')
                  ?.doc_count || 0)
                + (buckets?.find((countObj) => countObj.key === 'gold')
                  ?.doc_count || 0)))
            * 100
        ).toFixed(0),
        get: diamondPublicationRate,
        set: (data) => setDiamonPublicationRate(data),
        pathToValue:
          'by_journal_article.by_oa_colors_with_priority_to_publisher.buckets',
        isPercentage: true,
        color: 'aqua',
        intlKey:
          domain === ''
            ? 'app.national-publi.data.publi-diamond'
            : 'app.health-publi.data.publi-diamond',
        intlValues: {
          publicationYear:
            getPublicationYearFromObservationSnap(lastObservationSnap),
        },
        buttonHref: 'editeurs?id=publishers.type-ouverture',
        activeDomains: [],
      },
      hostedDocument: {
        fetch: (buckets) => formatNumberByLang(
          buckets.find((countObj) => countObj.key === 'HAL').doc_count,
          lang,
        ),
        get: hostedDocuments,
        set: (data) => setHostedDocuments(data),
        pathToValue: 'by_repositories.buckets',
        isPercentage: false,
        color: 'green',
        intlKey:
          domain === ''
            ? 'app.national-publi.data.hosted-documents'
            : 'app.health-publi.data.hosted-documents',
        intlValues: {
          total: totalHostedDocuments,
          publicationYear:
            getPublicationYearFromObservationSnap(lastObservationSnap),
        },
        buttonHref: 'archives?id=repositories.dynamique-hal',
        activeDomains: [''],
      },
      bestCollabCountry: {
        fetch: (country) => <FormattedMessage id={`app.country.${country}`} />,
        get: bestCollabCountry,
        set: (data) => setBestCollabCountry(data),
        pathToValue: 'by_author_useful_rank.buckets.1.key',
        isPercentage: false,
        color: 'yellow',
        intlKey:
          domain === ''
            ? 'app.national-publi.data.collab-country'
            : 'app.health-publi.data.collab-country',
        buttonHref: 'affiliations?id=affiliations.pays',
        activeDomains: [],
      },
      frenchPublicationsRate: {
        fetch: (buckets) => (
          ((buckets?.find((countObj) => countObj.key === 'fr')?.doc_count
              || 0)
              / publicationsNumber)
            * 100
        ).toFixed(0),
        get: frenchPublicationsRate,
        set: (data) => setFrenchPublicationRate(data),
        pathToValue: 'by_lang.buckets',
        isPercentage: true,
        color: 'blue',
        intlKey: 'app.national-publi.data.french-lang',
        intlValues: {
          publicationYear:
            getPublicationYearFromObservationSnap(lastObservationSnap),
        },
        buttonHref: 'general?id=general.langues-ouverture',
        activeDomains: [],
      },
      apcCostSum: {
        fetch: (buckets) => `${cleanNumber(
          Math.round(
            buckets.find((el) => el.key === 'hybrid').apc.value
                + buckets.find((el) => el.key === 'gold').apc.value,
          ),
          0,
        )}€`,
        get: apcCostSum,
        set: (data) => setApcCostSum(data),
        pathToValue: 'by_oa_colors.buckets',
        isPercentage: false,
        color: 'brown',
        intlKey: 'app.national-publi.data.costs',
        buttonHref: 'editeurs?id=publishers.couts-publication',
        activeDomains: [],
      },
      openHealthPublicationPublisherRepository: {
        fetch: (buckets) => {
          const documentsCount = buckets.find(
            (item) => item.key === 'publisher;repository',
          ).doc_count;
          return `${((documentsCount / publicationsNumber) * 100)?.toFixed(
            0,
          )} %`;
        },
        get: openHealthPublicationPublisherRepository,
        set: (data) => setOpenHealthPublicationPublisherRepository(data),
        pathToValue: 'by_oa_host_type.buckets',
        isPercentage: true,
        color: 'aqua',
        intlKey: 'app.health-publi.data.publisher-repository',
        buttonHref: 'general?id=general.voies-ouverture',
        activeDomains: ['health'],
      },
      hostedDocumentPMC: {
        fetch: (buckets) => {
          const documentsCount = buckets.find(
            (countObj) => countObj.key === 'PubMed Central',
          ).doc_count;
          return `${((documentsCount / publicationsNumber) * 100)?.toFixed(
            0,
          )} %`;
        },
        get: hostedDocumentsPMC,
        set: (data) => setHostedDocumentsPMC(data),
        pathToValue: 'by_repositories.buckets',
        isPercentage: true,
        color: 'green',
        intlKey:
          domain === ''
            ? 'app.national-publi.data.hosted-documents-pmc'
            : 'app.health-publi.data.hosted-documents-pmc',
        intlValues: {
          total: totalHostedDocuments,
          publicationYear:
            getPublicationYearFromObservationSnap(lastObservationSnap),
        },
        buttonHref: 'archives?id=repositories.plus-utilisees',
        activeDomains: ['health'],
      },
    }),
    [
      apcCostSum,
      bestCollabCountry,
      diamondPublicationRate,
      documentsByTypesByOA,
      domain,
      frenchPublicationsRate,
      hostedDocuments,
      hostedDocumentsPMC,
      lang,
      lastObservationSnap,
      oaBooksRate,
      openHealthPublicationPublisherRepository,
      openPublicationRate,
      publicationsNumber,
      totalHostedDocuments,
    ],
  );

  const updateData = useCallback(
    (aggregations) => {
      if (!publicationsNumber || !aggregations) return;
      Object.keys(dataObj).forEach((k) => {
        const card = dataObj[k];
        if (!card.get) {
          const value = getValueByPath(card.pathToValue, aggregations);
          if (value) {
            card.set(card.fetch(value));
          }
        }
      });
    },
    [dataObj, publicationsNumber],
  );

  useEffect(() => {
    if (response) {
      const { aggregations } = response;
      if (!publicationsNumber) {
        const books = aggregations?.by_genre?.buckets?.find(
          (item) => item.key === 'book',
        );
        const booksCount = books?.doc_count;
        const oaBooksCount = books?.by_is_oa.buckets?.find(
          (item) => item.key === 1,
        )?.doc_count;
        setOaBooksRate(((oaBooksCount / booksCount) * 100).toFixed(0));
        setPublicationsNumber(
          aggregations.by_is_oa.buckets[0].doc_count
            + aggregations.by_is_oa.buckets[1].doc_count,
        );
        setTotalHostedDocuments(
          formatNumberByLang(
            aggregations.by_oa_colors.buckets.find(
              (item) => item.key === 'green',
            ).doc_count,
            lang,
          ),
        );
      }
      updateData(aggregations);
    }
  }, [response, publicationsNumber, updateData, lang]);

  useEffect(() => {
    if (!response && isMounted.current && lastObservationSnap) {
      fetchData({
        options: getFetchOptions({
          key: 'publiCardData',
          domain,
          search,
          parameters: [lastObservationSnap],
        }),
      });
    }
    return () => {
      if (lastObservationSnap) {
        isMounted.current = false;
      }
    };
  }, [domain, fetchData, isMounted, lastObservationSnap, response, search]);

  return (
    <Container fluid className='bg-ultra-light-blue pt-32 mb-20 px-20'>
      <Row justifyContent='center'>
        <Col n='12 md-11 xl-9' spacing='p-4w'>
          <section className='pb-32'>
            <Row gutters>
              {Object.keys(dataObj).map((cardKey) => {
                const {
                  get: cardValue,
                  isPercentage,
                  color,
                  intlKey,
                  intlValues,
                  buttonHref,
                  activeDomains,
                } = dataObj[cardKey];

                return (
                  activeDomains.indexOf(domain) > -1
                  && cardValue && (
                    <Col n='12 md-6 lg-4' key={cardKey}>
                      <DataCard
                        isPercentage={isPercentage}
                        value={isPercentage ? parseFloat(cardValue) : cardValue}
                        nbGaugePosition={
                          cardValue % 1 !== 0 && cardValue > 9 ? '58' : '70'
                        }
                        buttonLabel={intl.formatMessage({
                          id: 'app.see-details',
                        })}
                        buttonHref={buttonHref}
                        background={color}
                        sentence={
                          <FormattedMessage values={intlValues} id={intlKey} />
                        }
                      />
                    </Col>
                  )
                );
              })}
            </Row>
          </section>
        </Col>
      </Row>
    </Container>
  );
}

DataCardSection.defaultProps = {
  domain: '',
};

DataCardSection.propTypes = {
  domain: PropTypes.oneOf(domains),
  lang: PropTypes.string.isRequired,
};
