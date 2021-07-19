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


export default class ItemForApproval extends LightningElement {
    @api tableData;
    showModelPopup = false;
    modalHeaderText;
    //actions = [];
    //columnList = columns;
    connectedCallback() {
        const columns = [    
            { label: 'Related To', fieldName: 'RelatedTo', type: 'url' , typeAttributes:{label: { fieldName: 'CaseNumber' }}},
            { label: 'Type', fieldName: 'Type'},
            { label: 'Assign To', fieldName: 'AssignTo'},
            {
                type: 'action',
                typeAttributes: {rowActions: this.getRowActions}
            }
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
                   tempObj.RelatedTo = '/' + record.Id;
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
    }
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
    
    
}