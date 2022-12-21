public without sharing class AdVic_GuestCartController {

    //     public AdVic_GuestCartController() {}

    @AuraEnabled
    public static Guest_Cart_Item__c addProductToCart(String cartId, String productId, Integer quantity) {
        Guest_Cart_Item__c newCartItem = new Guest_Cart_Item__c(
            Guest_Cart__c = cartId, 
            Name = 'SFDevJC', // Need to figure out our naming convention here
            Product__c = productId,
            Quantity__c = quantity // Need to add logic to increment this value in another method
        );

        try {
            insert newCartItem;
        } 
        catch (DmlException e) {
            System.debug('Error in AdVic_GuestCartController.addItemToGuestCart: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        return newCartItem;

        // Return the updated cart
        // return [SELECT Id, Status__c, TaxType__c, TotalAmount__c, Type__c, Name, GrandTotalAmount__c, Cart_Subtotal__c, TotalAmountAfterAllAdjustments__c 
        //         FROM Guest_Cart__c WHERE Id = :cartId];
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

    // @AuraEnabled
    // public static Guest_Cart__c createCartWithItem(String productId) {
    //     Guest_Cart__c newGuestCart = new Guest_Cart__c(Status__c = 'Active', Type__c = 'Cart', Name = 'sfDevJC');

    //     try {
    //         insert newGuestCart;
    //     }
    //     catch(DmlException e) {
    //         System.debug('Unable to insert guest cart in AdVic_GuestCartController.createCart()');
    //         System.debug('Error message = ' + e.getMessage());
    //     }

    //     // Add the item to the cart
    //     Guest_Cart_Item__c newCartItem = new Guest_Cart_Item__c(
    //         Guest_Cart__c = newGuestCart.Id, 
    //         Name = 'SFDevJC', // Need to figure out our naming convention here
    //         Product__c = productId,
    //         Quantity__c = 1 // Need to add logic to increment this value in another method
    //     );

    //     try {
    //         insert newCartItem;
    //     }
    //     catch(DmlException e) {
    //         System.debug('Unable to insert guest cart and item in AdVic_GuestCartController.createCartWithItem()');
    //         System.debug('Error message = ' + e.getMessage());
    //     }

    //     Guest_Cart__c updatedCart = [SELECT Id, Status__c, TaxType__c, TotalAmount__c, Type__c, Name, GrandTotalAmount__c, Cart_Subtotal__c, TotalAmountAfterAllAdjustments__c 
    //                                 FROM Guest_Cart__c 
    //                                 WHERE Id = :newGuestCart.Id];
        
    //     return updatedCart;
    // }
}