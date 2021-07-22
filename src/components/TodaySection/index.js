import {
  Card,
  CardDescription,
  Container,
  Link as DSLink,
  Row,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { Children, cloneElement, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { ES_API_URL } from '../../config/config';
import { getFetchOptions } from '../../utils/helpers';
import useDataFetch from '../../utils/Hooks/useDataFetch';
import useViewport from '../../utils/Hooks/useViewport';
import Icon from '../Icon';
import WrapperCol from '../WrapperCol';

function TodaySection({ updateDate, children }) {
  const { mobile, tablet, desktop } = useViewport();
  const { ref, inView } = useInView();
  const [todayData, setTodayData] = useState({});
  const {
    fetch: fetchPublicationCount,
    response: responsePublicationCount,
    isMounted: isMountedPublicationCount,
  } = useDataFetch({
    url: ES_API_URL,
    method: 'post',
    options: getFetchOptions('publicationCount'),
  });

  useEffect(() => {
    if (inView && !Object.keys(todayData).length) {
      fetchPublicationCount();
    }
    return () => {
      isMountedPublicationCount.current = false;
    };
  }, [inView, todayData, fetchPublicationCount, isMountedPublicationCount]);

  useEffect(() => {
    if (responsePublicationCount && !todayData.publicationCount) {
      setTodayData((prev) => ({
        ...prev,
        publicationCount:
          responsePublicationCount?.aggregations.publication_count.value.toString(),
      }));
    }
  }, [responsePublicationCount, todayData, setTodayData]);

  return (
    <Container fluid>
      <section className='py-48 px-20 px-md-64 max-996' ref={ref}>
        <Row gutters>
          <WrapperCol columns='12 md-4' container={mobile} gutters={false}>
            <section className='w-100 text-center text-left-l pb-32'>
              <div className='fs-28-32 px-24 pb-16 px-l-0'>
                <FormattedMessage id='app.baro-sante.today-title' />
              </div>
              {updateDate}
            </section>
            <section className='w-100 h-50'>
              <Card bodyClassName='bg-soft-blue' href='/'>
                <CardDescription as='div'>
                  <DSLink as={<Link to='a-propos/methodologie' />}>
                    <h6 className='m-0 fs-20-20'>
                      Sur quoi sont basés nos résultats ?
                    </h6>
                    <p className='fs-14-24'>
                      <FormattedMessage id='app.baro-sante.discover-methodo' />
                    </p>
                    <Icon
                      name='icon-bsso-22'
                      color1='blue-dark-125'
                      color2='blue-soft-75'
                    />
                  </DSLink>
                </CardDescription>
              </Card>
            </section>
          </WrapperCol>
          <WrapperCol active={tablet || desktop} columns='12 md-8'>
            {Children.map(children, (child, index) => cloneElement(child, {
              ...child.props,
              index,
              todayData,
            }))}
          </WrapperCol>
        </Row>
      </section>
    </Container>
  );
}

TodaySection.propTypes = {
  updateDate: PropTypes.element.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
export default TodaySection;
