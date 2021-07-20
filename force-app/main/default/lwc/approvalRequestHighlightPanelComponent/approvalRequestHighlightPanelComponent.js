/*************************************************************************************
    # Author            : Sachin Dond
    # CreatedDate       : 19 July 2021
    # Purpose           : JS file to show approval detail component
    # Type              : Child Component 
    # Parent Component: approvalRequestDetailComponent
    # Update History    : 
    ****************************************************************************
    Last Modified By     | Last Modified Date   | UserStory     | Changes
    ****************************************************************************
    Sachin Dond          | 19 July              |               | Initial Version
**************************************************************************************/
import { LightningElement,api } from 'lwc';
export default class ApprovalRequestHighlightPanelComponent extends LightningElement {

    @api iconName;
    @api recordId;
    @api objectApiName;
    @api fieldsToDisplay;
    @api caseRecordId;
}