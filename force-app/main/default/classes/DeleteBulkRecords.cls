global class DeleteBulkRecords implements Database.Batchable<sObject>
{
    global Database.QueryLocator start(Database.BatchableContext BC)
    {
        String query = 'SELECT Id,Name FROM OpenOrder__c ';
        return Database.getQueryLocator(query);
    }
   
    global void execute(Database.BatchableContext BC, List<OpenOrder__c> scope)
    {
      delete scope;
    }   
    global void finish(Database.BatchableContext BC)
    {
    }
}