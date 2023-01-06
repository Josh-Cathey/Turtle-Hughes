/*
Ad Victoriam Solutions -
Purpose: Storefront Header
Changelog:
    22 Jul 2022 by seth.ortiz
        - Created initial file.
*/
import Id from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import communityBasePath from '@salesforce/community/basePath';
import { LightningElement, api, wire,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFld from '@salesforce/schema/User.Name';
import FirstNameFld from '@salesforce/schema/User.FirstName';
import userEmailFld from '@salesforce/schema/User.Email';
import userIsActiveFld from '@salesforce/schema/User.IsActive';
import userAliasFld from '@salesforce/schema/User.Alias';
import getGuestCartItems from '@salesforce/apex/AdVic_GuestCartController.getGuestCartItems';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";

export default class adVicStorefrontHeader extends NavigationMixin(LightningElement) {

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                SAMPLEMC,
                (message) => this.updateNumberOfItems(),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    
    @wire(MessageContext)
    messageContext;


    @track cart;
    cmsContentContainer = {};
    contentToInitialize = [];
    nameByContentReferenceId = new Map();
    guestUser = isGuest;
    isLoading;
    @track badgeNumber = 0 ;
    listOfGuestCartItems=[];
    
    
   

    get welcomeGreeting() {
        return (this.currentUserFirstName ? 'Welcome, '   : 'Welcome');
    }

    get userFirstName() {
        return (this.currentUserFirstName ? this.currentUserFirstName  : '');
    }

    handleNavigationClick(event){
        this.navigateToCommPage(event.currentTarget.dataset.navid);
    }

    handleExternalLinkClick(event){
        this.navigateToExternalPage(event.currentTarget.dataset.navid);
    }

    navigateToCommPage(apiName) {
        // console.log('navigating to page: ', apiName);
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                name: apiName
            }
        });
    }

    navigateToExternalPage(url) {
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: url
            }
        };
        this[NavigationMixin.Navigate](config);
    }

    userId = Id;
    currentUserName;
    currentUserEmailId;
    currentIsActive;
    currentUserAlias;
    currentUserFirstName;
    error;
    _providedItems;
    
    /*
     * Get User Record to map data to LWC
     */
    @wire(getRecord, { recordId: '$userId', fields: [UserNameFld, FirstNameFld, userEmailFld, userIsActiveFld, userAliasFld ]})
    userDetails({error, data}) {
        if (data) {
            // console.log(JSON.stringify(data, null, 4));
            this.currentUserFirstName = data.fields.FirstName.value;
            this.currentUserName = data.fields.Name.value;
            this.currentUserEmailId = data.fields.Email.value;
            this.currentIsActive = data.fields.IsActive.value;
            this.currentUserAlias = data.fields.Alias.value;
        } else if (error) {
            this.error = error;
        }
    }
    // Changes Made By Daniel 
    /*connectedCallback() {
        getGuestCartItems({guestCartId:this.recordId}).then(result=>{
            console.log('result got>>'+JSON.stringify(result));
            this.listOfGuestCartItems = result;
            if(this.listOfGuestCartItems.length == 0){
                this.badgeNumber = 0;
            }else{
                this.badgeNumber = this.listOfGuestCartItems.length;
            }
            console.log(this.badgeNumber);
        }).catch(error=>{
            console.log(error);
        })
    }*/
    cart;
    connectedCallback() {
        this.subscribeToMessageChannel();

        this.template.addEventListener('guestaddtocart', this.updateNumberOfItems());

        console.log('It is a guest'+this.guestUser);
        console.log('(this.cart == null) = ' + (this.cart == null));
        console.log('this.cart = ' + this.cart);
        this.cart = this.getCartFromLocalStorage();
        if (this.cart != null) {
            var newVar = JSON.parse(JSON.stringify(this.cart));
            console.log('Gcart 0.1 == ',newVar.cart.Id);
             console.log('Gcart == ',JSON.parse(JSON.stringify(this.cart)));
             console.log('Gcart 1 == ',this.cart);
             getGuestCartItems({guestCartId:newVar.cart.Id}).then(result=>{
                console.log('result got>>'+JSON.stringify(result));
                this.listOfGuestCartItems = result;
                if(this.listOfGuestCartItems.length == 0){
                    this.badgeNumber = 0;
                }else{
                    this.badgeNumber = this.listOfGuestCartItems.length;
                   
                }
                console.log(this.badgeNumber);
            }).catch(error=>{
                console.log(error);
            })
            console.log('Inside connectedCallback');
            console.log('this.cart = ');
            console.log(this.cart);
        }else{

        }

        // console.log('productDetailsDisplay.js: this.recordId = ' + this.recordId);
        //this.recordId = this.recordId != null ? this.recordId : '01t7c00000748qsAAA'; // recordId is currently returning as undefined...
        
    }
    setCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    getCartFromLocalStorage() {
        // console.log('called getCartFromLocalStorage()');
        console.log('Reading cart in local storage');
        console.log(JSON.parse(localStorage.getItem('cart')));
        this.cart = JSON.parse(localStorage.getItem('cart'));
        return this.cart;
    }
    guestCart()
    {
          this.cart=this.getCartFromLocalStorage();
        var newVar = JSON.parse(JSON.stringify(this.cart));
      
        console.log('cart',this.cart,'newVar',newVar);
    //    window.location.replace('https://turtlehughes--uat.sandbox.my.site.com/s/guest-cart/a3T7c000000Ua4UEAS/sfdevjc');
        // return window.location.href('https://turtlehughes--uat.sandbox.my.site.com/s/guest-cart/a3T7c000000Ua4UEAS/sfdevjc');
    return window.open('https://turtlehughes--uat.sandbox.my.site.com/s/guest-cart/'+newVar.cart.Id+'/'+newVar.cart.Name,'_self');
    }

    updateNumberOfItems(){
        this.cart=this.getCartFromLocalStorage();
        if (this.cart != null) {
            var newVar = JSON.parse(JSON.stringify(this.cart));
            console.log('Gcart 0.1 == ', newVar.cart.Id);
            console.log('Gcart == ', JSON.parse(JSON.stringify(this.cart)));
            console.log('Gcart 1 == ', this.cart);
            getGuestCartItems({guestCartId: newVar.cart.Id}).then(result => {
                console.log('result got>>' + JSON.stringify(result));
                this.listOfGuestCartItems = result;
                if (this.listOfGuestCartItems.length == 0) {
                    this.badgeNumber = 0;
                } else {
                    this.badgeNumber = this.listOfGuestCartItems.length;

                }
                console.log(this.badgeNumber);
            }).catch(error => {
                console.log(error);
            });
        }
    }

    
}