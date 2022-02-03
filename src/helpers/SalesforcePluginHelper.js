import { getOpenCTIScript } from "./get-crm-script";

import { loadScript } from "./load-script";
import { isSalesForce } from "./salesforce";

/*
 * Imitates the boilerplate OOTB Salesforce Integration logic to get access to Open CTI API
 * I also augmented this with Console Integration API.
 */
export const initializeSalesforceAPIs = async () => {
  const sfdcBaseUrl = window.location.ancestorOrigins[0];

  if (!isSalesForce(sfdcBaseUrl)) {
    // Continue as usual
    console.warn(
      "SalesforceUtilityItemPlugin: Not initializing Salesforce since this instance has been launched independently."
    );
    return false;
  }

  // Check first. We are not the only SFDC plugin!
  if (!window.sforce) {
    console.warn(
      "SalesforceUtilityItemPlugin: Salesforce APIs not loaded. Loading Open CTI and Console Integration API..."
    );
    // Open CTI
    const sfOpenCTIScript = getOpenCTIScript(sfdcBaseUrl);
    const sfOpenCTIScriptUrl = `${sfdcBaseUrl}/support/api/44.0/${sfOpenCTIScript}`;
    await loadScript(sfOpenCTIScriptUrl);

    // Console Integration API (not needed yet)
    const sfConsoleAPIScriptUrl = `${sfdcBaseUrl}/support/console/52.0/integration.js`;
    await loadScript(sfConsoleAPIScriptUrl);
  }

  if (!window.sforce) {
    console.error(
      "SalesforceUtilityItemPlugin: Salesforce APIs cannot be found"
    );
    return false;
  }

  return true;
};

/*
 * Disables the little popout button on Flex utility item tab
 */
export const disablePopOut = () => {
  const sfApi = window.sforce?.console;

  sfApi?.setCustomConsoleComponentPopoutable(false, (result) => {
    if (result.success) {
      console.debug(`SalesforceUtilityItemPlugin: Disabling popout succeeded`);
    } else {
      console.error("SalesforceUtilityItemPlugin: Error disabling popout");
    }
  });
};

/*
 * Refreshes the active SFDC view
 */
export const refreshSfdc = () => {
  const sfApi = window.sforce?.console;
  const refreshCallback = function refreshCallback(result) {
    // Report whether refreshing the tab was successful
    if (result.success === true) {
      console.debug('SalesforceUtilityItemPlugin: Tab refreshed!');
    } else {
      console.warn('SalesforceUtilityItemPlugin: Tab did not refresh', result);
    }
  };
  sfApi?.getFocusedPrimaryTabId((result) => {
    if (result.id && result.id !== 'null') {
      const { id } = result;
      console.debug(`SalesforceUtilityItemPlugin: Primary Tab ID: ${id}`);
      sfApi?.refreshPrimaryTabById(id, true, refreshCallback, true);
    } else {
      console.debug(`SalesforceUtilityItemPlugin: No primary tab found, so refreshing navigation tab instead`);
      sfApi?.refreshNavigationTab(refreshCallback);
    }
  });
  
};

export const setSoftphonePanelVisibility = (isVisible) => {
  const sfApi = window.sforce?.opencti;

  sfApi?.setSoftphonePanelVisibility({
    visible: isVisible,
    callback: (result) => {},
  });
};

export const setSoftphonePanelWidth = (width) => {
  const sfApi = window.sforce?.opencti;

  sfApi?.setSoftphonePanelWidth({
    widthPX: width,
    callback: (result) => {},
  });
};

export const setSoftphoneItemLabel = (label) => {
  const sfApi = window.sforce?.opencti;

  sfApi?.setSoftphoneItemLabel({
    label,
    callback: (result) => {},
  });
};

export const setSoftphoneItemIcon = (icon) => {
  const sfApi = window.sforce?.opencti;

  sfApi?.setSoftphoneItemIcon({
    key: icon,
    callback: (result) => {},
  });
};
