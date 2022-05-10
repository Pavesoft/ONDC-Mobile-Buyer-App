import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {strings} from '../../../locales/i18n';
import {clearCart} from '../../../redux/actions';
import {appStyles} from '../../../styles/styles';
import {alertWithTwoButtons} from '../../../utils/alerts';
import ProductCard from '../product/ProductCard';
import EmptyComponent from './EmptyComponent';
import Footer from './Footer';

const subTotalLabel = strings('main.cart.sub_total_label');
const message = strings('main.cart.empty_cart_message');
const ok = strings('main.product.ok_label');
const clearCartMessage = strings('main.cart.clear_cart_message');
const cancelLabel = strings('main.product.cancel_label');

/**
 * Component to render list of items added in cart
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const Cart = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const {colors} = theme;

  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  /**
   * function  use to calculate total price of item added in cart
   */
  const subTotal = cartItems.reduce((total, item) => {
    total += item.price.value * item.quantity;
    return total;
  }, 0);

  const emptyCart = () => dispatch(clearCart());

  /**
   * function handles click event of clear cart button
   * which clears the cart list
   */
  const onClearCart = () => {
    alertWithTwoButtons(
      null,
      clearCartMessage,
      ok,
      emptyCart,
      cancelLabel,
      () => console.log('Cancelled'),
    );
  };

  /**
   * function handles click event of checkout button
   */
  const onCheckout = () =>
    navigation.navigate('AddressPicker', {total: subTotal});

  /**
   * Function is used to render single product card in the list
   * @param item:single object from cart list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => <ProductCard item={item} />;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <View
        style={[
          appStyles.container,
          styles.container,
          {backgroundColor: colors.backgroundColor},
        ]}>
        {cartItems.length !== 0 && (
          <View style={[styles.header, {backgroundColor: colors.white}]}>
            <View style={appStyles.container}>
              <Text style={styles.text}>
                {subTotalLabel} {subTotal}
              </Text>
            </View>
            <TouchableOpacity onPress={onClearCart}>
              <Icon name="delete" size={30} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <EmptyComponent message={message} />;
          }}
          contentContainerStyle={
            cartItems.length === 0
              ? appStyles.container
              : styles.contentContainerStyle
          }
        />
        {cartItems.length !== 0 && <Footer onCheckout={onCheckout} />}
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Cart);

const styles = StyleSheet.create({
  container: {paddingBottom: 10},
  text: {fontSize: 20},
  clearCartButton: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: 'center',
  },
  contentContainerStyle: {paddingBottom: 10},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
});
