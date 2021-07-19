/********************************************************************************************************
 * Created By : Sachin Dond
 * Date 1 July 2021
 * Purpose : Javascript file for LWC to get the picklist values based on record types and create searchable picklist
 * Update History : None
 *******************************************************************************************************/

import { LightningElement,wire,track,api } from 'lwc';
import PICKLIST_VALUES from '@salesforce/schema/Support_Request__c.RecordTypeId';    // import schema to get field
import { getRecord } from 'lightning/uiRecordApi';    // get a current record based on recordId
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';  // objectinfoapi to get picklist values based on recordtypeId
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';
const delay = 350;
export default class CreateSupportRequest extends LightningElement {
    //Property Declaration
    @track searchKey = '';
    @api recordId;
    @track recordTypeId;
    @track optionsToDisplay;
    returnOptions = [];
    delaytimeout;
    // wired property to get the current record and the list of fields
    @wire(getRecord, { recordId: '$recordId', fields: [PICKLIST_VALUES] })
    wiredRecords({error,data}) {
        if (data) {
            console.log('**Data',data);
            console.log('**Fields',data.fields);
            console.log('data.recordTypeInfo ',data.recordTypeInfo.name);
            console.log('***Current Record Type ID',data.fields.RecordTypeId.value);
            this.recordTypeId = data.fields.RecordTypeId.value;
        }
    }
    @wire(getPicklistValuesByRecordType, { objectApiName: 'Support_Request__c', recordTypeId: '$recordTypeId'}) 
    requestTypePicklistValues({error, data}) {
        if(data) {
            console.log('****Picklist Values',data.picklistFieldValues.Request_Type__c.values);
            // iterator over the picklist values and create a option array 
            if(data.picklistFieldValues.Request_Type__c.values){
                data.picklistFieldValues.Request_Type__c.values.forEach(eachValue =>{
                    // add isVisible attribute to conditinally render the badge
                if(eachValue.value== 'Desktop' || eachValue.value == 'Pen Drive' || eachValue.value== 'Installation' || eachValue.value== 'Admin')
                    this.returnOptions.push({label:eachValue.label , value:eachValue.value, isVisible:true});
                else {
                    this.returnOptions.push({label:eachValue.label , value:eachValue.value, isVisible:false});
                }
                }); 
            }
            console.log('**return options',this.returnOptions);

        }
        else if(error) {
            window.console.log('error =====> '+JSON.stringify(error));
        }
    }
    // handle key up function
    handleKeyUp(event) {
        console.log('**Event.Target.Value',event.target.value);
        this.searchKey = event.target.value;
        this.template.querySelector('.picklistDiv').classList.remove('slds-hide');
        if (this.delaytimeout) {
            window.clearTimeout(this.delaytimeout);
        }

        this.delaytimeout = setTimeout(() => {
            //filter dropdown list based on search key parameter
            this.filterDropdownList(this.searchKey);
        }, delay);

    }
     //Method to filter dropdown list
     filterDropdownList(key) {
         // Filter an array with search key all match
         console.log('**this.options',this.returnOptions);
        const filteredOptions = this.returnOptions.filter(item => item.label.toLowerCase().includes(key.toLowerCase()));
        console.log('**filterOption',filteredOptions);
        this.optionsToDisplay = filteredOptions;
        console.log('***ist to display',this.optionsToDisplay);
    }
    // get the selected option 
    handleOptionSelect(event) {
        console.log('DataSet',event.currentTarget.dataset);
        const selectedPicklistValue = event.currentTarget.dataset.label;
        console.log('***Selected Picklist Value',selectedPicklistValue);
        this.searchKey = event.currentTarget.dataset.value;
        this.template.querySelector('.picklistDiv').classList.add('slds-hide');
    }
}