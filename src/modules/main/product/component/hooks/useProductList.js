import {useContext, useState} from 'react';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {getData} from '../../../../../utils/api';
import {BASE_URL, GET_PRODUCTS} from '../../../../../utils/apiUtilities';
import {Context as AuthContext} from '../../../../../context/Auth';
import {useDispatch} from 'react-redux';
import {saveProducts} from '../../../../../redux/product/actions';

export default () => {
  const dispatch = useDispatch();
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const [pageNumber, setPageNumber] = useState(1);

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getProducts = (id, transactionId, filters) => {
    let getList = setInterval(async () => {
      try {
        let params;
        if (filters) {
          let filterParams = [];
          Object.keys(filters).forEach(key =>
            filterParams.push(`&${key}=${filters[key]}`),
          );
          params = filterParams.toString().replace(/,/g, '');
        }
        const url = filters
          ? `${BASE_URL}${GET_PRODUCTS}${id}${params}`
          : `${BASE_URL}${GET_PRODUCTS}${id}`;
        const {data} = await getData(
          `${url}&pageNumber=${pageNumber}&limit=10`,
          options,
        );

        const productsList = data.message.catalogs.map(item => {
          return Object.assign({}, item, {
            quantity: 0,
            transaction_id: transactionId,
          });
        });

        dispatch(saveProducts(productsList));
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
    }, 10000);
  };

  return {getProducts};
};
