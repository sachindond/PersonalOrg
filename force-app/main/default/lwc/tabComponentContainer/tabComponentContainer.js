/*************************************************************************************
    # Author        : Sachin Dond
    # CreatedDate   : 7 July 2021
    # Purpose       : JS file of tabComponentContainer - control as parent
    # Update History:
    ****************************************************************************
    Last Modified By     | Last Modified Date   | UserStory     | Changes
    ****************************************************************************

**************************************************************************************/

import { LightningElement,track,api,wire } from 'lwc';
import getRelatedAddressesRecords from'@salesforce/apex/TabComponentController.getRelatedAddressesRecords';
export default class TabComponentContainer extends LightningElement {
    // Variables & Properties declaration
    @api recordId;                              // current account id
    @track currentAddressId;                    // currentAddressId
    @track permanentAddressId;                  // permanentAddressId
    @track shippingAddressId;                   // shippingAddressId
    @track billingAddressId;                    // billingAddressId

    updatedFieldValue = {};                     // object to store updated field values 
    activeTab;                                  // get the context of active tab
    /*
        # Author        : Sachin Dond
        # Method Name   : handleActiveTab(Event)
        # Usage         : To handle active tab on click of the tab 
    */
    handleActiveTab(event) {
        this.activeTab = event.target;
        console.log('** on Athis.activeTabctive *',(this.activeTab));
    }
    /*
        # Author        : Sachin Dond
        # Method Name   : wire service
        # Usage         : To get the related address information records form apex 
                        by passwing accountId as paramenter
    */
    @wire(getRelatedAddressesRecords,{accountId:'$recordId'}) 
    wiredAddressRecords({data, error}){
		if(data) {
			console.log('**received Date',(JSON.stringify(data)));
            this.addressRecords = data;
            console.log('Current',this.addressRecords.Current);
            this.currentAddressId = data.Current;
            this.permanentAddressId = data.Permanent;
		}else {
			
		}
	}
    /*
        # Author        : Sachin Dond
        # Usage         : Method to handle child event and get the updated object value also set the icon to tab
    */
    handleObjectValueChange(event) {
            this.updatedFieldValue = event.detail;
            if(this.activeTab) {
                this.activeTab.iconName = "utility:favorite";
            }
    }

}