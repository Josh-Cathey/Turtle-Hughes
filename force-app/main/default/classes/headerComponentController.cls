public with sharing class headerComponentController {
    // This is used to fetch the user detail including name and image in profile
    @AuraEnabled
    public static user fetchUserDetail(){
        System.debug('UserFunctionCalled');
        return [Select id,Name,MobilePhone,Phone,FirstName, LastName,ContactId,Profile.Name ,Address, AboutMe, SmallPhotoUrl, MediumPhotoUrl,
        FullPhotoUrl From User Where Id =: Userinfo.getUserId()];
    }
    //This is used to fetch cart Id of a particular user
    @AuraEnabled
    public static Id fetchCartInfo(String conId){
        Contact c = [Select Id,AccountId from Contact where Id=:conId];
        Id cartId;
        WebCart cartDetails = [SELECT Id, AccountId, Name FROM WebCart where AccountId =:c.AccountId order by CreatedDate desc limit 1];
        cartId = cartDetails.Id;
        System.debug(cartId);
        return cartId;
    }
    //This method is used for showing items in cart
    @AuraEnabled
    public static CartItem fetchCartItems(String conId){
        Contact conDetails = [Select Id,AccountId from Contact where Id=:conId];
        WebCart cartId = [SELECT Id, AccountId, Name FROM WebCart where AccountId =:conDetails.AccountId order by CreatedDate desc limit 1];
        CartItem cartItemInfo = [SELECT Id, CartId, Quantity, Name, SalesPrice FROM CartItem where CartId=: cartId.Id];
        System.debug(cartItemInfo);
        return cartItemInfo;
    } 
}