import { Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ES_API_URL } from '../../config/config';
import getFetchOptions from '../../utils/chartFetchOptions';
import { domains } from '../../utils/constants';
import {
  formatNumberByLang,
  getPublicationYearFromObservationSnap,
  getValueByPath,
} from '../../utils/helpers';
import useFetch from '../../utils/Hooks/useFetch';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import DataCard from '../DataCard';

export default function DataCardSection({ domain, lang }) {
  const intl = useIntl();
  const [diamondPublicationRate, setDiamonPublicationRate] = useState(null);
  const [documentsByTypesByOA, setDocumentsByTypesByOA] = useState(null);
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
    method: 'post',
    url: ES_API_URL,
  });

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
        buttonHref:
          domain === ''
            ? '/publications/general?id=general.dynamique-ouverture'
            : '/sante/publications/general?id=general.dynamique-ouverture',
        activeDomains: ['health', ''],
      },
      documentsByTypesByOA: {
        fetch: (buckets) => {
          const articles = buckets?.find((item) => item.key === 'journal-article') || [];
          const articlesCount = articles?.doc_count || 0;
          const oaArticlesCount = articles?.by_is_oa.buckets?.find((item) => item.key === 1)
            ?.doc_count || 0;
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
        buttonHref:
          domain === ''
            ? '/publications/general?id=general.genres-ouverture'
            : '/sante/publications/general?id=general.genres-ouverture',
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
        buttonHref: '/publications/editeurs?id=publishers.type-ouverture',
        activeDomains: [],
      },
      hostedDocument: {
        fetch: (buckets) => formatNumberByLang(
          buckets?.find((countObj) => countObj.key === 'HAL')?.doc_count || 0,
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
        buttonHref:
          domain === ''
            ? '/publications/archives?id=repositories.dynamique-hal'
            : '/sante/publications/archives?id=repositories.dynamique-hal',
        activeDomains: [''],
      },
      openHealthPublicationPublisherRepository: {
        fetch: (buckets) => {
          const documentsCount = buckets?.find((item) => item.key === 'publisher;repository')
            ?.doc_count || 0;
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
        buttonHref:
          domain === ''
            ? '/publications/general?id=general.voies-ouverture'
            : '/sante/publications/general?id=general.voies-ouverture',
        activeDomains: ['health'],
      },
      hostedDocumentPMC: {
        fetch: (buckets) => {
          const documentsCount = buckets?.find((countObj) => countObj.key === 'PubMed Central')
            ?.doc_count || 0;
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
        buttonHref:
          domain === ''
            ? '/publications/archives?id=repositories.plus-utilisees'
            : '/sante/publications/archives?id=repositories.plus-utilisees',
        activeDomains: ['health'],
      },
    }),
    [
      diamondPublicationRate,
      documentsByTypesByOA,
      domain,
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
        ) || [];
        const booksCount = books?.doc_count || 0;
        const oaBooksCount = books?.by_is_oa?.buckets?.find((item) => item.key === 1)?.doc_count
          || 0;
        setOaBooksRate(((oaBooksCount / booksCount) * 100).toFixed(0));
        setPublicationsNumber(
          aggregations.by_is_oa.buckets[0].doc_count
            + aggregations.by_is_oa.buckets[1].doc_count,
        );
        setTotalHostedDocuments(
          formatNumberByLang(
            aggregations.by_oa_colors.buckets?.find(
              (item) => item.key === 'green',
            )?.doc_count || 0,
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
          parameters: [lastObservationSnap],
          objectType: ['publications'],
        }),
      });
    }
    return () => {
      if (lastObservationSnap) {
        isMounted.current = false;
      }
    };
  }, [domain, fetchData, isMounted, lastObservationSnap, response]);

  return (
    <Container className='pt-32 mb-20'>
      <Row justifyContent='center'>
        <Col n='12' spacing='p-4w'>
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
