import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const greenMedium150 = getCSSValue('--green-medium-150');
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function GetData() {
    const query = getFetchOptions({
      key: 'repositoriesHisto',
      domain,
      parameters: [observationSnap],
      objectType: ['publications'],
    });

    const res = await Axios.post(ES_API_URL, query, HEADERS);
    let tab = [];
    const nbHisto = 5;
    const lastPublicationYear = observationSnap.substr(0, 4);
    res.data.aggregations.by_repository.buckets.forEach(
      (archive, archiveIndex) => {
        if (archive.key !== 'N/A') {
          const obj = {
            key: archive.key,
            name: intl.formatMessage({
              id: `app.repositories.label.${archive.key
                .toLowerCase()
                .replace(/ /g, '')}`,
              defaultMessage: archive.key,
            }),
            annotationVisible: archiveIndex === 0,
            color: greenMedium150,
            data: archive.by_year.buckets
              .filter(
                (el) => el.key > lastPublicationYear - nbHisto
                  && el.key <= lastPublicationYear,
              )
              .sort((a, b) => a.key - b.key)
              .map((el, index) => ({
                name: el.key,
                bsoDomain,
                year: el.key,
                x: el.key,
                y: el.doc_count,
                color:
                  index === nbHisto - 1
                    ? getCSSValue('--green-medium-125')
                    : greenMedium150,
              })),
          };
          obj.data.forEach((el, index) => {
            obj.data[index].yoy = index > 0
              ? (100 * (el.y - obj.data[index - 1].y)) / obj.data[index - 1].y
              : null;
          });
          tab.push(obj);
        }
      },
    );
    tab = tab.sort(
      (a, b) => (b.data.find((el) => el.name === lastPublicationYear)?.y || 0)
        - (a.data.find((el) => el.name === lastPublicationYear)?.y || 0),
    );
    tab = tab.slice(0, 12);

    const key = 'HAL';
    const halData = tab.find((item) => item.key === key)?.data;
    const year1 = halData[0]?.year;
    const value1 = halData[0]?.y;
    const year2 = halData[halData.length - 1]?.year;
    const value2 = halData[halData.length - 1]?.y;

    const comments = {
      name: key,
      value1,
      value2,
      year1,
      year2,
    };

    return { comments, tab };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await GetData();
        setData(dataGraph);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { data, isError, isLoading };
}

export default useGetData;
