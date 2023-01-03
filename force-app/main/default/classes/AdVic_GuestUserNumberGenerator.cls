public class AdVic_GuestUserNumberGenerator {

    @InvocableMethod(label='Get Guest User Autonumber' description='Generate a new guest user autonumber in a thread safe way!')
    public static List<Integer> getNumber() {
        // Lock this record with FOR UPDATE because other requests may come in at the same time.
        Auto_Number_Generator__c tracker = [SELECT Id, Latest_Number__c FROM Auto_Number_Generator__c WHERE Field_Descriptor__c = 'GuestUser' FOR UPDATE];
        Integer newNumber = tracker.Latest_Number__c.intValue() + 1;

        tracker.Latest_Number__c = newNumber;
        // updating the record effectively unlocks it, allowing other requests to proceed
        update tracker;

        return new List<Integer>{newNumber};
    }

}