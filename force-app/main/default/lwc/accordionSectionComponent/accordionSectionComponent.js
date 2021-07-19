import { LightningElement } from 'lwc';

export default class AccordionSectionComponent extends LightningElement {
    activeSectionMessage = '';

    handleToggleSection(event) {
        this.activeSectionMessage =
            'Open section name:  ' + event.detail.openSections;
    }

    handleSetActiveSectionC() {
        const accordion = this.template.querySelector('.example-accordion');

        accordion.activeSectionName = 'C';
    }
    renderedCallback() {
        const style = document.createElement('style');
        style.innerText = 'c-accordion-section-component .slds-accordion__summary-action {background-color: blue;}';
        this.template.querySelector('lightning-accordion-section').appendChild(style);
        //const getAccordianElement  = this.template.querySelector('lightning-accordion');
        //if(getAccordianElement)
         //   console.log('** Count of Accordion Sections',this.getAccordianElement.length);
    }

}