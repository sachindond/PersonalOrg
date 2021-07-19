import { LightningElement,api,track } from 'lwc';

export default class TabComponent extends LightningElement {
    // variable declaration
    @api recordId;
    @api objectApiName;
    @track accountRecord = {};
    // on Form Load
    handleFormLoad(event) {
        if (this.recordId !== undefined) {
            let record = event.detail.records;
            let fields = record[this.recordId].fields;
            console.log('***fields',fields);
            console.log('***fields object'+fields);
            console.log('*** Object Keys**',Object.keys(fields));
            // Printing object
            for (var key of Object.keys(fields)) {
                console.log(key + " => " + fields[key] + "</br>");
            }
            console.log('First Name-> ' + fields.FirstName.value);
        }
        
    }
    // onChange Input field 
    onChangeInputBox(event) {
        console.log('e.target.value',event.target.value);
    }

}