/**
 * Created by dimitrisavelieff on 2020-04-15.
 */

({
    assignMapMarkers: function(component) {
        var record = component.get("v.record");
        if(record){
            var mapMarker = {
                title: (component.get('v.title') && record[component.get('v.title')])?record[component.get('v.title')]:record['Name'],
                description: record[component.get('v.desc')],
                icon: 'standard:address',
                value: record['Id'],
                location: {
                    Street: record[component.get('v.street')],
                    City: record[component.get('v.city')],
                    State: record[component.get('v.state')],
                    PostalCode: record[component.get('v.postalCode')],
                    Country: record[component.get('v.country')]
                }
            };
            component.set('v.mapMarkers',[mapMarker]);
        }
    },
    initFieldList: function(component){
        var fieldString = [];
        if(component.get('v.street'))fieldString.push(component.get('v.street'));
        if(component.get('v.city'))fieldString.push(component.get('v.city'));
        if(component.get('v.state'))fieldString.push(component.get('v.state'));
        if(component.get('v.postalCode'))fieldString.push(component.get('v.postalCode'));
        if(component.get('v.country'))fieldString.push(component.get('v.country'));
        if(component.get('v.title'))fieldString.push(component.get('v.title'));
        if(component.get('v.desc'))fieldString.push(component.get('v.desc'));
        fieldString.push('Name');
        fieldString.push('Id');
        component.set("v.fieldsList",fieldString);
    }
});