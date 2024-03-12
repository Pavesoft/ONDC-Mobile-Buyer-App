import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAppTheme} from '../../../../../utils/theme';
import {useTranslation} from 'react-i18next';

const PaymentMethod = ({
  payment,
  address,
  contact,
}: {
  payment: any;
  address: any;
  contact: any;
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Text variant={'titleLarge'} style={styles.title}>
        {t('Profile.Payment Methods')}
      </Text>
      <TouchableOpacity
        style={styles.modeContainer}
        onPress={() => navigation.navigate('PaymentMethods')}>
        <Text variant={'bodySmall'} style={styles.mode}>
          {payment?.type === 'ON-FULFILLMENT' ? 'Cash On Delivery' : 'Prepaid'}
        </Text>
        <Icon
          name={'keyboard-arrow-right'}
          size={20}
          color={theme.colors.neutral300}
        />
      </TouchableOpacity>
      <Divider style={styles.divider} />
      <Text variant={'titleLarge'} style={styles.addressTitle}>
        {t('Profile.Shipping Address')}
      </Text>
      <TouchableOpacity
        style={styles.modeContainer}
        onPress={() => navigation.navigate('PaymentMethods')}>
        <Text variant={'bodySmall'} style={styles.mode}>
          {address?.name}, {contact?.phone}
          {'\n'}
          {address?.locality}, {address?.building}, {address?.city},{' '}
          {address?.state}, {address?.country} - {address?.area_code}
        </Text>
        <Icon
          name={'keyboard-arrow-right'}
          size={20}
          color={theme.colors.neutral300}
        />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral100,
      marginHorizontal: 16,
      padding: 16,
      marginTop: 20,
    },
    title: {
      marginBottom: 5,
      color: colors.neutral400,
    },
    addressTitle: {
      marginBottom: 12,
      color: colors.neutral400,
    },
    mode: {
      color: colors.neutral300,
      flex: 1,
    },
    modeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    divider: {
      marginVertical: 12,
    },
  });

export default PaymentMethod;
