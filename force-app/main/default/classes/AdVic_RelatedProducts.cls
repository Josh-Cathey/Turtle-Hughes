public with sharing class AdVic_RelatedProducts {

    @AuraEnabled(cacheable=true)
    public static List<ConnectApi.ProductDetail> getCrossSellProducts(
      String communityId,
      String productID,
      String effectiveAccountID
    ) {
      // Lookup the webstore ID associated with the community
      String webstoreID = resolveCommunityIdToWebstoreId(communityId);
      //System.Debug('****** webstoreID -' + webstoreID);
      //System.Debug('****** productID -' + productID);
      //System.Debug('****** effectiveAccountID -' + effectiveAccountID);
  
      //New list to received products details
      List<ConnectApi.ProductDetail> myProductsInformations = new List<ConnectApi.ProductDetail>();
  
      List<Related_Product__c> myProductsID = new List<Related_Product__c>();
  
      if(Schema.sObjectType.Related_Product__c.fields.Related_Product__c.isAccessible()
          && Schema.sObjectType.Related_Product__c.fields.Related_Product_Parent__c.isAccessible()) {
  
          // Need Sharing Setting for external user on this object
          myProductsID = [
            SELECT Related_Product__c
            FROM Related_Product__c
            WHERE Related_Product_Parent__c = :productID
          ];
  
      }
  
      Integer count = 0;
      ConnectApi.ProductDetail myproduct;
      for (Related_Product__c myRelatedProductId : myProductsID) {
        myproduct = AdVic_RelatedProducts.getProduct(
          webstoreID,
          myRelatedProductId.Related_Product__c,
          effectiveAccountID
        );
  
        myProductsInformations.add(myproduct);
  
        count++;
      }
      System.Debug('****** BACK TO HOME ##### -' + myProductsInformations);
      return myProductsInformations;
    }
  
    @AuraEnabled(cacheable=true)
    public static ConnectApi.ProductDetail getProduct(
      String webstoreId,
      String productId,
      String effectiveAccountId
    ) {
  
      ConnectApi.ProductDetail pd = null;
  
      if(Test.isRunningTest() == false) {
        // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCatalog_static_methods.htm#apex_ConnectAPI_CommerceCatalog_static_methods
        pd = ConnectApi.CommerceCatalog.getProduct(webstoreId, productId, effectiveAccountID, null, false, null, false, true, false);
      }
      else {
      
        pd = AdVic_B2BTestUtils.getProductDetail(productId);
      }
  
      return pd;
    }
  
    @AuraEnabled(cacheable=true)
    public static String searchCurrentProductPageURL() {
      //Retrieve Community ID
      String myNetworkID = Network.getNetworkId();
  
      String UrlPathPrefix = null;
      
      List<Network> list1 = [
        SELECT UrlPathPrefix
        FROM Network
        WHERE Id = :myNetworkID
      ];
  
      if(list1.size() > 0) {
        UrlPathPrefix = list1.get(0).UrlPathPrefix;
      }
  
      String myDomain = null;
      List<Domain> list2 = [SELECT Domain FROM Domain];
  
      if(list2.size() > 0) {
        myDomain = list2.get(0).Domain;
      }
  
      String myCurrentProductURL =
        'https://' +
        myDomain +
        '/s/product/';
      //system.debug(myCurrentProductURL);
      return myCurrentProductURL;
    }
  
    // Function to retrieve Product Price
    @AuraEnabled(cacheable=true)
    public static ConnectApi.ProductPrice getProductPrice(
      String communityId,
      String productId,
      String effectiveAccountId
    ) {
      // Lookup the webstore ID associated with the community
      String webstoreId = resolveCommunityIdToWebstoreId(communityId);
  
      ConnectApi.ProductPrice price = null;
  
      if(Test.isRunningTest() == false) {
        // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceStorePricing_static_methods.htm#apex_ConnectAPI_CommerceStorePricing_static_methods
        price = ConnectApi.CommerceStorePricing.getProductPrice(webstoreId, productId, effectiveAccountId );
      }
      else {
        price = AdVic_B2BTestUtils.getProductPrice(productId);
      }
  
      return price;
    }
  
    @AuraEnabled
    public static ConnectApi.CartItem addToCart(
      String communityId,
      String productId,
      String quantity,
      String effectiveAccountId
    ) {
      // Lookup the webstore ID associated with the community
      String webstoreId = resolveCommunityIdToWebstoreId(communityId);
  
      ConnectApi.CartItemInput cartInput = new ConnectApi.CartItemInput();
      cartInput.productId = productId;
      cartInput.quantity = quantity;
      cartInput.type = ConnectApi.CartItemType.PRODUCT;
  
      ConnectApi.CartItem cartItem = null;
  
      if(Test.isRunningTest() == false) {
        // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm#apex_ConnectAPI_CommerceCart_static_methods
        cartItem = ConnectApi.CommerceCart.addItemToCart(webstoreId, effectiveAccountId, 'active', cartInput);
      }
  
      return cartItem;
    }
  
    // Function to lookup the webstore ID associated with the community
    public static String resolveCommunityIdToWebstoreId(String communityId) {
      if(communityId == null || communityId == '') {
          return null;
      }
      
      String webstoreId = null;
  
      if(Schema.sObjectType.WebStoreNetwork.fields.WebStoreId.isAccessible()
          && Schema.sObjectType.WebStoreNetwork.fields.NetworkId.isAccessible()) {
          List<WebStoreNetwork> wsnList = [SELECT WebStoreId FROM WebStoreNetwork WHERE NetworkId = :communityId];
  
          if(wsnList.size() > 0) {
              WebStoreNetwork wsn = wsnList.get(0);
              webstoreId = wsn.WebStoreId;
          }
      }
  
      return webstoreId;
    }
  
  }