import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import DataCard from '../../../components/DataCard';
import { ES_API_URL } from '../../../config/config';
import {
  cleanBigNumber,
  formatNumberByLang,
  getFetchOptions,
} from '../../../utils/helpers';
import useFetch from '../../../utils/Hooks/useFetch';

export default function DataCardSection({ lang }) {
  const [publicationsNumber, setPublicationsNumber] = useState(null);
  const [openPublicationRate, setOpenPublicationRate] = useState(null);
  const [frenchPublicationsRate, setFrenchPublicationRate] = useState(null);
  const [bestCollabCountry, setBestCollabCountry] = useState('');
  const [diamondPublicationRate, setDiamonPublicationRate] = useState(null);
  const [hostedDocuments, setHostedDocuments] = useState({
    val: null,
    total: null,
  });
  const [apcCostSum, setApcCostSum] = useState(null);
  const { fetch, response, isMounted } = useFetch({
    url: ES_API_URL,
    method: 'post',
    options: getFetchOptions('publiSanteData'),
  });
  const updateData = useCallback(
    (aggregations) => {
      if (!publicationsNumber || !aggregations) return;
      if (!openPublicationRate) {
        const x = Math.round(
          (aggregations.by_is_oa.buckets.find(
            (countObj) => countObj.key === 1,
          ).doc_count
              / publicationsNumber)
              * 100
              * 10,
        ) / 10;
        setOpenPublicationRate(x);
      }
      if (!apcCostSum) {
        const x = Math.round(aggregations.sum_apc.value);
        setApcCostSum(`${cleanBigNumber(x)} €`);
      }
      if (!diamondPublicationRate) {
        const x = (
          (aggregations.by_oa_colors.buckets.find(
            (countObj) => countObj.key === 'diamond',
          ).doc_count
            / publicationsNumber)
          * 100
        ).toFixed(1);
        setDiamonPublicationRate(x);
      }
      if (!hostedDocuments.val) {
        const total = aggregations.by_repositories.sum_other_doc_count;
        const val = aggregations.by_repositories.buckets.find(
          (countObj) => countObj.key === 'www.ncbi.nlm.nih.gov',
        ).doc_count;
        setHostedDocuments({ val: formatNumberByLang(val, lang), total });
      }
      if (!frenchPublicationsRate) {
        const x = (
          (aggregations.by_lang.buckets.find(
            (countObj) => countObj.key === 'fr',
          ).doc_count
            / publicationsNumber)
          * 100
        ).toFixed(1);
        setFrenchPublicationRate(x);
      }
      if (!bestCollabCountry) {
        const x = aggregations.by_author_useful_rank.buckets[1].key;
        setBestCollabCountry(`app.country.${x}`);
      }
    },
    [
      publicationsNumber,
      openPublicationRate,
      apcCostSum,
      diamondPublicationRate,
      hostedDocuments.val,
      frenchPublicationsRate,
      bestCollabCountry,
      lang,
    ],
  );

  useEffect(() => {
    if (response) {
      if (!publicationsNumber) {
        setPublicationsNumber(response.aggregations.count_publications.value);
      }
      updateData(response.aggregations);
    }
  }, [response, publicationsNumber, updateData]);

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
        <Col n='12 md-4'>
          <DataCard
            percentage={openPublicationRate}
            buttonLabel={<FormattedMessage id='app.see-details' />}
            sentence={
              <FormattedMessage id='app.sante-publi.data.publications' />
            }
            background='pink'
          />
        </Col>
        <Col n='12 md-4'>
          <DataCard
            topData={apcCostSum}
            buttonLabel={<FormattedMessage id='app.see-details' />}
            background='brown'
            sentence={<FormattedMessage id='app.sante-publi.data.costs' />}
          />
        </Col>
        <Col n='12 md-4'>
          <DataCard
            background='aqua'
            percentage={diamondPublicationRate}
            buttonLabel={<FormattedMessage id='app.see-details' />}
            sentence={
              <FormattedMessage id='app.sante-publi.data.publi-diamond' />
            }
          />
        </Col>
      </Row>
      <Row gutters>
        <Col n='12 md-4'>
          <DataCard
            background='green'
            topData={hostedDocuments.val}
            buttonLabel={<FormattedMessage id='app.see-details' />}
            sentence={(
              <FormattedMessage
                values={{
                  total: formatNumberByLang(hostedDocuments.total, lang),
                }}
                id='app.sante.data.hosted.documents'
                defaultMessage=''
              />
            )}
          />
        </Col>
        <Col n='12 md-4'>
          <DataCard
            background='blue'
            percentage={frenchPublicationsRate}
            buttonLabel={<FormattedMessage id='app.see-details' />}
            sentence={
              <FormattedMessage id='app.sante-publi.data.french-lang' />
            }
          />
        </Col>
        <Col n='12 md-4'>
          {bestCollabCountry && (
            <DataCard
              background='yellow'
              topData={<FormattedMessage id={bestCollabCountry} />}
              buttonLabel={<FormattedMessage id='app.see-details' />}
              sentence={
                <FormattedMessage id='app.sante-publi.data.collab-country' />
              }
            />
          )}
        </Col>
      </Row>
    </section>
  );
}
DataCardSection.propTypes = {
  lang: PropTypes.string.isRequired,
};
