import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FormattedMessage } from 'react-intl';

import { ES_API_URL, ES_STUDIES_API_URL } from '../../config/config';
import getFetchOptions from '../../utils/chartFetchOptions';
import { domains } from '../../utils/constants';
import { getValueByPath } from '../../utils/helpers';
import useFetch from '../../utils/Hooks/useFetch';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import Icon from '../Icon';
import Loader from '../Loader';
import TodayNumbersInfoCard from '../TodayNumbersInfoCard';

const fetchInfos = {
  publication: {
    path: 'aggregations.publication_count.value',
    url: ES_API_URL,
    objectType: ['publications'],
  },
  publisher: {
    path: 'aggregations.publisher_count.value',
    url: ES_API_URL,
    objectType: ['publications'],
  },
  repository: {
    path: 'aggregations.repositories_count.value',
    url: ES_API_URL,
    objectType: ['publications'],
  },
  obsDates: {
    path: 'aggregations.observation_dates_count.value',
    url: ES_API_URL,
    objectType: ['publications'],
  },
  journal: {
    path: 'aggregations.journal_count.value',
    url: ES_API_URL,
    objectType: ['publications'],
  },
  // these: {
  //   path: 'aggregations.publication_count.value',
  //   url: ES_API_URL,
  //   objectType: ['thesis'],
  // },
  // interventional: {
  //   path: 'aggregations.study_type.buckets.0.doc_count',
  //   url: ES_STUDIES_API_URL,
  //   objectType: ['clinicalTrials'],
  // },
  // observational: {
  //   path: 'aggregations.study_type.buckets.1.doc_count',
  //   url: ES_STUDIES_API_URL,
  //   objectType: ['clinicalTrials'],
  // },
};

function TodayNumbersItem({
  iconName,
  iconColor,
  intlSubTitle,
  itemKey,
  domain,
}) {
  const [todayData, setTodayData] = useState({});
  const { lastObservationSnap } = useGlobals();
  const { fetch, response, isMounted } = useFetch({
    url: fetchInfos[itemKey].url,
    method: 'post',
    options: getFetchOptions({
      key: itemKey,
      domain,
      parameters: [lastObservationSnap],
      objectType: fetchInfos[itemKey].objectType,
    }),
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !Object.keys(todayData).length) {
      fetch();
    }
    return () => {
      isMounted.current = false;
    };
  }, [inView, todayData, fetch, isMounted]);

  useEffect(() => {
    if (response && !todayData[itemKey]) {
      setTodayData((prev) => ({
        ...prev,
        [itemKey]: getValueByPath(fetchInfos[itemKey].path, response),
      }));
    }
  }, [response, todayData, setTodayData, itemKey]);
  return (
    <div ref={ref} className='josm-today-numbers-info-item'>
      <TodayNumbersInfoCard
        subTitle={<FormattedMessage id={intlSubTitle} />}
        data1={
          todayData[itemKey] ? (
            todayData[itemKey]
          ) : (
            <Loader spacing='' size='80' />
          )
        }
        icon={<Icon name={iconName} color2={iconColor} />}
      />
    </div>
  );
}

TodayNumbersItem.defaultProps = {
  todayData: { publicationCount: '' },
  domain: '',
};

TodayNumbersItem.propTypes = {
  todayData: PropTypes.shape({ publicationCount: PropTypes.string }),
  intlSubTitle: PropTypes.string.isRequired,
  domain: PropTypes.oneOf(domains),
  iconColor: PropTypes.string.isRequired,
  itemKey: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
};
export default TodayNumbersItem;
