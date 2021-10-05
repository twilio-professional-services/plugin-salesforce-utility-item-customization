import React from 'react';
import { FlexPlugin } from 'flex-plugin';
import { getOpenCTIScript } from './helpers/get-crm-script';

import { loadScript } from './helpers/load-script';
import { isSalesForce } from './helpers/salesforce';


const softphonePanelWidthFull = 800;
const softphonePanelWidthHalf = 400;

const PLUGIN_NAME = 'SalesforceAgentDashboardPlugin';




/** 
 * Returns the (hopefully only) call reservation 
 */
function getCurrentVoiceCallReservation(manager) {
  manager.workerClient.reservations.forEach((reservation, sid) => {
    console.debug(reservation.task);
    if (TaskHelper.isCallTask(reservation.task)) {
      return reservation;
    }
  });
}

/*
 * Can't use Custom Console API methods with an Open CTI softphone
 * utility item (keeping this around for reference)
 */
async function disablePopOut() {
  const sfApi = window.sforce.console;
  console.debug(`SalesforceUtilityItemPlugin: Attempting to disable popout...`);

  await sfApi.setCustomConsoleComponentPopoutable(false,
    result => {
      if (result.success) {
        console.debug(`SalesforceUtilityItemPlugin: Disabling popout succeeded`);
      } else {
        console.error('SalesforceUtilityItemPlugin: Error disabling popout');
      }
    });
}



function setSoftphonePanelVisibility(isVisible) {
  const sfApi = window.sforce.opencti;

  sfApi.setSoftphonePanelVisibility({
    visible: isVisible,
    callback: result => {
    }
  });
}

function setSoftphonePanelWidth(width) {
  const sfApi = window.sforce.opencti;

  sfApi.setSoftphonePanelWidth({
    widthPX: width,
    callback: result => {
    }
  });
}



function setSoftphoneItemLabel(label) {
  const sfApi = window.sforce.opencti;

  sfApi.setSoftphoneItemLabel({
    label,
    callback: result => {
    }
  });
}

function showAgentDesktopPanel2(manager) {
  manager.updateConfig({
    componentProps: {
      AgentDesktopView: {
        showPanel2: true
      }
    }
  });
};

function hideAgentDesktopPanel2(manager) {
  manager.updateConfig({
    componentProps: {
      AgentDesktopView: {
        showPanel2: false
      }
    }
  });
};

export default class SalesforceUtilityItemPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /* 
  * Imitates the boilerplate OOTB Salesforce Integration logic to get access to Open CTI API
  * I also augmented this with Console Integration API. When in Rome....
  */
  async initializeSalesforceAPIs() {
      
    const sfdcBaseUrl = window.location.ancestorOrigins[0];

    if (!isSalesForce(sfdcBaseUrl)) {
      // Continue as usual
      console.warn('SalesforceUtilityItemPlugin: Not initializing Salesforce since this instance has been launched independently.');
      return false;
    }

    // Check first. We are not the only SFDC plugin!
    if (!window.sforce) { 
      console.warn('SalesforceUtilityItemPlugin: Salesforce APIs not loaded. Loading Open CTI and Console Integration API...');
      // Open CTI
      const sfOpenCTIScript = getOpenCTIScript(sfdcBaseUrl);
      const sfOpenCTIScriptUrl = `${sfdcBaseUrl}/support/api/44.0/${sfOpenCTIScript}`;
      await loadScript(sfOpenCTIScriptUrl);

      // Console Integration API (not needed yet)
      const sfConsoleAPIScriptUrl = `${sfdcBaseUrl}/support/console/52.0/integration.js`;
      await loadScript(sfConsoleAPIScriptUrl);
    }

    if (!window.sforce) {
      console.error('SalesforceUtilityItemPlugin: Salesforce APIs cannot be found');
      return false;
    } 

    return true;
  }  

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {

    // Make sure SF APIs are accessible, otherwise bail out early
    if (!(await this.initializeSalesforceAPIs())) {
      return;
    }

    // Set visible (could use local storage to remember state)
    setSoftphonePanelVisibility(true);

    // *Try* to disable popout in Utility Bar - using the Console API per this URL:
    // https://trailblazer.salesforce.com/ideaView?id=0873A000000U06TQAS
    // SPOILER: It ain't working, and doesn't seem to be possible for standard 
    // components like the Open CTI Softphone
    await disablePopOut();

    // Let's pretend right hand CRM panel is a stats dashboard that shows when calls are completed
    // and hides when a new call comes in
    flex.CRMContainer
      .Content
      .replace(<div key="pretend-stats-component"><p align="center">IMAGINE THIS IS AN AGENT STATS DASHBOARD :)</p></div>);

    // TODO: Page refreshes can mean we need to recalculate some of the below listener-driven 
    // state based on the initial data we have on existing reservations... Can do this later
    // Focusing on happy path today :) 


    // Various listeners that update the Utility Item label during the lifecycle of a call task
    // and also update the UI size and right hand panel visibility
    // TODO: Update icon too
    manager.workerClient.on('reservationCreated', reservation => {
      setSoftphoneItemLabel('Incoming Call!') 
    });
    flex.Actions.addListener('afterAcceptTask', () => {
      // Resize softphone UI to 50% and hide right panel when call is answered
      setSoftphonePanelWidth(softphonePanelWidthHalf);
      hideAgentDesktopPanel2(manager);
      setSoftphoneItemLabel('Active Call'); 
    });
    manager.voiceClient.on("disconnect", () => {
      // Fires when the call ends - by any party
      setSoftphoneItemLabel('Completed Call'); 
    });
    flex.Actions.addListener('afterCompleteTask', () => {
      // If all tasks are complete, then expand the softphone UI to 100% and 
      // show right hand panel
      const state = manager.store.getState();
      const tasks = state.flex.worker.tasks;

      tasks.forEach(task => {
        if (task.status !== 'completed') {
          console.debug('SalesforceUtilityItemPlugin: Non-completed task!');
          return;
        } 
      });
      console.debug('SalesforceUtilityItemPlugin: All tasks completed!');

      setSoftphonePanelWidth(softphonePanelWidthFull);
      showAgentDesktopPanel2(manager);
      setSoftphoneItemLabel('No calls') 
    });

    
  }




}
