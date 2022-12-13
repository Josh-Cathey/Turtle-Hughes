@isTest
public class DeleteOpenOrderSchedule_Test {
    @isTest static void validateDeleteOpenOrder() {
        Account acc = new Account(Name='Test Account', BillingCity = 'EL PASO', BillingState = 'TX');
        insert acc;
        OpenOrder__c objOpenOrder = new OpenOrder__c(
            Account__c 				= acc.Id,
            Cost__c    				= 22,
            Internal_Sales_Rep__c 	= '294 - FRANK INFANTINO',
            Customer_No__c			= '127126',
            Customer__c				= 'NJ TRANSIT',
            OrderLineKey__c			= '1-4806600-0-1'
        );
        insert objOpenOrder;
        Test.startTest();
        DeleteOpenOrderSchedule sh1 = new DeleteOpenOrderSchedule();
        String sch = '0 0 2 * * ?'; 
        system.schedule('Test Territory Check', sch, sh1); 
        Test.stopTest();
    }
   
}