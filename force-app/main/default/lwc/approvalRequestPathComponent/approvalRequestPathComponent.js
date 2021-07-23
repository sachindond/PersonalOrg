/**
 * @ Author: Sachin Dond
 * @ Create Time: 2021-07-20 16:20:43
 * @ Modified by: Sachin Dond
 * @ Modified time: 2021-07-22 13:24:17
 * @ Description:
 * @ User Story:
 */
import { LightningElement, wire, api } from "lwc";
import CASE_STATUS_FIELD from "@salesforce/schema/Case.Status";
import CASE_OBJECT from "@salesforce/schema/Case";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
export default class ApprovalRequestPathComponent extends LightningElement {
  @api currentStatusPicklistValue;
  // Get metadata info of case object
  @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
  caseMetadata;

  // Get Status field picklist values
  @wire(getPicklistValues, {
    recordTypeId: "$caseMetadata.data.defaultRecordTypeId",
    fieldApiName: CASE_STATUS_FIELD
  })
  caseStatusPicklist;
  // Method to handle when path step blur
  handlePathStepBlur() {
    console.log('**** On Blur');
  }
  // Method to handle mouse enter step in blur
  handlePathStepMouseEnter() {
    console.log('**** handlePathStepMouseEnter');
  }
}
