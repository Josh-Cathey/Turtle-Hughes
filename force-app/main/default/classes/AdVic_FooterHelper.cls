global class AdVic_FooterHelper extends VisualEditor.DynamicPickList{
    @AuraEnabled
    public static RecordType getRtOption(String pageRef_RT){
		RecordType rtInfo = [SELECT Id, Name, DeveloperName FROM RecordType WHERE sObjectType = 'Community_Footer__c' AND Id =: pageRef_RT];
    	return rtInfo;
    }
    
    @AuraEnabled
    public static FooterData getFooterData(String footerId){
        List<String> colStrings = new List<String>();
        
        Community_Footer__c footerData = [SELECT Id, Plaintext_CSS_Color__c, Background_CSS__c, Link_Element_CSS_Color__c ,
                                          Column_1__r.Column_Content__c, Column_1__r.Raw_Html__c,
                                          Column_2__r.Column_Content__c, Column_2__r.Raw_Html__c,
                                          Column_3__r.Column_Content__c, Column_3__r.Raw_Html__c,
                                          Column_4__r.Column_Content__c, Column_4__r.Raw_Html__c,
                                          Column_5__r.Column_Content__c, Column_5__r.Raw_Html__c,
                                          Column_6__r.Column_Content__c, Column_6__r.Raw_Html__c,
                                          RecordType.Name,
                                          Final_Words__c FROM Community_Footer__c WHERE Id =: footerId
                                          LIMIT 1];
        
        if(footerData.Column_1__r.Raw_Html__c != NULL){
            colStrings.add(footerData.Column_1__r.Raw_Html__c);
        }
        else if(footerData.Column_1__r.Column_Content__c != NULL){
            colStrings.add(footerData.Column_1__r.Column_Content__c);
        }

        if(footerData.Column_2__r.Raw_Html__c != NULL){
            colStrings.add(footerData.Column_2__r.Raw_Html__c);
        }
        else if(footerData.Column_2__r.Column_Content__c != NULL){
            colStrings.add(footerData.Column_2__r.Column_Content__c);
        }
        
        if(footerData.Column_3__r.Raw_Html__c != NULL){
            colStrings.add(footerData.Column_3__r.Raw_Html__c);
        }
        else if(footerData.Column_3__r.Column_Content__c != NULL){
            colStrings.add(footerData.Column_3__r.Column_Content__c);
        }
        
        if(footerData.Column_4__r.Raw_Html__c != NULL){
            colStrings.add(footerData.Column_4__r.Raw_Html__c);
        }
        else if(footerData.Column_4__r.Column_Content__c != NULL){
            colStrings.add(footerData.Column_4__r.Column_Content__c);
        }
        
        if(footerData.Column_5__r.Raw_Html__c != NULL){
            colStrings.add(footerData.Column_5__r.Raw_Html__c);
        }
        else if(footerData.Column_5__r.Column_Content__c != NULL){
            colStrings.add(footerData.Column_5__r.Column_Content__c);
        }
        
        if(footerData.Column_6__r.Raw_Html__c != NULL){
            colStrings.add(footerData.Column_6__r.Raw_Html__c);
        }
        else if(footerData.Column_6__r.Column_Content__c != NULL){
            colStrings.add(footerData.Column_6__r.Column_Content__c);
        }
        
        FooterData retData = new FooterData();
        System.debug('returning');
        retData.colStrings = colorUrls(colStrings, footerData.Link_Element_CSS_Color__c);
        retData.finalWords = footerData.Final_Words__c;
        retData.bgCss = footerData.Background_CSS__c;
        retData.textColor = footerData.Plaintext_CSS_Color__c;
        retData.linkColor = footerData.Link_Element_CSS_Color__c;
        retData.rtName = footerData.RecordType.Name;
        
        String bgCss = footerData.Background_CSS__c;
        if(bgCss != NULL && bgCss.contains('#')){
         	retData.bgPreviewColor = '#'+bgCss.substringBetween('#', ' ');
            bgCss = bgCss.replace(retData.bgPreviewColor, ' ');
            System.debug('css remainder post replace: '+ bgCss);
        }
        if(bgCss != NULL && bgCss.contains('#')){
         	retData.bgPreviewGradient = '#'+bgCss.substringBetween('#', ' ');
        }
        return retData;
    }
    
    public class FooterData{
        @AuraEnabled
        public List<String> colStrings {get;set;}
        @AuraEnabled
        public String finalWords {get;set;}
        @AuraEnabled
        public String bgCss {get;set;}
        @AuraEnabled
        public String textColor {get;set;}
        @AuraEnabled
        public String linkColor {get;set;}
        @AuraEnabled
        public String rtName {get;set;}
        @AuraEnabled
        public String bgPreviewColor {get;set;}
        @AuraEnabled
        public String bgPreviewGradient {get;set;}
    }
    
    public static List<String> colorUrls(List<String> markupList , String textColor){
        for(Integer i = 0; i < markupList.size(); i++){
            System.debug(markupList[i]);
            if(markupList[i] != NULL && markupList[i].contains('<a')){
                System.debug('contains an <a');
                if(markupList[i].subStringBetween('<a','>').containsIgnoreCase('style') == false){
                    System.debug('doing color');
                    markupList[i] = markupList[i].replace('<a', '<a style="color:'+textColor+'" ');
                    System.debug('html now: '+ markupList[i]);
                }
            }
        }
        System.debug('returning: '+ markupList);
        return markupList;
    }
    
    
    
    
    
    
    ///picklist override/extension methods for cmp design file:
    global override VisualEditor.DataRow getDefaultValue(){
        Community_Footer__c defaultFooter = [SELECT Id, Name FROM Community_Footer__c LIMIT 1];
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow(defaultFooter.Name, (String)defaultFooter.Id);
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        List<Community_Footer__c> footers = [SELECT Id, Name FROM Community_Footer__c ORDER BY Name];
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        for(Community_Footer__c f: footers){
        	VisualEditor.DataRow newRow = new VisualEditor.DataRow(f.Name, (String)f.Id); 
            myValues.addRow(newRow);
        }
        return myValues;
    }
    

}