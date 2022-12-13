/**
 * Created by dimitrisavelieff on 2020-04-14.
 */

({
    init: function(component, event, helper){

        helper.initFieldList(component); //populates the Fields List Array
        component.set("v.recId",component.get("v.recordId")); //We don't want force:recordData to run until after this init runs. Waiting until populating recordID until here will hold on running query until this call
        component.find("recordLoader").reloadRecord(); //runs the lightning data service
    },
    //runs when record is loaded or updated
    handleRecordUpdated: function(component, event, helper) {
        var eventParams = event.getParams();
        if (eventParams.changeType === "LOADED") {
            // record is loaded (render other component which needs record data value)
            helper.assignMapMarkers(component);
        } else if (eventParams.changeType === "CHANGED") {
            // record is changed
            component.find("recordLoader").reloadRecord();
        } else if (eventParams.changeType === "REMOVED") {
            // record is deleted
        } else if (eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving, or deleting the record
        }
    }
})