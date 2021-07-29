import { ES_API_URL } from '../config/config';
import useFetch from './Hooks/useFetch';

export async function GetPublicationFrom(year) {
  const { response, isLoading } = await useFetch({
    url: ES_API_URL,
    method: 'post',
    options: {
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${year}.is_oa`,
              },
            },
          },
        },
      },
    },
  });
  return { response, isLoading };
}

export const GetPublicationRateFrom = async (year) => {
  const result = {};
  const options = {
    size: 0,
    aggs: {
      by_publication_year: {
        terms: {
          field: 'year',
        },
        aggs: {
          by_is_oa: {
            terms: {
              field: `oa_details.${year}.is_oa`,
            },
          },
        },
      },
    },
  };

  const { response, isLoading } = await useFetch({
    url: ES_API_URL,
    method: 'post',
    options,
  });
  if (!isLoading && Object.keys(response).length > 0 && year) {
    const currentYear = year.substring(0, 4);
    const sortedData = response.data?.aggregations.by_publication_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key < parseInt(currentYear, 10)
          && el.by_is_oa.buckets.length > 0
          && el.doc_count
          && el.key > 2012,
      );
    const truncatedData = sortedData.map((elm) => Math.trunc((elm.by_is_oa.buckets[0].doc_count * 100) / elm.doc_count));
    result.rate = truncatedData[truncatedData.length - 1];
  }
  return result;
};
