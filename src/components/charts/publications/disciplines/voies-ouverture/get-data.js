/* eslint-disable no-console */
import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  archiveouverte100,
  editeurarchive,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/chartOptions';

function useGetData(observationSnap, domain) {
  const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions('disciplinesVoies', domain, lastObservationSnap, disciplineField);
      const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
      let data = res.data.aggregations.by_discipline.buckets;

      const categories = []; // Elements d'abscisse
      const repository = []; // archive ouverte
      const publisher = []; // éditeur
      const publisherRepository = []; // les 2
      const oa = []; // oa
      const closed = []; // closed
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data = data
        .filter((el) => el.key !== 'unknown')
        .map((el) => ({ by_oa_host_type: el.by_oa_host_type,
          key: el.key,
          total: el.doc_count,
          closed: el.by_oa_host_type.buckets.find((item) => item.key === 'closed')?.doc_count || 0,
          repository: el.by_oa_host_type.buckets.find((item) => item.key === 'repository')?.doc_count || 0,
          publisher: el.by_oa_host_type.buckets.find((item) => item.key === 'publisher')?.doc_count || 0,
          publisherRepo: el.by_oa_host_type.buckets.find((item) => item.key === 'publisher;repository')?.doc_count || 0,
        }))
        .sort((a, b) => ((a.closed / a.total) - (b.closed / b.total)));
      data
        .forEach((el, catIndex) => {
          categories.push(intl.formatMessage({ id: `app.discipline.${el.key}` }));

          const closedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'closed')
            ?.doc_count || 0;
          const repositoryCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'repository')
            ?.doc_count || 0;
          const publisherCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'publisher')
            ?.doc_count || 0;
          const publisherRepositoryCurrent = el.by_oa_host_type.buckets.find(
            (item) => item.key === 'publisher;repository',
          )?.doc_count || 0;
          const totalCurrent = repositoryCurrent
            + publisherCurrent
            + publisherRepositoryCurrent
            + closedCurrent;
          const oaCurrent = repositoryCurrent + publisherCurrent + publisherRepositoryCurrent;
          closed.push({
            y: (100 * closedCurrent) / totalCurrent,
            y_abs: closedCurrent,
            y_tot: totalCurrent,
            x: catIndex,
          });
          oa.push({
            y: (100 * oaCurrent) / totalCurrent,
            y_abs: oaCurrent,
            y_tot: totalCurrent,
            x: catIndex,
          });
          repository.push({
            y: (100 * repositoryCurrent) / totalCurrent,
            y_abs: repositoryCurrent,
            y_tot: totalCurrent,
            x: catIndex,
          });
          publisher.push({
            y: (100 * publisherCurrent) / totalCurrent,
            y_abs: publisherCurrent,
            y_tot: totalCurrent,
            x: catIndex,
          });
          publisherRepository.push({
            y: (100 * publisherRepositoryCurrent) / totalCurrent,
            y_abs: publisherRepositoryCurrent,
            y_tot: totalCurrent,
            x: catIndex,
          });
        });

      const dataGraph = [
        {
          name: intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
          data: publisherRepository,
          color: editeurarchive,
          dataLabels: noOutline,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.repository' }),
          data: repository,
          color: archiveouverte100,
          dataLabels: noOutline,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
          data: publisher,
          color: editeurplateforme100,
          dataLabels: noOutline,
        },
      ];
      return { categories, dataGraph };
    },
    [domain, intl, disciplineField],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { allData, isLoading };
}
export default useGetData;
