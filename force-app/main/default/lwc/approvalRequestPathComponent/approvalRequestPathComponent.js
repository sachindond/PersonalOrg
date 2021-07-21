/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-20 16:20:43
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-21 17:46:26
 * @ Description:
 * @ User Story:
 */
import { LightningElement,wire,api} from 'lwc';
import CASE_STATUS_FIELD from '@salesforce/schema/Case.Status';
import CASE_OBJECT from '@salesforce/schema/Case';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
export default class ApprovalRequestPathComponent extends LightningElement {
    
    @api caseStatus;
    @api caseRecordId;
    // get metadata info of case object
    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    caseMetadata;
    
    // Get Status field picklist values 
    @wire(getPicklistValues,{recordTypeId: '$caseMetadata.data.defaultRecordTypeId',fieldApiName: CASE_STATUS_FIELD})
    caseStatusPicklist;

    
    @api 
    refreshValues() {
        
    }


}