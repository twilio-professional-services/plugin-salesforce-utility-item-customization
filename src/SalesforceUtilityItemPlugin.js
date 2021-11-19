import React from 'react';

import { FlexPlugin } from 'flex-plugin';
import MockAgentDashboard from './components/MockAgentDashboard/MockAgentDashboard';
import RefreshSfdcButton from './components/RefreshSfdcButton/RefreshSfdcButton';
import { initializeSalesforceAPIs, disablePopOut, refreshSfdc, setSoftphoneItemIcon, setSoftphoneItemLabel, setSoftphonePanelWidth, setSoftphonePanelVisibility } from './helpers/SalesforcePluginHelper';



const PLUGIN_NAME = 'SalesforceAgentDashboardPlugin';

      
export default class SalesforceUtilityItemPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }


  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    const success = this.initializeSalesforce();
    if (!success) {
      return;
    }

    // Add the Refresh button to the main header to allow SFDC view to be refreshed without a browser 
    // reload
    this.setupRefreshSfdcButton(flex);

    // Let's pretend right hand CRM panel is a stats dashboard that shows when calls are completed
    // and hides when a new call comes in
    this.setupMockAgentDash(flex);

    // Register all our necessary listeners to react to call and task lifecycle events and actions
    this.initializeListeners(flex, manager);

  }

  /**
   * Wrapper to do all of the async parts with SFDC APIs
   */
  initializeSalesforce = async () => {
    // Make sure SF APIs are accessible, otherwise bail out early
    let success = await initializeSalesforceAPIs();
    if (success) {
      // Initialize the default state for the Saleforce softphone via SFDC APIs
      this.initializeSalesforceUtilityApp();
    } 
    return success;
  }


  /**
   * Prepare the SFDC Utility App's initial UI and behaviors using OpenCTI and Console APIs
   */
  async initializeSalesforceUtilityApp() {
    // TODO: Page refreshes can mean we need to recalculate some of the below listener-driven 
    // state based on the initial data we have on existing reservations... Can do this later
    // Focusing on happy path today :)  Initialize things as if no tasks are in progress
    setSoftphonePanelWidth(1000);
    setSoftphoneItemLabel('No calls');
    setSoftphoneItemIcon('call');
    
    // Set visible (could use local storage to remember state)
    setSoftphonePanelVisibility(true);

    // Disable popout in Utility Bar - using the Console API per this URL:
    // https://trailblazer.salesforce.com/ideaView?id=0873A000000U06TQAS
    disablePopOut();
  }
  /**
   * Initialize the various listeners that update the Utility Item label during the lifecycle of a call task
   * and also update the UI size and right hand panel visibility
   */
  initializeListeners(flex, manager) {
    manager.workerClient.on('reservationCreated', reservation => {
      setSoftphoneItemLabel('Incoming Call!');
      setSoftphoneItemIcon('incoming_call');
      // Resize softphone UI to be smaller and hide right panel when call is answered
      setSoftphonePanelWidth(500);
      this.hideAgentDesktopPanel2(manager);
      // Pop open Flex upon the call arriving ;-)
      setSoftphonePanelVisibility(true); 
    });

    flex.Actions.addListener('afterAcceptTask', () => {
      setSoftphoneItemLabel('Active Call'); 
      setSoftphoneItemIcon('unmuted');
      // Protect against refresh during an active call
      this.addPageUnloadDetection();
    });

    flex.Actions.addListener('afterHoldCall', (payload) => {
      // Tweak the icon when call is put on hold
      setSoftphoneItemIcon('pause'); 
    });

    flex.Actions.addListener('afterUnholdCall', (payload) => {
      // Tweak the icon when call is taken off hold
      // Need to redetermine if call was muted or not...
      const connection = manager.voiceClient.activeConnection();
      setSoftphoneItemIcon(connection.isMuted() ? 'muted' : 'unmuted'); 
    });

    flex.Actions.addListener('afterToggleMute', (payload) => {
      const connection = manager.voiceClient.activeConnection();
      // Tweak the icon when call is muted or unmuted
      setSoftphoneItemIcon(connection.isMuted() ? 'muted' : 'unmuted'); 
    });

    manager.voiceClient.on("disconnect", () => {
      console.log
      // Fires when the call ends - by any party
      setSoftphoneItemLabel('Completed Call'); 
      setSoftphoneItemIcon('end_call');
      // We no longer need to intercept/block page refreshes if there's no call
      this.removePageUnloadDetection();
    });

    flex.Actions.addListener('afterCompleteTask', () => {
      // If all tasks are complete, then expand the softphone UI and 
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

      setSoftphonePanelWidth(1000);
      this.showAgentDesktopPanel2(manager);
      setSoftphoneItemLabel('No calls');
      setSoftphoneItemIcon('call');
    });
  }




  showAgentDesktopPanel2(manager) {
    manager.updateConfig({
      componentProps: {
        AgentDesktopView: {
          showPanel2: true
        }
      }
    });
  }

  hideAgentDesktopPanel2(manager) {
    manager.updateConfig({
      componentProps: {
        AgentDesktopView: {
          showPanel2: false
        }
      }
    });
  }

  setupMockAgentDash(flex) {
    flex.CRMContainer
      .Content
      .replace(
        <MockAgentDashboard key="agent-stats" />
    );
  }

  setupRefreshSfdcButton(flex) {
    //Add Refresh SFDC button to Flex main header panel
    flex.MainHeader.Content.add(<RefreshSfdcButton key="refresh-sfdc" handleOnClick={refreshSfdc} />, {
      sortOrder: 0, 
      align: "end"
    });
  }

  addPageUnloadDetection() {
    window.addEventListener('beforeunload', this._beforeUnloadListener);
  }

  removePageUnloadDetection() {
    window.removeEventListener('beforeunload', this._beforeUnloadListener);
  }

  _beforeUnloadListener(e) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = '';
  }

  /** 
   * UNUSED: Returns the (hopefully only) call reservation 
   */
     getCurrentVoiceCallReservation(manager) {
      manager.workerClient.reservations.forEach((reservation, sid) => {
        console.debug(reservation.task);
        if (TaskHelper.isCallTask(reservation.task)) {
          return reservation;
        }
      });
    }
}
