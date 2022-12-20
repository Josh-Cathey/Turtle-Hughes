public with sharing class AdVic_GuestCartController {

    //     public AdVic_GuestCartController() {}

    @AuraEnabled
    public static Guest_Cart__c addItemToGuestCart(String cartId, String productId) {
        try {
                Guest_Cart_Item__c newCartItem = new Guest_Cart_Item__c(
                    Guest_Cart__c = cartId, 
                    Name = 'SFDevJC', // Need to figure out our naming convention here
                    Product__c = productId,
                    Quantity__c = 1 // Need to add logic to increment this value in another method
                );

            insert newCartItem;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        // Return the updated cart
        return [SELECT Id, Status__c, TaxType__c, TotalAmount__c, Type__c, Name, GrandTotalAmount__c, Cart_Subtotal__c, TotalAmountAfterAllAdjustments__c 
                FROM Guest_Cart__c WHERE Id = :cartId];
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

    @AuraEnabled
    public static Guest_Cart__c createCartWithItem(String productId) {
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

        // Add the item to the cart
        Guest_Cart_Item__c newCartItem = new Guest_Cart_Item__c(
            Guest_Cart__c = newGuestCart.Id, 
            Name = 'SFDevJC', // Need to figure out our naming convention here
            Product__c = productId,
            Quantity__c = 1 // Need to add logic to increment this value in another method
        );

        try {
            insert newCartItem;
        }
        catch(DmlException e) {
            System.debug('Unable to insert guest cart and item in AdVic_GuestCartController.createCartWithItem()');
            System.debug('Error message = ' + e.getMessage());
        }
        

        return [SELECT Id, Status__c, TaxType__c, TotalAmount__c, Type__c, Name, GrandTotalAmount__c, Cart_Subtotal__c, TotalAmountAfterAllAdjustments__c 
        FROM Guest_Cart__c WHERE Id = :newGuestCart.Id];
    }
}