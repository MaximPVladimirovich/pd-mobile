import AsyncStorage from '@react-native-community/async-storage';
import { DeviceSettings, RawDeviceSettings } from '~/models/DeviceSettings';

const DEVICE_SETTINGS_KEY = 'pd_device_settings_0';

export class DeviceSettingsService {
    static getDefaultSettings = (): DeviceSettings => {
        return {
            units: 'us',
            night_mode: 'system',
            treatments: {
                concentrations: {},
                units: {},
            },
            scoops: [],
            sub_exp: null,
        };
    };

    static getSettings = async (): Promise<DeviceSettings> => {
        const asString = await AsyncStorage.getItem(DEVICE_SETTINGS_KEY);
        if (!asString) {
            return DeviceSettingsService.getDefaultSettings();
        }
        const rs = JSON.parse(asString) as RawDeviceSettings;

        // fill it in (if necessary)
        const ds = DeviceSettingsService.rawDeviceSettingsToDeviceSettings(rs);

        return ds;
    };

    /************************ 
     * This will "trick" your local app into thinking that the app is unlocked,
     * but won't allow you to actually test the checkout flow in dev.
     * *********************/
    // static getSettings = async (): Promise<DeviceSettings> => {
    //     console.warn('USING TEST PURCHASE OVERRIDE, REVERT BEFORE MERGING');
    //     const asString = await AsyncStorage.getItem(DEVICE_SETTINGS_KEY);
    //     if (!asString) {
    //         const ds = DeviceSettingsService.getDefaultSettings();
    //         ds.sub_exp = (new Date()).getTime() + 30000000;
    //         return ds;
    //     }
    //     const rs = JSON.parse(asString) as RawDeviceSettings;

    //     // fill it in (if necessary)
    //     const ds = DeviceSettingsService.rawDeviceSettingsToDeviceSettings(rs);

    //     ds.sub_exp = (new Date()).getTime() + 30000000;

    //     return ds;
    // }

    static saveSettings = async (settings: DeviceSettings): Promise<void> => {
        const asString = JSON.stringify(settings);
        await AsyncStorage.setItem(DEVICE_SETTINGS_KEY, asString);
    };

    private static rawDeviceSettingsToDeviceSettings = (raw: RawDeviceSettings): DeviceSettings => {
        // Just... be careful here.
        return {
            ...raw,
            scoops: raw.scoops || [],
            treatments: {
                concentrations: raw.treatments.concentrations,
                units: raw.treatments.units || {},
            },
        };
    };
}
