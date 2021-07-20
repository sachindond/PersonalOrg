
import { LightningElement,track,api,wire } from 'lwc';
export default class EditAddressInformation extends LightningElement{
    // public properties 
    @api recordId;                              // accountId passed from parent
    @api objectApiName;                         // objectapiname passed from parent
    @api updatedFieldsValueObj;                 // object of updated fields values from parent
    
    // local variables
    obj = {};                                   // temp object to hold the current form field changes
    
    

    handleOnInputFieldChange(event) {
        // copy the api property object into team before modifying as @api property object is read only and we cant modify it 
        this.obj =  Object.assign(this.obj, this.updatedFieldsValueObj);
        // add the current changed field entry in object
        this.obj[event.target.fieldName] = {value:event.target.value};
        const selectedEvent = new CustomEvent("objectvaluechange", {
            detail: this.obj
        });
      // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
    /*
        # Author        : Sachin Dond
        # Usage         : Method to copy address information from previous tabs which is changed 
        # Update History: NA
    */
    handleCopyAddressInformation(event) {
        console.log('**onClickCopyAddressInformationButton',JSON.stringify(this.updatedFieldsValueObj));
        let inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            if(this.updatedFieldsValueObj !== undefined) {
                inputFields.forEach(field => {
                    if(this.updatedFieldsValueObj[field.fieldName])
                        field.value = this.updatedFieldsValueObj[field.fieldName]['value'];
                });
            }
        }
    }
    /*
        # Author        : Sachin Dond
        # Usage         : Method to reset the form value
        # Update History: NA
    */
    handleReset(event) {
        let inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}