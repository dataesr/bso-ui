import { ES_API_URL } from '../config/config';
import useFetch from './Hooks/useFetch';

export async function GetPublicationFrom(year) {
  const n = new Date();
  const currentMillesime = n.getFullYear() - 1;
  const { response, isLoading } = await useFetch({
    url: ES_API_URL,
    method: 'post',
    options: {
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'publication_year',
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${year || currentMillesime}.is_oa`,
              },
            },
          },
        },
      },
    },
  });
  return { response, isLoading };
}

export async function GetPublicationRateFrom(year) {
  const n = new Date();
  const currentMillesime = n.getFullYear() - 1;
  let rate = null;
  const rateResult = {};

  const { response, isLoading } = await useFetch({
    url: ES_API_URL,
    method: 'post',
    options: {
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'publication_year',
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${year || currentMillesime}.is_oa`,
              },
            },
          },
        },
      },
    },
  });

  if (!isLoading && Object.keys(response).length > 0) {
    const sortedData = response.data?.aggregations.by_publication_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key
            < parseInt(`${year || currentMillesime}`.substring(0, 4), 10)
          && el.by_is_oa.buckets.length > 0
          && el.doc_count
          && el.key > 2012,
      );

    const truncatedData = sortedData.map((elm) => Math.trunc((elm.by_is_oa.buckets[0].doc_count * 100) / elm.doc_count));
    rate = truncatedData[truncatedData.length - 1];

    if (Object.keys(rateResult).length === 0 && rate) {
      rateResult.rateByYear = rate;
      rateResult.year = year ? year.toString() : currentMillesime;
    }
  }
  return rateResult;
}
