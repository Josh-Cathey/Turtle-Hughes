import { LightningElement,wire,track} from 'lwc';
import fetchUserDetail from '@salesforce/apex/headerComponentController.fetchUserDetail';
import TURTLE_LOGO from '@salesforce/resourceUrl/turtleLogo';
import basePath from "@salesforce/community/basePath";
import guestCartDetails from '@salesforce/apex/headerComponentController.guestCartDetails'; 

export default class HeaderComponent extends LightningElement {
logo = TURTLE_LOGO;
showShoppingItem=true;
showGuestCart=false;
isGuest=false;
    //Properties
    userData
    @track profileImg   
    @track userName
    @track userFirstName
    @track logoutUrl

// @wire(fetchUserDetail)
//     wiredUser({ error, data }) {
//         if (data) {
//             this.userData = data;
//             console.log('data>>>',data);
//             console.log('img >>>',this.userData.MediumPhotoUrl);
//             if(this.userData.Name!='Turtle and Hughes Site Guest User'){
//             this.profileImg = this.userData.MediumPhotoUrl;
//             this.userName = this.userData.Name;
//             let userFullName = this.userName;
//             this.userFirstName = userFullName.split(' ')[0];
//             this.isGuest = false;
//         }else{
//             this.isGuest = true;
//             guestCartDetails({nameGuestCart:this.userData.Name}).then(result=>{
//                 console.log(result);
//             }).catch(error=>{
//                 console.log(error);
//             })
//         }

//         } else if (error) {
//             this.isGuest = true;
//             this.error = error;
//             console.log('erroeeee>>>',error);
//             console.log('session Id'+storage);
//         }
//     }
    
    connectedCallback(){
        fetchUserDetail().then(data=>{
            if (data) {
                this.userData = data;
                console.log('data>>>',data);
                console.log('img >>>',this.userData.MediumPhotoUrl);
                if(this.userData.Name!='Turtle and Hughes Site Guest User'){
                this.profileImg = this.userData.MediumPhotoUrl;
                this.userName = this.userData.Name;
                let userFullName = this.userName;
                this.userFirstName = userFullName.split(' ')[0];
                this.isGuest = false;
            }else{
                this.isGuest = true;
                guestCartDetails({nameGuestCart:this.userData.Name}).then(result=>{
                    console.log(result);
                }).catch(error=>{
                    console.log(error);
                })
            }
    
            
            }
        }).catch(error=> {
            this.isGuest = true;
            this.error = error;
            console.log('erroeeee>>>',error);
            console.log('session Id'+storage);
        })
        }
    loginLink() {
        return window.open('/login','_self');
    }
    guestCart(){
        console.log('guestCart');
        this.showGuestCart = true;
        guestCartDetails().then(result=>{
            console.log(result);
        }).catch(error=>{
            console.log(error);
        })
    }
    userCart(){
        console.log('userCart');
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.showGuestCart = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.showGuestCart = false;
    }
}