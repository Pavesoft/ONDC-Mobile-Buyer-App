import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, LOCATIONS} from '../../../../utils/apiActions';
import {skeletonList} from '../../../../utils/utils';
import {useAppTheme} from '../../../../utils/theme';
import {saveStoresList} from '../../../../redux/stores/actions';
import Store from '../../stores/components/Store';
import SectionHeaderWithViewAll from '../../../../components/sectionHeaderWithViewAll/SectionHeaderWithViewAll';
import { useTranslation } from 'react-i18next';

interface StoresNearMe {
  domain?: string;
}

const CancelToken = axios.CancelToken;

const BrandSkeleton = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  return (
    <View style={styles.brand}>
      <SkeletonPlaceholder>
        <View style={styles.brandSkeleton} />
      </SkeletonPlaceholder>
    </View>
  );
};

const StoresNearMe: React.FC<StoresNearMe> = ({domain}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {address} = useSelector(({addressReducer}) => addressReducer);
  const source = useRef<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getAllLocations = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const url = `${API_BASE_URL}${LOCATIONS}?latitude=${
        address.address.lat
      }&longitude=${address.address.lng}&radius=100${
        domain ? `&domain=${domain}` : ''
      }`;
      const {data} = await getDataWithAuth(url, source.current.token);
      setLocations(data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  const showAllStores = () => {
    dispatch(saveStoresList(locations));
    navigation.navigate('StoresNearMe');
  };

  useEffect(() => {
    getAllLocations().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, [domain]);

  return (
    <View style={styles.sectionContainer}>
      <SectionHeaderWithViewAll
        title={t('Home.Stores Near Me')}
        viewAll={showAllStores}
      />

      <View style={styles.container}>
        {apiRequested
          ? skeletonList.map(store => (
              <View style={styles.storeContainer} key={store.id}>
                <BrandSkeleton />
              </View>
            ))
          : locations.slice(0, 8).map(store => (
              <View style={styles.storeContainer} key={store.id}>
                <Store store={store} />
              </View>
            ))}
      </View>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      marginTop: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    storeContainer: {
      width: '33%',
      paddingHorizontal: 8,
    },
    brand: {
      width: 113,
      marginRight: 11,
      marginBottom: 15,
    },
    brandSkeleton: {
      width: 113,
      height: 108,
      marginRight: 11,
    },
    sectionContainer: {
      paddingTop: 28,
    },
  });

export default StoresNearMe;
