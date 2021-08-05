import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import DataCard from '../../../components/DataCard';
import { ES_API_URL } from '../../../config/config';
import {
  cleanBigNumber,
  formatNumberByLang,
  getFetchOptions,
  getValueByPath,
} from '../../../utils/helpers';
import useFetch from '../../../utils/Hooks/useFetch';

export default function DataCardSection({ lang }) {
  const intl = useIntl();
  const [publicationsNumber, setPublicationsNumber] = useState(null);
  const [openPublicationRate, setOpenPublicationRate] = useState(null);
  const [frenchPublicationsRate, setFrenchPublicationRate] = useState(null);
  const [bestCollabCountry, setBestCollabCountry] = useState('');
  const [diamondPublicationRate, setDiamonPublicationRate] = useState(null);
  const [hostedDocuments, setHostedDocuments] = useState(null);
  const [totalHostedDocuments, setTotalHostedDocuments] = useState(null);
  const [apcCostSum, setApcCostSum] = useState(null);
  const { fetch, response, isMounted } = useFetch({
    url: ES_API_URL,
    method: 'post',
    options: getFetchOptions('publiSanteData'),
  });

  const dataObj = useMemo(
    () => ({
      openPublicationRate: {
        fetch: (buckets) => Math.round(
          (buckets.find((countObj) => countObj.key === 1).doc_count
              / publicationsNumber)
              * 100
              * 10,
        ) / 10,
        get: openPublicationRate,
        set: (data) => setOpenPublicationRate(data),
        pathToValue: 'by_is_oa.buckets',
        percentage: true,
        color: 'pink',
        intlKey: 'app.sante-publi.data.publications',
      },
      apcCostSum: {
        fetch: (sum) => `${cleanBigNumber(Math.round(sum))} €`,
        get: apcCostSum,
        set: (data) => setApcCostSum(data),
        pathToValue: 'sum_apc.value',
        percentage: false,
        color: 'brown',
        intlKey: 'app.sante-publi.data.costs',
      },
      diamondPublicationRate: {
        fetch: (buckets) => (
          (buckets.find((countObj) => countObj.key === 'diamond').doc_count
              / publicationsNumber)
            * 100
        ).toFixed(1),
        get: diamondPublicationRate,
        set: (data) => setDiamonPublicationRate(data),
        pathToValue: 'by_oa_colors.buckets',
        percentage: true,
        color: 'aqua',
        intlKey: 'app.sante-publi.data.publi-diamond',
      },
      hostedDocument: {
        fetch: (buckets) => formatNumberByLang(
          buckets.find((countObj) => countObj.key === 'www.ncbi.nlm.nih.gov')
            .doc_count,
          lang,
        ),
        get: hostedDocuments,
        set: (data) => setHostedDocuments(data),
        pathToValue: 'by_repositories.buckets',
        percentage: false,
        color: 'green',
        intlKey: 'app.sante.data.hosted.documents',
        intlValues: { total: totalHostedDocuments },
      },
      frenchPublicationsRate: {
        fetch: (buckets) => (
          (buckets.find((countObj) => countObj.key === 'fr').doc_count
              / publicationsNumber)
            * 100
        ).toFixed(1),
        get: frenchPublicationsRate,
        set: (data) => setFrenchPublicationRate(data),
        pathToValue: 'by_lang.buckets',
        percentage: true,
        color: 'blue',
        intlKey: 'app.sante-publi.data.french-lang',
      },
      bestCollabCountry: {
        fetch: (country) => <FormattedMessage id={`app.country.${country}`} />,
        get: bestCollabCountry,
        set: (data) => setBestCollabCountry(data),
        pathToValue: 'by_author_useful_rank.buckets.1.key',
        percentage: false,
        color: 'yellow',
        intlKey: 'app.sante-publi.data.collab-country',
      },
    }),
    [
      apcCostSum,
      bestCollabCountry,
      diamondPublicationRate,
      frenchPublicationsRate,
      hostedDocuments,
      lang,
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
          card.set(card.fetch(getValueByPath(card.pathToValue, aggregations)));
        }
      });
    },
    [dataObj, publicationsNumber],
  );

  useEffect(() => {
    if (response) {
      const { aggregations } = response;
      if (!publicationsNumber) {
        setPublicationsNumber(aggregations.count_publications.value);
        setTotalHostedDocuments(
          formatNumberByLang(
            aggregations.by_repositories.sum_other_doc_count,
            lang,
          ),
        );
      }
      updateData(aggregations);
    }
  }, [response, publicationsNumber, updateData, lang]);

  useEffect(() => {
    if (!response) {
      fetch();
    }
    return () => {
      isMounted.current = false;
    };
  }, [fetch, isMounted, response]);
  return (
    <section className='pb-32'>
      <Row gutters>
        {Object.keys(dataObj).map((cardKey) => (
          <Col n='12 md-4' key={cardKey}>
            <DataCard
              percentage={
                dataObj[cardKey].percentage
                  ? parseFloat(dataObj[cardKey].get)
                  : null
              }
              topData={
                dataObj[cardKey].percentage ? null : dataObj[cardKey].get
              }
              buttonLabel={intl.formatMessage({ id: 'app.see-details' })}
              background={dataObj[cardKey].color}
              sentence={(
                <FormattedMessage
                  values={dataObj[cardKey].intlValues}
                  id={dataObj[cardKey].intlKey}
                />
              )}
            />
          </Col>
        ))}
      </Row>
    </section>
  );
}
DataCardSection.propTypes = {
  lang: PropTypes.string.isRequired,
};
