import { LightningElement,api,track } from 'lwc';

export default class ShowAddressInformation extends LightningElement {
    @api recordId;
    @api objectApiName;
    isShowRecordViewForm;
    message='';
    connectedCallback() {
        console.log('');
        if (this.recordId !== undefined) {
            this.isShowRecordViewForm = true;
        } else {
            this.isShowRecordViewForm = false;
            this.message = 'Address Information Not Found';
        }
    }
}