public with sharing class headerComponentController {
    @AuraEnabled
    public static user fetchUserDetail(){
        System.debug('UserFunctionCalled');
        return [Select id,Name,FirstName, LastName,Address, AboutMe, SmallPhotoUrl, MediumPhotoUrl,
               FullPhotoUrl From User Where Id =: Userinfo.getUserId()];
    }
    @AuraEnabled
    public static void guestCartDetails(String nameGuestCart){
        //list<Guest_Cart__c> guestCartList = [SELECT Id, Name, TotalAmount__c FROM Guest_Cart__c];
        //return guestCartList;
        System.debug(nameGuestCart);
        Guest_Cart__c guestCartRecord = new Guest_Cart__c(Name='Test Daniel');
        Insert guestCartRecord;
    }  
}