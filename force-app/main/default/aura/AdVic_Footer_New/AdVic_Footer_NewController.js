({
    handleSuccess : function(component, event, helper) {
        component.find('notifLib').showToast({
            "variant": "success",
            "title": "Community Footer Created",
            "message": "Navigating to new record..."
        });
        
        var newId = event.getParam("id");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": newId,
            "slideDevName": "detail"
        });
        navEvt.fire();
    },
    getRT : function(component, event, helper){
        var action = component.get("c.getRtOption");
        var myPageRef = component.get("v.pageReference");
        action.setParams({ pageRef_RT : myPageRef.state.recordTypeId });

        action.setCallback(this,function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var resp = response.getReturnValue();
                console.log(resp);
                component.set("v.newRecRt", resp);
                if(resp.Name == 'Sitemap'){
                    var fields = ['Name','Final_Words__c'];
                    component.set("v.fields",fields);
                }
            }
            else{
                component.find('notifLib').showToast({
                    "variant": "error",
                    "title": "Error",
                    "message": "There is a problem getting the Record Types."
                });
            }
            component.set("v.showSpinner",false);
        });
        $A.enqueueAction(action); 
    }
})