/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-20 16:20:43
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-23 14:00:47
 * @ Description:
 * @ User Story:
 */
import { LightningElement, wire, api } from "lwc";
import CASE_STATUS_FIELD from "@salesforce/schema/Case.Status";
import CASE_OBJECT from "@salesforce/schema/Case";
import { getObjectInfo,getPicklistValues } from "lightning/uiObjectInfoApi";
export default class ApprovalRequestPathComponent extends LightningElement {
  
  @api currentStatusPicklistValue;
  
  // Wire to Property : To get the metadata information of the case object
  @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
  caseMetadata;

  // Wire to Property : To get the picklist value for default record type
  @wire(getPicklistValues, {
    recordTypeId: "$caseMetadata.data.defaultRecordTypeId",
    fieldApiName: CASE_STATUS_FIELD
  })
  caseStatusPicklist;
  // Method to handle when path step blur
  handlePathStepBlur(event) {}
  // Method to handle mouse enter step in blur
  handlePathStepMouseEnter(event) {
    // let stepIndex = event.detail.index;
    // console.log('**index',stepIndex);
    // let stepsElement = this.template.querySelectorAll('lightning-progress-step');
    // if(stepsElement) {
      
    //   stepsElement[stepIndex].classList.add('slds-is-active');
    // }
    // console.log('** list of all elements ',stepsElement[1].className);
    // stepsElement[1].classList.add('slds-is-active');
    // this.template.querySelector('.yesBtn').classList.add('dynamicCSS'); 
    // console.log('after added ',stepsElement[1].className);

  }
}
