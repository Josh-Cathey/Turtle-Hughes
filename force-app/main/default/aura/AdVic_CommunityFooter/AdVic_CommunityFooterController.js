({
	init : function(cmp) {

        var action = cmp.get("c.getFooterData");
        action.setParams({footerId:cmp.get("v.footerId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resp = response.getReturnValue();
                console.log(resp);
                if(resp.colStrings)
	                var colCount = resp.colStrings.length;
                cmp.set("v.colCount", colCount);
                cmp.set("v.colData", resp.colStrings);
                cmp.set("v.finalWords", resp.finalWords);
                cmp.set("v.bgCss", resp.bgCss);
                cmp.set("v.textColorCss", resp.textColor);
                cmp.set("v.rtName", resp.rtName);
                cmp.set("v.linkColor", resp.linkColor);
                let element = cmp.getConcreteComponent().getElements()
                console.log(cmp.getConcreteComponent().getElements());
                // console.log(cmp.getConcreteComponent().getElements()[0].get('offsetHeight'));
            }

        });

        $A.enqueueAction(action);
    },
    onClick : function(component, event, helper) {
        var id = event.target.dataset.menuItemId;
        if (id) {
            component.getSuper().navigate(id);
         }
   }
})