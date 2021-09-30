export const isSalesForce = baseUrl => !!baseUrl && window.self !== window.top && baseUrl.includes('orce.com');
export const isSalesforceLightning = sfUrl => !!sfUrl && sfUrl.includes('.lightning.force.com');
