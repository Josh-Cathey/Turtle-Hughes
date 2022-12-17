// NOTE: We are currently leveraging the code listed in the B2BCartController in this GuestCartController
// This code will be modified to allow guest cart creation, as well as handle any needed fetch requests for 
// the cart and product data
public with sharing class AdVic_GuestCartController {
    
//     public AdVic_GuestCartController() {}

// /**
//    * @description Demonstrates how to call ConnectApi.CommerceCart.getCartItems
//    * @param  communityId The Id of the community from which the call originated
//    * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
//    * @param activeCartOrId ID of the cart, active, or current.
//    * @param pageParam Specifies the page token to be used to view a page of information.
//    * @param sortParam Sort order for items in a cart.
//    * @return CartItemCollection A collection of cart items
//    */
//   @AuraEnabled
//   public static ConnectApi.CartItemCollection getCartItems(
//     String communityId,
//     String effectiveAccountId,
//     String activeCartOrId,
//     String pageParam,
//     String sortParam
//   ) {
//     // Lookup the webstore ID associated with the community
//     String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

//     // Get the ConnectApi.CartItemSortOrder enum value from string.
//     // For the list of possible values, see:
//     // see https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/connectAPI_enums.htm#cartItemSortOrderEnum
//     ConnectApi.CartItemSortOrder resolvedSortParam = B2BUtils.resolveSortParam(
//       sortParam
//     );

//     // For more details, see:
//     // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
//     return ConnectApi.CommerceCart.getCartItems(
//       webstoreId,
//       effectiveAccountId,
//       activeCartOrId,
//       pageParam,
//       resolvedSortParam
//     );
//   }

//   /**
//    * @description Demonstrates how to call ConnectApi.CommerceCart.updateCartItem
//    * @param  communityId The Id of the community from which the call originated
//    * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
//    * @param activeCartOrId ID of the cart, active, or current.
//    * @param cartItemId ID of the cart item to be updated.
//    * @return CartItem The updated cart item
//    */
//   @AuraEnabled
//   public static ConnectApi.CartItem updateCartItem(
//     String communityId,
//     String effectiveAccountId,
//     String activeCartOrId,
//     String cartItemId,
//     ConnectApi.CartItemInput cartItem
//   ) {
//     // Lookup the webstore ID associated with the community
//     String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

//     // For more details, see:
//     // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
//     return ConnectApi.CommerceCart.updateCartItem(
//       webstoreId,
//       effectiveAccountId,
//       activeCartOrId,
//       cartItemId,
//       cartItem
//     );
//   }

//   /**
//    * @description Demonstrates how to call ConnectApi.CommerceCart.deleteCartItem
//    * @param  communityId The Id of the community from which the call originated
//    * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
//    * @param activeCartOrId ID of the cart, active, or current.
//    * @param cartItemId ID of the cart item to be deleted.
//    */
//   @AuraEnabled
//   public static void deleteCartItem(
//     String communityId,
//     String effectiveAccountId,
//     String activeCartOrId,
//     String cartItemId
//   ) {
//     // Lookup the webstore ID associated with the community
//     String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

//     // For more details, see:
//     // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
//     ConnectApi.CommerceCart.deleteCartItem(
//       webstoreId,
//       effectiveAccountId,
//       activeCartOrId,
//       cartItemId
//     );
//   }

//   /**
//    * @description Demonstrates how to call ConnectApi.CommerceCart.getCartSummary
//    * @param  communityId The Id of the community from which the call originated
//    * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
//    * @param activeCartOrId ID of the cart, active, or current.
//    */
//   @AuraEnabled
//   public static ConnectApi.CartSummary getCartSummary(
//     String communityId,
//     String effectiveAccountId,
//     String activeCartOrId
//   ) {
//     // Lookup the webstore ID associated with the community
//     String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

//     // For more details, see:
//     // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
//     return ConnectApi.CommerceCart.getCartSummary(
//       webstoreId,
//       effectiveAccountId,
//       activeCartOrId
//     );
//   }

    @AuraEnabled
    public static void createGuestCartItem(Guest_Cart__c guestCart, Product2 product){
        try {
            Guest_Cart_Item__c newCartItem = new Guest_Cart_Item__c(
                Guest_Cart__c = guestCart.Id, 
                Name = 'SFDevJC', // Need to figure out our naming convention here
                Product__c = product.Id,
                Quantity__c = 1 // Need to add logic to increment this value in another method
            );
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        // Should we be returning a cart, the item/product, or some other message/reponse
        // I think we should return the updated cart containing the new item
    }

  /**
   * @description Demonstrates how to call ConnectApi.CommerceCart.createCart
   * @param  communityId The Id of the community from which the call originated
   * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
   */
  @AuraEnabled
  public static Guest_Cart__c createCart() {
    // Lookup the webstore ID associated with the community
    // String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);
    // ConnectApi.CartInput cartInput = new ConnectApi.CartInput();
    // cartInput.effectiveAccountId = effectiveAccountId;
    // For more details, see:
    // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
    // return ConnectApi.CommerceCart.createCart(webstoreId, cartInput);
    Guest_Cart__c newGuestCart = new Guest_Cart__c(Status__c = 'Active', Type__c = 'Cart', Name = 'sfDevJC');

    try {
        insert newGuestCart;
    }
    catch(DmlException e) {
        System.debug('Unable to insert guest cart in AdVic_GuestCartController.createCart()');
        System.debug('Error message = ' + e.getMessage());
    }

    return newGuestCart;
  }

//   /**
//    * @description Demonstrates how to call ConnectApi.CommerceCart.deleteCart
//    * @param  communityId The Id of the community from which the call originated
//    * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
//    * @param activeCartOrId ID of the cart, active, or current.
//    */
//   @AuraEnabled
//   public static void deleteCart(
//     String communityId,
//     String effectiveAccountId,
//     String activeCartOrId
//   ) {
//     // Lookup the webstore ID associated with the community
//     String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

//     // For more details, see:
//     // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
//     ConnectApi.CommerceCart.deleteCart(
//       webstoreId,
//       effectiveAccountId,
//       activeCartOrId
//     );
//   }
}
