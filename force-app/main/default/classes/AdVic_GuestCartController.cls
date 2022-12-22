public without sharing class AdVic_GuestCartController {

    //     public AdVic_GuestCartController() {}

    // Should we set proper getters and setters here instead of using the word retrieve?
    // Currently only using 'retrieve' because we don't have getters and setters. 
    // The headerComponent LWC was failing when calling a get method because there is not a getter defined. 

    @AuraEnabled
    public static Guest_Cart_Item__c retrieveGuestCartItems(String guestCartId) {

        return [SELECT Id, Guest_Cart__c, Name, Product__c, Quantity__c 
                FROM Guest_Cart_Item__c 
                WHERE Guest_Cart__c = :guestCartId];
    }

    @AuraEnabled
    public static Guest_Cart__c retrieveUpdatedGuestCart(String cartId) {

        return [SELECT Id, Name, Status__c, Type__c, Cart_Subtotal__c, TaxType__c, TotalAmount__c, GrandTotalAmount__c, TotalAmountAfterAllAdjustments__c 
                FROM Guest_Cart__c 
                WHERE Id = :cartId];
    }

    // add logic that updates the following fields on a cart
    // Cart_Subtotal__c, TotalAmountAfterAllAdjustments__c, GrandTotalAmount__c, TotalAmount__c
    public static void updateGuestCartTotals(String guestCartId, Guest_Cart_Item__c cartItem) {
        Guest_Cart__c guestCart = [SELECT Id, Name, Status__c, Type__c, Cart_Subtotal__c, TaxType__c, TotalAmount__c, GrandTotalAmount__c, TotalAmountAfterAllAdjustments__c 
                                    FROM Guest_Cart__c 
                                    WHERE Id = :guestCartId];

        // guestCart.Cart_Subtotal__c += 0; // roll up summary field
        // guestCart.TotalAmount__c += guestCart.TotalAmount__c;
        // guestCart.GrandTotalAmount__c += guestCart.TotalAmount__c;
        // guestCart.TotalAmountAfterAllAdjustments__c += (guestCart.TotalPriceAfterAllAdjustments__c); // currently throwing an error!!!
    }

    // We need to update all price fields on the Guest Cart Item so we can use it in the above function when updating totals
    // need to figure out how to calculate all these fields, and how to get necessary data from Price Book Entry
    @AuraEnabled
    public static Guest_Cart_Item__c adjustProductQuantity(String guestCartItemId, Integer quantity) {
        Guest_Cart_Item__c updatedItem = [SELECT Id, Guest_Cart__c, Name, Product__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                            FROM Guest_Cart_Item__c 
                                            WHERE Id = :guestCartItemId];
        updatedItem.Quantity__c += quantity;

        try {
            update updatedItem;
        }
        catch(DmlException e) {
            System.debug('Error in AdVic_GuestCartController.adjustProductQuantity: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        return updatedItem;
    }

    @AuraEnabled
    public static Guest_Cart_Item__c addProductToCart(String cartId, String productId, Integer quantity) {
        Guest_Cart_Item__c newCartItem = new Guest_Cart_Item__c(
            Guest_Cart__c = cartId, 
            Name = 'SFDevJC', // Need to figure out our naming convention here
            Product__c = productId,
            Quantity__c = quantity 
        );

        try {
            insert newCartItem;
        } 
        catch (DmlException e) {
            System.debug('Error in AdVic_GuestCartController.addItemToGuestCart: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        return newCartItem;
    }


    @AuraEnabled
    public static Guest_Cart__c createCart() {
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
}