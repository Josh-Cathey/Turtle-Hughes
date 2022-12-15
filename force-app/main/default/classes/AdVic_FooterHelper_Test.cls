@isTest
public class AdVic_FooterHelper_Test {
    
    
    @isTest
    public static void testOne(){
        Community_Footer__c footer = new Community_Footer__c();
        Community_Footer_Column__c col = new Community_Footer_Column__c();
        col.Column_Content__c = 'test col data';
        col.Raw_Html__c = '<div>test col div data</div>';
        insert col;
        footer.Column_1__c = col.Id;
        footer.Column_2__c = col.Id;
        footer.Column_3__c = col.Id;
        footer.Column_4__c = col.Id;
        footer.Column_5__c = col.Id;
        footer.Column_6__c = col.Id;
        insert footer;
        
        AdVic_FooterHelper.getFooterData(footer.Id);
        
        col.Raw_Html__c = NULL;
        upsert col;
        AdVic_FooterHelper.getFooterData(footer.Id);
        
        AdVic_FooterHelper apex = new AdVic_FooterHelper();
        VisualEditor.DataRow def = apex.getDefaultValue();
        VisualEditor.DynamicPickListRows rows = apex.getValues();
        
    }

}