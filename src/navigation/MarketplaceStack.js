import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { screenNames } from "./screenNames";
import * as ui from "@/screens";

const Stack = createStackNavigator();

const MarketplaceStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={screenNames.MARKET_PLACE}
        component={ui.MarketPlace}
      />
      <Stack.Screen
        name={screenNames.PRODUCT_DETAILS}
        component={ui.ProductDetails}
      />
      <Stack.Screen
        name={screenNames.MARKETPLACE_CART}
        component={ui.MarketplaceCart}
      />
      <Stack.Screen
        name={screenNames.POST_PRODUCT}
        component={ui.PostProduct}
      />
      <Stack.Screen
        name={screenNames.MARKETPLACE_FAVORITES}
        component={ui.MarketplaceFavorites}
      />
      <Stack.Screen
        name={screenNames.MARKETPLACE_CHECKOUT}
        component={ui.Checkout}
      />
      <Stack.Screen
        name={screenNames.MARKETPLACE_PAYMENT}
        component={ui.Payment}
      />
      <Stack.Screen
        name={screenNames.MARKETPLACE_ORDERS}
        component={ui.Orders}
      />
      <Stack.Screen
        name={screenNames.MARKETPLACE_ORDER_DETAILS}
        component={ui.OrderDetails}
      />
      {/* Marketplace Support Screens */}
      <Stack.Screen
        name="MARKETPLACE_SUPPORT"
        component={ui.MarketplaceSupport}
      />
      <Stack.Screen
        name="MARKETPLACE_DISPUTE_RESOLUTION"
        component={ui.DisputeResolution}
      />
      <Stack.Screen
        name="MARKETPLACE_CREATE_DISPUTE"
        component={ui.CreateDispute}
      />
      <Stack.Screen
        name="MARKETPLACE_DISPUTE_DETAILS"
        component={ui.DisputeDetails}
      />
      <Stack.Screen
        name="MARKETPLACE_FAQ"
        component={ui.MarketplaceFAQ}
      />
    </Stack.Navigator>
  );
};

export default MarketplaceStack;

const styles = StyleSheet.create({});

