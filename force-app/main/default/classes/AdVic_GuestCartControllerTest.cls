@isTest
public class AdVic_GuestCartControllerTest {

    // private static Product2 testProduct;
    // private static Guest_Cart__c testCart;
    // private static Guest_Cart_Item__c testItem;
    
    // @TestSetup
    // static void testSetup(){
    //     try {
    //         testProduct = new Product2(IsActive = true, Name = 'TEST_PRODUCT');
    //         insert testProduct;
    
    //         testCart = new Guest_Cart__c(Status__c = 'Active', Name = 'TEST_GUEST_CART');
    //         insert testCart;
    
    //         testItem = new Guest_Cart_Item__c(Name = 'TEST_GUEST_CART_ITEM', Product__c = testProduct.Id, Guest_Cart__c = testCart.Id, Quantity__c = 1);
    //         insert testItem;
    //     }
    //     catch(DmlException e) {
    //         System.debug('Error inserting test records: ' + e.getMessage());
    //     }


        // try{
        //     // insert testProduct;
        //     // insert testCart;
        //     // insert testItem;
        // }
        // catch(DmlException e) {
        //     System.debug('Error inserting test records: ' + e.getMessage());
        // }
    // }

    @isTest
    static void testRetrieveGuestCartItems() {
        Product2 testProduct = new Product2(IsActive = true, Name = 'TEST_PRODUCT');
        insert testProduct;

        Guest_Cart__c testCart = new Guest_Cart__c(Status__c = 'Active', Name = 'TEST_GUEST_CART');
        insert testCart;

        Guest_Cart_Item__c testItem = new Guest_Cart_Item__c(Name = 'TEST_GUEST_CART_ITEM', Product__c = testProduct.Id, Guest_Cart__c = testCart.Id, Quantity__c = 1);
        insert testItem;

        
        Guest_Cart_Item__c updatedCartItem = AdVic_GuestCartController.retrieveGuestCartItems(testCart.Id);
        System.assertNotEquals(null, updatedCartItem);
    }

    @isTest
    static void testRetrieveUpdatedGuestCart() {
        Product2 testProduct = new Product2(IsActive = true, Name = 'TEST_PRODUCT');
        insert testProduct;

        Guest_Cart__c testCart = new Guest_Cart__c(Status__c = 'Active', Name = 'TEST_GUEST_CART');
        insert testCart;

        Guest_Cart_Item__c testItem = new Guest_Cart_Item__c(Name = 'TEST_GUEST_CART_ITEM', Product__c = testProduct.Id, Guest_Cart__c = testCart.Id, Quantity__c = 1);
        insert testItem;

        Guest_Cart__c updatedCart = AdVic_GuestCartController.retrieveUpdatedGuestCart(testCart.Id);
        System.assertNotEquals(null, updatedCart);
    }

    // @isTest
    // static void testUpdateGuestCartTotals() {

    // }

    @isTest
    static void testAdjustProductQuantity(){
        Product2 testProduct = new Product2(IsActive = true, Name = 'TEST_PRODUCT');
        insert testProduct;

        Guest_Cart__c testCart = new Guest_Cart__c(Status__c = 'Active', Name = 'TEST_GUEST_CART');
        insert testCart;

        Guest_Cart_Item__c testItem = new Guest_Cart_Item__c(Name = 'TEST_GUEST_CART_ITEM', Product__c = testProduct.Id, Guest_Cart__c = testCart.Id, Quantity__c = 1);
        insert testItem;

        Guest_Cart_Item__c updatedCartItem = AdVic_GuestCartController.adjustProductQuantity(testItem.Id, 3);
        System.assertEquals(testItem.Quantity__c + 3, updatedCartItem.Quantity__c);
    }

    @isTest
    static void testAddProductToCart(){
        Product2 testProduct = new Product2(IsActive = true, Name = 'TEST_PRODUCT');
        insert testProduct;

        Guest_Cart__c testCart = new Guest_Cart__c(Status__c = 'Active', Name = 'TEST_GUEST_CART');
        insert testCart;

        Guest_Cart_Item__c testItem = new Guest_Cart_Item__c(Name = 'TEST_GUEST_CART_ITEM', Product__c = testProduct.Id, Guest_Cart__c = testCart.Id, Quantity__c = 1);
        insert testItem;

        Guest_Cart_Item__c updatedCartItem = AdVic_GuestCartController.addProductToCart(testCart.Id, testProduct.Id, 1);
        System.assertEquals(testCart.Id, updatedCartItem.Guest_Cart__c);
    }

    @isTest
    static void testCreateCart() {
        Guest_Cart__c updatedCart = AdVic_GuestCartController.createCart();
        System.assertNotEquals(null, updatedCart);
    }
}
        
