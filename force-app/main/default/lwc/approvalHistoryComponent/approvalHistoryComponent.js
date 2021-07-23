/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-20 18:03:23
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-22 15:54:43
 * @ Description: JS class to get the approval history record from apex
 * @ User Story:
 */
import { LightningElement, wire,api} from "lwc";
import getListOfApprovalHistoryRecords from "@salesforce/apex/ItemForApprovalController.getApprovalHistoryRecords";
export default class ApprovalHistoryComponent extends LightningElement {

    @api processInstanceId;                  // Approval Process Instance ID received from Parent COmponent         
    
    // Wire To Property : used to get list of approval history records 
    @wire(getListOfApprovalHistoryRecords,{processInstanceId:'$processInstanceId'})
    approvalHistoryRecords;
}
