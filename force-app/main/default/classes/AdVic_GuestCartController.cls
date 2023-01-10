public without sharing class AdVic_GuestCartController {

    // public AdVic_GuestCartController() {}

    // Changes Made By daniel
    @AuraEnabled
    public static List<Guest_Cart_Item__c> getGuestCartItems(String guestCartId){
        List<Guest_Cart_Item__c> listOfItem = [SELECT Quantity__c, Guest_Cart__c, Id FROM Guest_Cart_Item__c where Guest_Cart__c = :guestCartId ];
        return listOfItem;
    }

    @AuraEnabled
    public static Guest_Cart__c retrieveUpdatedGuestCart(String cartId) {
        return [SELECT Id, Name, Status__c, Type__c, Cart_Subtotal__c, TaxType__c, TotalAmount__c, GrandTotalAmount__c, TotalAmountAfterAllAdjustments__c 
                FROM Guest_Cart__c 
                WHERE Id = :cartId];
    }

    private static void updateGuestCartTotals(String cartId, Decimal totalAmount, Decimal grandTotalAmount, decimal totalAmountAfterAllAdjustments) {
        List<Guest_Cart__c> guestCart = [SELECT Id, Name, Status__c, Type__c, Cart_Subtotal__c, TaxType__c, TotalAmount__c, GrandTotalAmount__c, TotalAmountAfterAllAdjustments__c 
                                        FROM Guest_Cart__c 
                                        WHERE Id = :cartId];

        guestCart[0].TotalAmount__c += totalAmount;
        guestCart[0].GrandTotalAmount__c += grandTotalAmount;
        guestCart[0].TotalAmountAfterAllAdjustments__c += totalAmountAfterAllAdjustments;
        
        try {
            update guestCart;
        }
        catch(DmlException e) {
            System.debug('Error in AdVic_GuestCartController.updateGuestCartTotals: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static Decimal guestCartItemPrice(Id productId) {
        // Boolean useStandardPrice = false;
        Decimal productPrice;

        List<PriceBookEntry> priceBook = [SELECT Id, Product2Id, UnitPrice, UseStandardPrice 
                                            FROM PricebookEntry 
                                            WHERE Product2Id = :productId
                                            AND IsActive = true];

        for (Integer i = 0; i < priceBook.size(); i++) {
            if (priceBook[i].UseStandardPrice) {
                productPrice = priceBook[i].UnitPrice;
                // useStandardPrice = true;
                break;
            }

            // If we're iterating on the last element and no PriceBookEntry record is using standard pricing, use the last record for the price
            if ((i + 1) == priceBook.size()){
                productPrice = priceBook[i].UnitPrice;
            }
        }

        //return guestCartItem.Quantity__c * productPrice;
        return productPrice;
    }
    

    // We need to update all price fields on the Guest Cart Item so we can use it in the above function when updating totals
    // need to figure out how to calculate all these fields, and how to get necessary data from Price Book Entry
    @AuraEnabled
    public static Guest_Cart_Item__c adjustProductQuantity(String guestCartItemId, Integer quantity) {
        Guest_Cart_Item__c updatedItem = [SELECT Id, Guest_Cart__c, Name, Product__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                            FROM Guest_Cart_Item__c 
                                            WHERE Id = :guestCartItemId];

        updatedItem.Quantity__c += decimal.valueof(quantity);

        Decimal productPrice = guestCartItemPrice(updatedItem.Product__c);

        updatedItem.TotalPrice__c = productPrice * updatedItem.Quantity__c;
        updatedItem.TotalLineAmount__c = updatedItem.TotalPrice__c;
        updatedItem.TotalAmount__c = updatedItem.TotalPrice__c;
        updatedItem.TotalLineGrossAmount__c = updatedItem.TotalPrice__c;

        try {
            update updatedItem;
        }
        catch(DmlException e) {
            System.debug('Error in AdVic_GuestCartController.adjustProductQuantity: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        // Adjust cart totals (sDecimal totalAmount, Decimal grandTotalAmount, decimal totalAmountAfterAllAdjustments) {
        Decimal totalAmount = quantity * productPrice;
        Decimal grandTotalAmount = totalAmount;
        Decimal totalAmountAfterAllAdjustments = totalAmount;

        // update the cart total fields
        updateGuestCartTotals(updatedItem.Guest_Cart__c, totalAmount, grandTotalAmount, totalAmountAfterAllAdjustments);

        return updatedItem;
    }

    @AuraEnabled
    public static Guest_Cart_Item__c addProductToCart(String cartId, String productId, Integer quantity) {
        // Get the products name for the guest cart item
        Product2 product = [SELECT Id, Name FROM Product2 WHERE Id = :productId];
        Guest_Cart_Item__c newCartItem = new Guest_Cart_Item__c(
                            Guest_Cart__c = cartId, 
                            Name = product.Name,
                            Product__c = productId,
                            Quantity__c = quantity 
                        );

        Decimal productPrice = guestCartItemPrice(productId);

        newCartItem.TotalLineAmount__c = productPrice * quantity;
        newCartItem.TotalAmount__c = productPrice * quantity;
        newCartItem.TotalLineGrossAmount__c = productPrice * quantity;
        newCartItem.TotalPrice__c = productPrice * quantity;
        newCartItem.TotalAmount__c = productPrice * quantity;

        try {
            insert newCartItem;
        } 
        catch (DmlException e) {
            System.debug('Error in AdVic_GuestCartController.addItemToGuestCart: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        // update the cart total fields
        updateGuestCartTotals(newCartItem.Guest_Cart__c, newCartItem.TotalAmount__c, newCartItem.TotalAmount__c, newCartItem.TotalAmount__c);

        return newCartItem;
    }


    @AuraEnabled
    public static Guest_Cart__c createCart() {
        Guest_Cart__c newGuestCart = new Guest_Cart__c(
            Status__c = 'Active', 
            Type__c = 'Cart', 
            Name = 'sfDevJC',
            TotalAmount__c = 0.00,
            GrandTotalAmount__c = 0.00,
            TotalAmountAfterAllAdjustments__c = 0.00
        );

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