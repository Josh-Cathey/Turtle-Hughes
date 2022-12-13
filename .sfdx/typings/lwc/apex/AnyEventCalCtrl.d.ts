declare module "@salesforce/apex/AnyEventCalCtrl.getEvents" {
  export default function getEvents(param: {sObjectName: any, titleField: any, startDateTimeField: any, endDateTimeField: any, descriptionField: any, userField: any, filterByUserField: any}): Promise<any>;
}
declare module "@salesforce/apex/AnyEventCalCtrl.upsertEvents" {
  export default function upsertEvents(param: {sEventObj: any, sObjectName: any, titleField: any, startDateTimeField: any, endDateTimeField: any, descriptionField: any, userField: any}): Promise<any>;
}
declare module "@salesforce/apex/AnyEventCalCtrl.deleteEvent" {
  export default function deleteEvent(param: {eventId: any, sObjectName: any, titleField: any, startDateTimeField: any, endDateTimeField: any, descriptionField: any, userField: any}): Promise<any>;
}
