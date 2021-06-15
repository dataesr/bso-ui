/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../configs/config';

function useGetData(observationDate) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataForLastObservationDate(lastObservationDate) {
    const query = {
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'publication_year',
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${lastObservationDate}.oa_host_type.keyword`,
              },
            },
          },
        },
      },
    };

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const data = res.data.aggregations.by_publication_year.buckets;

    // Tri pour avoir les années dans l'ordre d'affichage du graph
    data.sort((a, b) => a.key - b.key);

    const categories = []; // Elements d'abscisse
    const repository = []; // archive ouverte
    const publisher = []; // éditeur
    const publisherRepository = []; // les 2

    data.filter((el) => (el.key > 2012 && el.key < lastObservationDate.substring(0, 4)))
      .forEach((el) => {
        categories.push(el.key);
        let temp = el.by_oa_host_type.buckets.find(
          (item) => item.key === 'repository',
        );
        repository.push(temp.doc_count || 0);

        temp = el.by_oa_host_type.buckets.find(
          (item) => item.key === 'publisher',
        );
        publisher.push(temp.doc_count || 0);

        temp = el.by_oa_host_type.buckets.find(
          (item) => item.key === 'publisher;repository',
        );
        publisherRepository.push(temp.doc_count || 0);
      });

    const dataGraph = [
      {
        name: 'publisher;repository',
        data: publisherRepository,
        color: '#91AE4F',
      },
      {
        name: 'repository',
        data: repository,
        color: '#19905B',
      },
      {
        name: 'publisher',
        data: publisher,
        color: '#EAD737',
      },
    ];

    const dataGraph3 = [
      {
        name: 'publisher',
        value: data[data.length - 1].by_oa_host_type.buckets.find(
          (item) => item.key === 'publisher',
        ).doc_count,
        color: '#EAD737',
      },
      {
        name: 'publisher;repository',
        value: data[data.length - 1].by_oa_host_type.buckets.find(
          (item) => item.key === 'publisher;repository',
        ).doc_count,
        color: '#91AE4F',
      },
      {
        name: 'repository',
        value: data[data.length - 1].by_oa_host_type.buckets.find(
          (item) => item.key === 'repository',
        ).doc_count,
        color: '#19905B',
      },
      {
        name: 'closed',
        value: data[data.length - 1].by_oa_host_type.buckets.find(
          (item) => item.key === 'closed',
        ).doc_count,
        color: '#26283F',
      },
    ];

    return { categories, dataGraph, dataGraph3 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationDate(observationDate);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    getData();
  }, [observationDate]);

  return { allData, isLoading, isError };
}
export default useGetData;
