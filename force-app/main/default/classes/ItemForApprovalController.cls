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
public without sharing class ItemForApprovalController {
    // Method returns the list of queue ids where logged in user part of that queue
    public static Set<Id> getQueueIds () {
        Set<Id> setOfQueueIds = new Set<Id>();
        List<GroupMember> listOfGroupMember =  [Select Group.Id From GroupMember Where UserOrGroupId =:UserInfo.getUserId() and Group.Type = 'Queue'];
        if(listOfGroupMember.size() > 0) {
            for(GroupMember memberRecord : listOfGroupMember) {
                setOfQueueIds.add(memberRecord.Group.Id);
            }
        }
        return setOfQueueIds;
    }
    // Method returns list of work item which is pending for approval with user or its queue
    @AuraEnabled
    public static List<ProcessInstanceWorkItem> getListOfPendingApprovalRecords(){
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
    // Method to return list of Approval History Records
    @AuraEnabled(cacheable=true)
    public static List<ApprovalHistoryWrapper> getApprovalHistoryRecords(String processInstanceId) {
        system.debug('**process instance ID'+processInstanceId);
        List<ApprovalHistoryWrapper> listApprovalHistoryWrapper = new List<ApprovalHistoryWrapper>();
        try{
            List<ProcessInstance> listProcessInstanceRecords = [SELECT TargetObjectId,LastActorId,LastActor.Name,
                                            (SELECT Id,CreatedDate,ActorId,OriginalActor.Name,Comments,
                                            ProcessNode.Name,StepStatus, ProcessInstanceId FROM StepsAndWorkitems  Order BY ID DESC)
                                            FROM ProcessInstance WHERE Id=:ProcessInstanceId ORDER BY CreatedDate DESC];
            
            if(listProcessInstanceRecords.size() > 0) {
                for(ProcessInstance instanceObj :listProcessInstanceRecords){
                    for(ProcessInstanceHistory instanceHistoryObj :instanceObj.StepsAndWorkitems) {
                         ApprovalHistoryWrapper wrapperObj = new ApprovalHistoryWrapper();
                         wrapperObj.comments = instanceHistoryObj.Comments;
                         wrapperObj.assignToName = instanceHistoryObj.OriginalActor.Name;
                         //wrapperObj.actualApprovarName = 
                         wrapperObj.processNodeName = instanceHistoryObj.ProcessNode.Name;
                         wrapperObj.status = instanceHistoryObj.StepStatus;
                         if(instanceHistoryObj.StepStatus == 'Started') {
                            wrapperObj.status = 'Submitted';
                            wrapperObj.processNodeName = 'Approval Request Submitted';
                         }
                         wrapperObj.recordId = instanceHistoryObj.Id;
                         wrapperObj.approvalStepDate = instanceHistoryObj.CreatedDate;
                         wrapperObj.actualApprovarName = instanceHistoryObj.OriginalActor.Name;
                         listApprovalHistoryWrapper.add(wrapperObj);
                    }
                }
            }
            system.debug('**listApprovalHistoryWrapper'+listApprovalHistoryWrapper);
            return listApprovalHistoryWrapper;
        } catch(exception ex) {
            system.debug('**Exception Occur'+ex.getMessage());
            return null;
        }
    }
    // Method to get the custom metadata records which have guided steps
    @AuraEnabled(cacheable=true)    
    public static List<Case_Status_Path_Guidance__mdt> getPathGuidanceCustomMetadataRecords(){
        try {
            return [Select Id,MasterLabel,Fields_To_Update__c,Guidance_Text__c,Picklist_Value__c from Case_Status_Path_Guidance__mdt];
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    // Wrapper class to hold values for approval history records
    public class ApprovalHistoryWrapper {
        @AuraEnabled 
        public string comments;
        @AuraEnabled 
        public datetime approvalStepDate;
        @AuraEnabled 
        public string assignToName;
        @AuraEnabled 
        public string actualApprovarName;
        @AuraEnabled 
        public string processNodeName;
        @AuraEnabled 
        public string status;
        @AuraEnabled 
        public string recordId;
    
    }
}
