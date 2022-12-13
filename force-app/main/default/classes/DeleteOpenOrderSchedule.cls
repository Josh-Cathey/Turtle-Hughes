global class DeleteOpenOrderSchedule implements Schedulable{
    
    global void execute(SchedulableContext SC) {
        DeleteBulkRecords objBulkRecords = new DeleteBulkRecords();
        Database.executeBatch(objBulkRecords , 10000);
    }
}