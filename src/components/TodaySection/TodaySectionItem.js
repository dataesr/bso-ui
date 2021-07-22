import { Col } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FormattedMessage } from 'react-intl';

import { ES_API_URL } from '../../config/config';
import { getFetchOptions } from '../../utils/helpers';
import useDataFetch from '../../utils/Hooks/useDataFetch';
import Icon from '../Icon';
import InfoCard from '../InfoCard';
import Loader from '../Loader';

const pathByKey = {
  publication: 'publication_count.value',
  publisher: 'publisher_count.value',
  repository: 'repositories_count.value',
  obsDates: 'observation_dates_count.value',
  journal: 'journal_count.value',
  clinical: 'study_type.buckets[0]',
  observableStudies: 'publication_count',
};

function TodaySectionItem({
  iconName,
  iconColor,
  intlSubTitle,
  backgroundColorClass,
  itemKey,
}) {
  const [todayData, setTodayData] = useState({});
  const { fetch, response, isMounted } = useDataFetch({
    key: itemKey,
    url: ES_API_URL,
    method: 'post',
    options: getFetchOptions(itemKey),
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

  const getValueByPath = (path, object) => path.split('.').reduce((p, prop) => p[prop], object);

  useEffect(() => {
    if (response && !todayData[itemKey]) {
      setTodayData((prev) => ({
        ...prev,
        [itemKey]: getValueByPath(pathByKey[itemKey], response?.aggregations),
      }));
    }
  }, [response, todayData, setTodayData, itemKey]);
  return (
    <Col n='6 sm-4 md-6'>
      <span ref={ref}>
        <InfoCard
          cardClassNames='text-left-l'
          small
          bodyClassName={backgroundColorClass}
          subTitle={<FormattedMessage id={intlSubTitle} />}
          data1={todayData[itemKey] || <Loader spacing='' size='80' />}
          icon={
            <Icon name={iconName} color1='blue-dark-125' color2={iconColor} />
          }
        />
      </span>
    </Col>
  );
}

TodaySectionItem.defaultProps = {
  todayData: { publicationCount: '' },
};

TodaySectionItem.propTypes = {
  backgroundColorClass: PropTypes.string.isRequired,
  todayData: PropTypes.shape({ publicationCount: PropTypes.string }),
  intlSubTitle: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  itemKey: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
};
export default TodaySectionItem;
