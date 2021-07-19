import {createElement} from 'lwc'
import TabComponentContainer from 'c/tabComponentContainer'
import {registerApexTestWireAdapter} from '@salesforce/sfdx-lwc-jest';
import getRelatedAddressesRecords from'@salesforce/apex/TabComponentController.getRelatedAddressesRecords';

const mockRecordList = require('./data/getRelatedAddressesRecords.json');
const relatedRecordAdapter = registerApexTestWireAdapter(getRelatedAddressesRecords)

describe('Testing tabComponentContainer Component',()=>{
    beforeEach(()=>{
        const element = createElement('c-tab-component-container',{
            is:TabComponentContainer
        })
        document.body.appendChild(element)
    })
    test(' tesst wire service ',()=>{
        const element = document.querySelector('c-tab-component-container');
        relatedRecordAdapter.emit(mockRecordList);
        
    }) 
    
    test(' tesst child component ',()=>{
        const element = document.querySelector('c-tab-component-container');
        const childElement =  element.shadowRoot.querySelectorAll('c-edit-address-information');
        expect(childElement.length).toBe(4);
        const formElement = childElement[0].shadowRoot.querySelector('lightning-record-edit-form');
        const inputField = formElement.shadowRoot.querySelector('.addressInputField');
        inputField.value = 'Test Value';
        inputField.dispatchElement(new CustomEvent('change'))
        
    }) 
})