/*************************************************************************************
    # Author        : Sachin Dond
    # CreatedDate   : 15 July 2021
    # Purpose       : Controller Apex Class 
    # UserStory     :
    # Update History:
    ****************************************************************************
    LastModifiedBy  | LastModifiedDate  | UserStory    | Changes
    ****************************************************************************
                    |                   |              |    
**************************************************************************************/
public with sharing class ItemForApprovalController {
    // Method returns the list of queue ids where logged in user part of that queue
    public static Set<Id> getQueueIds () {
        Set<Id> setOfQueueIds = new Set<Id>();
        List<GroupMember> listOfGroupMember =  [Select  Group.Id From GroupMember Where UserOrGroupId =:UserInfo.getUserId() and Group.Type = 'Queue'];
        for(GroupMember memberRecord : listOfGroupMember) {
            setOfQueueIds.add(memberRecord.Group.Id);
        }
        return setOfQueueIds;
    }
    // Method returns list of work item which is pending for approval with user or its queue
    @AuraEnabled
    public static List<ProcessInstanceWorkItem> getListOfPendingApprovalRecords(){
        system.debug('**lstOfProcessInstanceWorkItem'); 
        try {
            Set<Id> setOfQueueIds = getQueueIds();
            List<ProcessInstanceWorkItem> lstOfProcessInstanceWorkItem = [Select Id,Actor.Name,Actor.Id,ProcessInstanceId,ProcessInstance.TargetObject.Name,
                                                                         ProcessInstance.TargetObject.Type,ProcessInstance.TargetObjectId 
                                                                         From ProcessInstanceWorkItem 
                                                                         Where ProcessInstance.Status = 'Pending' and ( ActorId =:UserInfo.getUserId() or ActorId in:setOfQueueIds)];
           
            system.debug('**lstOfProcessInstanceWorkItem'+lstOfProcessInstanceWorkItem); 
            return lstOfProcessInstanceWorkItem;
        } catch (Exception ex) {
            system.debug('**error'+ex.getMessage());
            return null;
        }
    }
    // Method to update the approval process workitem with status 
    @AuraEnabled 
    public static string updateApprovalRecord(String workItemId, String approvalStatus, string comment, string caseRecordId) {
        system.debug('*workItemId'+workItemId);
        system.debug('*approvalComment'+comment);
        system.debug('*approvalStatus'+approvalStatus);
        system.debug('*workItemId'+caseRecordId);
        try {
            Approval.ProcessWorkitemRequest processWorkItemReqObj = new Approval.ProcessWorkitemRequest();
            processWorkItemReqObj.setComments(comment);
            processWorkItemReqObj.setAction(approvalStatus);
            processWorkItemReqObj.setWorkitemId(workItemId);
            Approval.ProcessResult approvalResult = Approval.process(processWorkItemReqObj);
            system.debug('**JSON.serialize(approvalResult)'+JSON.serialize(approvalResult));
            return JSON.serialize(approvalResult);
        } catch(exception ex) {
            system.debug('**Exception Occur'+ex.getMessage());
            return null;
        }
    }

}
