@IsTest
public with sharing class AdVic_RelatedProductsTest {
    
    private static Id parentProductId;
    private static Id crossProductId;
    private static Id crossItemId;
    private static Id crossPbeId;
    private static Id crossStdPbeId;

    private static String crossProductSku = '999AAA000222';

    private static void setupTestData() {

        parentProductId =  AdVic_B2BTestUtils.createProduct('Parent Product', '999AAA000111', '');

        crossProductId =  AdVic_B2BTestUtils.createProduct('Cross Product', crossProductSku, '');

        crossItemId = AdVic_B2BTestUtils.createCrossSellItem(parentProductId, crossProductId);

        Id pricebookId = AdVic_B2BTestUtils.createPricebook();

        AdVic_B2BTestUtils.createStandardPricebookEntry(parentProductId);

        AdVic_B2BTestUtils.createPricebookEntry(pricebookId, parentProductId);

        crossStdPbeId = AdVic_B2BTestUtils.createStandardPricebookEntry(crossProductId);

        crossPbeId = AdVic_B2BTestUtils.createPricebookEntry(pricebookId, crossProductId);

    }
    
    @IsTest
    /*
        Test getting the product detail
    */
    public static void testCode1() {

        User adminUser = AdVic_B2BTestUtils.createAdminUser();

        System.runAs(adminUser) {
            setupTestData();
        }

        String communityId = null;
        String effectiveAccountID = null;

        List<ConnectApi.ProductDetail> myProductsInformations = null;

        Test.startTest();

        myProductsInformations = AdVic_RelatedProducts.getCrossSellProducts(communityId, parentProductId, effectiveAccountID);

        Test.stopTest();

        System.debug('myProductsInformations: ' + JSON.serialize(myProductsInformations));

        ConnectApi.ProductDetail pd = null;

        pd = myProductsInformations.get(0);

        Map<String, String> fieldMap = pd.fields;

        Product2 product = AdVic_B2BTestUtils.getProduct(crossProductId);

        String sku = fieldMap.get('StockKeepingUnit');

        System.assertEquals(crossProductSku, sku);
    }

    @IsTest
    /*
        Test getting the product price
    */
    public static void testCode2() {

        User adminUser = AdVic_B2BTestUtils.createAdminUser();

        System.runAs(adminUser) {
            setupTestData();
        }

        String communityId = null;
        String effectiveAccountID = null;

        ConnectApi.ProductPrice price = null;

        Test.startTest();

        price = AdVic_RelatedProducts.getProductPrice(communityId, crossProductId, effectiveAccountID);

        Test.stopTest();

        System.debug('price: ' + JSON.serialize(price));

        String listPrice = price.listPrice;
        String unitPrice = price.unitPrice;

        PricebookEntry pbe = AdVic_B2BTestUtils.getPricebookEntry(crossStdPbeId, crossProductId);

        System.assertEquals(listPrice, pbe.UnitPrice.format());

        PricebookEntry pbe2 = AdVic_B2BTestUtils.getPricebookEntry(crossPbeId, crossProductId);

        System.assertEquals(unitPrice, pbe2.UnitPrice.format());

    }

    @IsTest
    /*
        Test adding to the cart
    */
    public static void testCode3() {

        User adminUser = AdVic_B2BTestUtils.createAdminUser();

        System.runAs(adminUser) {
            setupTestData();
        }

        String communityId = null;
        String effectiveAccountID = null;

        ConnectApi.CartItem cartItem = null;

        Test.startTest();

        cartItem = AdVic_RelatedProducts.addToCart(communityId, crossProductId, '1', effectiveAccountID);

        Test.stopTest();
        System.assertEquals(cartItem, null);

    }

    @IsTest
    /*
        Test the search page url function
    */
    public static void testCode4() {

        User adminUser = AdVic_B2BTestUtils.createAdminUser();

        System.runAs(adminUser) {
            setupTestData();
        }

        String myCurrentProductURL = null;

        Test.startTest();

        myCurrentProductURL = AdVic_RelatedProducts.searchCurrentProductPageURL();

        Test.stopTest();

        System.debug(myCurrentProductURL);
        
        Boolean checkIt = myCurrentProductURL.endsWith('/s/product/');

        System.assertEquals(checkIt, true);

    }

}