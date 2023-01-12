public without sharing class AdVic_GuestCartController {

    // public AdVic_GuestCartController() {}

    // Changes Made By daniel
    @AuraEnabled
    public static List<Guest_Cart_Item__c> getGuestCartItems(String guestCartId){
        List<Guest_Cart_Item__c> listOfItem = [SELECT Id, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c  
                                                FROM Guest_Cart_Item__c 
                                                WHERE Guest_Cart__c = :guestCartId ];
        return listOfItem;
    }

    @AuraEnabled
    public static Guest_Cart__c retrieveUpdatedGuestCart(String cartId) {
        return [SELECT Id, Name, Status__c, Type__c, Cart_Subtotal__c, TaxType__c, TotalAmount__c, GrandTotalAmount__c, TotalAmountAfterAllAdjustments__c 
                FROM Guest_Cart__c 
                WHERE Id = :cartId];
    }

    @AuraEnabled 
    public static void updateGuestCartTotals(String cartId) {
        Decimal totalAmount = 0;
        Decimal grandTotalAmount = 0;
        Decimal TotalAmountAfterAllAdjustments = 0;

        Guest_Cart__c guestCart = [SELECT Id, Name, Status__c, Type__c, Cart_Subtotal__c, TaxType__c, TotalAmount__c, GrandTotalAmount__c, TotalAmountAfterAllAdjustments__c 
                                        FROM Guest_Cart__c 
                                        WHERE Id = :cartId];

        List<Guest_Cart_Item__c> guestCartItems = [SELECT Id, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                                    FROM Guest_Cart_Item__c 
                                                    WHERE Guest_Cart__c = :cartId];

        for (Guest_Cart_Item__c item : guestCartItems) {
            totalAmount += item.Quantity__c * item.SalesPrice__c;
        }
        grandTotalAmount = totalAmount;
        TotalAmountAfterAllAdjustments = totalAmount; // this might need updated at a later time

        guestCart.TotalAmount__c = totalAmount;
        guestCart.GrandTotalAmount__c = grandTotalAmount;
        guestCart.TotalAmountAfterAllAdjustments__c = TotalAmountAfterAllAdjustments;
        
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

    @AuraEnabled
    public static Guest_Cart_Item__c updateGuestCartItemTotals(String guestCartItemId, Integer quantity) {
        Guest_Cart_Item__c updatedItem = [SELECT Id, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                            FROM Guest_Cart_Item__c 
                                            WHERE Id = :guestCartItemId];

        updatedItem.Quantity__c = decimal.valueof(quantity);

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

        // update the cart total fields
        updateGuestCartTotals(updatedItem.Guest_Cart__c);
        return updatedItem;
    }
    

    @AuraEnabled
    public static Guest_Cart_Item__c adjustProductQuantity(String guestCartItemId, Integer quantity) {
        Guest_Cart_Item__c updatedItem = [SELECT Id, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c 
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

        // update the cart total fields
        updateGuestCartTotals(updatedItem.Guest_Cart__c);

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

        Decimal unitPrice = guestCartItemPrice(productId);

        newCartItem.TotalLineAmount__c = unitPrice * quantity;
        newCartItem.TotalAmount__c = unitPrice * quantity;
        newCartItem.TotalLineGrossAmount__c = unitPrice * quantity;
        newCartItem.TotalPrice__c = unitPrice * quantity;
        newCartItem.TotalAmount__c = unitPrice * quantity;
        newCartItem.SalesPrice__c = unitPrice;
        newCartItem.UnitAdjustedPrice__c = unitPrice;

        try {
            insert newCartItem;
        } 
        catch (DmlException e) {
            System.debug('Error in AdVic_GuestCartController.addItemToGuestCart: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        // update the cart total fields
        updateGuestCartTotals(newCartItem.Guest_Cart__c);

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

    @AuraEnabled
    public static void deleteGuestCartItem(Id itemId) {
        Guest_Cart_Item__c cartItem = [SELECT Id FROM Guest_Cart_Item__c WHERE Id = :itemId];
        try {
            delete cartItem;
        }
        catch(DmlException e) {
            System.debug('Unable to deleting Guest Cart Item in AdVic_GuestCartController.deleteGuestCartItem()');
            System.debug('Error message = ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteGuestCart(Id guestCartId) {
        Guest_Cart__c guestCart = [SELECT Id FROM Guest_Cart__c WHERE Id = :guestCartId];

        // Delete the items from the cart first
        deleteGuestCartItems(guestCartId);
        try {
            delete guestCart;
        }
        catch(DmlException e) {
            System.debug('Unable to deleting Guest Cart Item in AdVic_GuestCartController.deleteGuestCartItem()');
            System.debug('Error message = ' + e.getMessage());
        }
    }

    private static void deleteGuestCartItems(Id guestCartId) {
        List<Guest_Cart_Item__c> cartItems = [SELECT Id, Guest_Cart__c FROM Guest_Cart_Item__c WHERE Guest_Cart__c = :guestCartId];
        try {
            delete cartItems;
        }
        catch(DmlException e) {
            System.debug('Unable to deleting Guest Cart Item in AdVic_GuestCartController.deleteGuestCartItem()');
            System.debug('Error message = ' + e.getMessage());
        }
    }

    @AuraEnabled 
    public static List<Guest_Cart_Item__c> sortGuestCartItems(Id guestCartId, String sortOrder) {
        List<Guest_Cart_Item__c> itemList = new List<Guest_Cart_Item__c>()

;        // we will need a big conditional here to determine how we need to sort
        if (sortOrder == 'CreatedDateDesc') {
            itemList = [SELECT Id, CreatedDate, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                                FROM Guest_Cart_Item__c 
                                                WHERE Guest_Cart__c = :guestCartId
                                                ORDER BY CreatedDate DESC];
        }
        else if (sortOrder == 'CreatedDateAsc') {
            itemList = [SELECT Id, CreatedDate, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                                FROM Guest_Cart_Item__c 
                                                WHERE Guest_Cart__c = :guestCartId
                                                ORDER BY CreatedDate ASC];
        }
        else if (sortOrder == 'NameAsc') {
            itemList = [SELECT Id, CreatedDate, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                                FROM Guest_Cart_Item__c 
                                                WHERE Guest_Cart__c = :guestCartId
                                                ORDER BY Name ASC];
        }
        else if (sortOrder == 'NameDesc') {
            itemList = [SELECT Id, CreatedDate, Guest_Cart__c, Name, Product__c, SalesPrice__c, UnitAdjustedPrice__c, Quantity__c, TotalAmount__c, TotalPrice__c 
                                                FROM Guest_Cart_Item__c 
                                                WHERE Guest_Cart__c = :guestCartId
                                                ORDER BY Name DESC];
        }

        return itemList;
    }
}