({
    toggleAdvanced : function(cmp){
        var showAdvanced = cmp.get("v.showAdvanced");
        if(showAdvanced){
        	cmp.set("v.showAdvanced", false);
        }
        else{
        	cmp.set("v.showAdvanced", true);
        }
    },
    handleSuccess : function(cmp, evt, hlp){
        //refreshes nested component
        cmp.find('notifLib').showToast({
            "variant": "success",
            "title": "Saved",
            "message": "Changes save successfully"
        });
        cmp.set("v.refreshFlag", Date.now());
    },
    getCurrentStyles : function(cmp) {
    	var action = cmp.get("c.getFooterData");
        action.setParams({footerId:cmp.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resp = response.getReturnValue();
                console.log(resp);
           		
                cmp.set("v.backgroundColor", resp.bgPreviewColor);
                
        		cmp.set("v.gradientColor", resp.bgPreviewGradient);
                
                cmp.set("v.Background_CSS__c", resp.bgCss);
                cmp.set("v.Plaintext_CSS_Color__c", resp.textColor);
                cmp.set("v.Link_Element_CSS_Color__c", resp.linkColor);
                cmp.set("v.textColor", resp.textColor);
                cmp.set("v.linkColor", resp.linkColor);
                if(cmp.get("v.gradientColor") == undefined){
                    cmp.set("v.doingGradient",false);
                    cmp.set("v.gradientColor", cmp.get("v.backgroundColor"));
                    //cmp.set("v.backgroundColor", resp.bgCss);
                }
                cmp.set("v.rtName", resp.rtName);
            }
            
        });

        $A.enqueueAction(action);    
    },
	setAttributeFields : function(cmp) {
		console.log('updating preview...');
        var backgroundColor = cmp.get("v.backgroundColor");
        var doingGradient = cmp.get("v.doingGradient");
        var gradientColor = cmp.get("v.gradientColor");
        var textColor = cmp.get("v.textColor");
        var matchTextLinks = cmp.get("v.matchTextLinks");
        var linkColor = cmp.get("v.linkColor");
        var deg = cmp.get("v.deg");
        if(!doingGradient){
            cmp.set("v.gradientColor", backgroundColor);
            cmp.set("v.Background_CSS__c", backgroundColor);
        }
        else{
            //todo set gradient with degrees
            cmp.set("v.Background_CSS__c", 'linear-gradient('+deg+'deg, '+gradientColor+' 0%,'+backgroundColor+' 100%);');
        }
        if(!matchTextLinks){
        	cmp.set("v.linkColor", textColor); 
            linkColor = textColor;
        }
        
        cmp.set("v.Link_Element_CSS_Color__c", linkColor);
        cmp.set("v.Plaintext_CSS_Color__c", textColor);
        
	},
    handleToggles : function(cmp) {
		console.log('handling toggle...');
        var backgroundColor = cmp.get("v.backgroundColor");
        var textColor = cmp.get("v.textColor");
        var gradientColor = cmp.get("v.gradientColor");
        if(!cmp.get("v.doingGradient")){
            cmp.set("v.gradientColor", backgroundColor);
            gradientColor = backgroundColor;
        }
        cmp.set("v.Background_CSS__c", 'linear-gradient('+cmp.get("v.deg")+'deg, '+gradientColor+' 0%,'+backgroundColor+' 100%);');

        if(!cmp.get("v.matchTextLinks")){
            cmp.set("v.linkColor", textColor);
            cmp.set("v.Link_Element_CSS_Color__c", textColor);
        }
	},
})