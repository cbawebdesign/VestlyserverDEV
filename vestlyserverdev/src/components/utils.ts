import _ from 'lodash';
import { compareVersions } from 'compare-versions';
import CONFIG from '../../config';

/**
 * Normalizes client device information
 */

function getClientDeviceInfo(
  userId: string | null,
  vestlyVersion: string | string[] | undefined,
  appVersion: string | string[] | undefined,
  deviceBrand: string | string[] | undefined,
  deviceId: string | string[] | undefined
) {
  if (!_.isString(vestlyVersion)) {
    console.info(
      {
        errorType: 'app-getClientDeviceInfo',
        vestlyVersion: vestlyVersion,
        appVersion,
        deviceBrand,
        deviceId,
        userId: userId,
      },
      'Vestly version provided is not a string'
    );
    return {
      appVersion: null,
      deviceBrand: null,
      deviceId: null,
      version: null,
      latestVersion: null,
      isLatestVersion: false,
    };
  }

  if (!_.isString(appVersion)) {
    console.warn(
      {
        errorType: 'app-getClientDeviceInfo',
        vestlyVersion: vestlyVersion,
        appVersion,
        deviceBrand,
        deviceId,
        userId: userId,
      },
      'version provided is not a string'
    );
    return {
      appVersion: null,
      deviceBrand: null,
      deviceId: null,
      version: null,
      latestVersion: null,
      isLatestVersion: false,
    };
  }

  let latestVersion;

  if (deviceBrand && deviceId) {
    latestVersion = CONFIG.client.ios.version;
  }

  const compareResult = compareVersions(vestlyVersion, latestVersion as string);

  if (compareResult === 1 || compareResult === 0) {
    return {
      appVersion,
      deviceBrand,
      deviceId,
      version: vestlyVersion,
      latestVersion,
      isLatestVersion: true,
    };
  }

  // compareResult === -1
  return {
    appVersion,
    deviceBrand,
    deviceId,
    version: vestlyVersion,
    latestVersion,
    isLatestVersion: false,
  };
}

/**
 * Converts each key in an object to camel case
 * @param {object} obj - the object
 * @returns {object} - the object in camel case
 */
function objectKeysToCamelCase(obj: any) {
  const camelCaseObject = {};
  _.each(obj, function (value, key) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = objectKeysToCamelCase(value);
    }

    (camelCaseObject as any)[_.camelCase(key)] = value;
  });
  return camelCaseObject;
}

export default { getClientDeviceInfo, objectKeysToCamelCase };
