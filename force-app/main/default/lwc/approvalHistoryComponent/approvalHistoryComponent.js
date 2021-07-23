/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-20 18:03:23
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-23 17:10:59
 * @ Description: JS class to get the approval history record from apex
 * @ User Story:
 */
import { LightningElement, wire,api} from "lwc";
import getListOfApprovalHistoryRecords from "@salesforce/apex/ItemForApprovalController.getApprovalHistoryRecords";
import { refreshApex } from '@salesforce/apex';
export default class ApprovalHistoryComponent extends LightningElement {

    wiredApprovalHistoryResult;
    approvalHistoryRecords
    recordCount;
    @api processInstanceId;                  // Approval Process Instance ID received from Parent COmponent         
    @api
    refreshApprovalHistoryRecords() {
        return refreshApex(this.wiredApprovalHistoryResult); 
    }
    
    // Wire To Property : used to get list of approval history records 
    @wire(getListOfApprovalHistoryRecords,{processInstanceId:'$processInstanceId'})
    wiredApprovalHistoryRecords(result){
        this.wiredApprovalHistoryResult = result;
        if(result) {
            this.approvalHistoryRecords = result.data;
            let stringifyString = JSON.stringify(result.data);
        } else if(result.error){
            // TODO : Handle Error
        }
    }

    
}
