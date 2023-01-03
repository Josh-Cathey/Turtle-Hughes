@IsTest
public class AdVic_GuestUserNumberGeneratorTest {

    @IsTest
    static void testGetNumber() {
        Auto_Number_Generator__c trackerTest = new Auto_Number_Generator__c();
        trackerTest.Field_Descriptor__c = 'GuestUser';
        trackerTest.Latest_Number__c = 100;
        insert trackerTest;

        List<Integer> newNumbers = AdVic_GuestUserNumberGenerator.getNumber();
        Auto_Number_Generator__c trackerEval = [SELECT Id, Latest_Number__c FROM Auto_Number_Generator__c WHERE Field_Descriptor__c = 'GuestUser'];

        System.assertEquals(101, newNumbers.get(0));
        System.assertEquals(101, trackerEval.Latest_Number__c);
    }

}