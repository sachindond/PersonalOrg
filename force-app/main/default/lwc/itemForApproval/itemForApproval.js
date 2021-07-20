/*************************************************************************************
    # Author        : Sachin Dond
    # CreatedDate   : 15 July 2021
    # Purpose       : JS file of Component
    # UserStory     :
    # Update History:
    ****************************************************************************
    LastModifiedBy  | LastModifiedDate  | UserStory    | Changes
    ****************************************************************************
                    |                   |              |    
**************************************************************************************/
import { LightningElement,wire,api } from 'lwc';
import getListOfPendingApprovalRecords from '@salesforce/apex/ItemForApprovalController.getListOfPendingApprovalRecords';
import loggedInUserId from '@salesforce/user/Id';
import {publish, MessageContext} from 'lightning/messageService';
import CONNECTOR_CHANNEL from '@salesforce/messageChannel/connector__c';
export default class ItemForApproval extends LightningElement {
    @api tableData;
    showModelPopup = false;
    modalHeaderText;
    sfdcBaseURL;
    //actions = [];
    //columnList = columns;
    connectedCallback() {
        const columns = [    
            { label: 'Related To', fieldName: 'RelatedTo', type: 'url' , typeAttributes:{label: { fieldName: 'CaseNumber' }}},
            { label: 'Type', fieldName: 'Type'},
            { label: 'Assign To', fieldName: 'AssignTo'}
        ];
        this.columnList = columns;
       //this.tableData =  [{createdDate : "1479944705000" , duplicateWebsite : "www.google.com", websiteLabel:"google", personDetailMatch : true }];
        this.getApprovalRecords();
    }
    getApprovalRecords() {
        getListOfPendingApprovalRecords()
        .then(data => {
            console.log('data',JSON.stringify(data));
            if(data) {
                let tempArray = [];
                data.forEach(record=>{
                   let tempObj = {};
                   tempObj.RelatedTo = this.getEncodedComponentDefUrl(record.ProcessInstance.TargetObjectId);
                   tempObj.CaseNumber = record.ProcessInstance.TargetObject.Name;
                   tempObj.Type =  record.ProcessInstance.TargetObject.Type;
                   tempObj.AssignTo = record.Actor.Name;
                   if(loggedInUserId == record.Actor.Id)
                        tempObj.isActive = false;
                   else 
                        tempObj.isActive = true;
                   tempArray.push(tempObj);
                })
                console.log('**tempArray',tempArray);
                this.tableData = tempArray;
            }
        })
        .catch(error => {
           
        });
    }
    /*
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log('row',event.detail.row);
        console.log('actionName',event.detail.action.name);
        switch (actionName) {
            case 'Approve':
                this.handleApproveAction();
                break;
            case 'RejectReassign':
                this.handleRejectReassignAction();
                break;
            case 'RejectClose':
                this.handleRejectCloseAction();
                
        }
    } */
    /*
    getRowActions(row, doneCallback) {
        console.log('*actions',row);
        console.log('loggedInUserId',loggedInUserId);
        const actions= [];
        actions.push({'label': 'Approve','name': 'Approve'});
        actions.push({'label': 'Reject & Reassign','name': 'RejectReassign','disabled':row.isActive});
        actions.push({'label': 'Reject & Close','name': 'RejectClose','disabled':row.isActive});
        setTimeout(() => {
            doneCallback(actions);
        }, 100);
    }
    */
    /*
        # Author        : Sachin Dond
        # Usage         : Method to return LWC component as 64encoded url to navigate to another lwc wee avoid to create Aura component 
    */
    getEncodedComponentDefUrl(caseRecordId) {
        console.log('*caseRecordId*',caseRecordId);
        let compDefinition = {
            componentDef: "c:approvalRequestDetailComponent",
            attributes: {
                caseRecordId : caseRecordId
            }
        };
        // btoa : convert to base 64 
        let encodedCompDef = btoa(JSON.stringify(compDefinition));
        console.log('**encodedCompDef');
        // return url with encoded
        return "/one/one.app#" + encodedCompDef;
    }
}