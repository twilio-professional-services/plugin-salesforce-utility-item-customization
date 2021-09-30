
import { isSalesforceLightning } from './salesforce';

export const getOpenCTIScript = sfdcBaseUrl =>
  isSalesforceLightning(sfdcBaseUrl) ? 'lightning/opencti_min.js' : 'interaction.js';
