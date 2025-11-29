import { UAParser } from 'ua-parser-js';

export const  getDeviceDetails = () => {
    const parser = new UAParser();
    const result = parser.getResult();

    return {
        browser: result.browser.name || 'Unknown',
        browserVersion: result.browser.version || 'Unknown',
        os: parser.getOS(),
        osVersion: result.os.version || 'Unknown',
        device: result.device.model || 'Unknown',
        deviceType: result.device.type || 'Unknown',
    };
};