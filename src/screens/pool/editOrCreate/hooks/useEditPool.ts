import { useLoadRecipeHook } from '~/hooks/RealmPoolHook';
import { Pool } from '~/models/Pool';
import { getDisplayForWallType } from '~/models/Pool/WallType';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useTypedSelector } from '~/redux/AppState';
import { EditPoolField, EditPoolListSection } from '~/screens/pool/editOrCreate/edit/EditPoolHelpers';
import { ExportService } from '~/services/ExportService';
import { RecipeService } from '~/services/RecipeService';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';

import { useNavigation } from '@react-navigation/native';

import { toPool } from '../shared';
import { EntryPoolHelpers } from '../entryPoolValues/EntryPoolHelpers';

export type MenuItemId =
    | 'name'
    | 'waterType'
    | 'gallons'
    | 'wallType'
    | 'recipe'
    | 'customTargets'
    | 'export'
    | 'delete';

export const useEditPool = (pool: Partial<Pool>, toggleVisible: () => void): EditPoolListSection[] => {
    const deviceSettings = useTypedSelector((state) => state.deviceSettings);
    const recipe = useLoadRecipeHook(pool?.recipeKey ?? RecipeService.defaultFormulaKey);
    const navigation = useNavigation<PDStackNavigationProps>();

    const numberOfTargetLevels = recipe?.custom.length ?? 0;

    const handleNavigateToPopover = (id: EditPoolField) => {
        const headerInfo = EntryPoolHelpers.entryHeaderInfo[id];
        navigation.navigate('EditPoolModal', { headerInfo });
    };

    const handleNavigateToFormulaListScreen = () => {
        navigation.navigate('FormulaList', { prevScreen: 'EditOrCreatePoolScreen', poolName: pool?.name });
    };

    const handleNavigateToCustomTargets = () => {
        navigation.navigate('CustomTargets', { prevScreen: 'EditPoolNavigator' });
    };

    const handleExportButtonPressed = async () => {
        const validatedPool = toPool(pool);
        if (!validatedPool) { return; }
        try {
            await ExportService.generateAndShareCSV(validatedPool);
        } catch (e) {
            console.warn(e);
        }
    };

    const handleDeletePressed = () => {
        toggleVisible();
    };

    return [
        {
            title: 'basic',
            data: [
                {
                    id: 'name',
                    label: 'Name: ',
                    image: 'IconPoolName',
                    value: pool.name,
                    valueColor: 'blue',
                    onPress: () => handleNavigateToPopover('name'),
                },
                {
                    id: 'gallons',
                    label: 'Volume: ',
                    image: 'IconPoolVolume',
                    value: VolumeUnitsUtil.getDisplayVolume(pool.gallons ?? 0, deviceSettings),
                    valueColor: 'pink',
                    onPress: () => handleNavigateToPopover('gallons'),
                },
                {
                    id: 'waterType',
                    label: 'Water Type: ',
                    image: 'IconPoolWaterType',
                    value: getDisplayForWaterType(pool.waterType ?? 'chlorine'),
                    valueColor: 'green',
                    onPress: () => handleNavigateToPopover('waterType'),
                },
                {
                    id: 'wallType',
                    label: 'Wall Type: ',
                    image: 'IconPoolWallType',
                    value: getDisplayForWallType(pool.wallType ?? 'plaster'),
                    valueColor: 'purple',
                    onPress: () => handleNavigateToPopover('wallType'),
                },
            ],
        },
        {
            title: 'advanced',
            data: [
                {
                    id: 'recipe',
                    label: 'Formula: ',
                    image: 'IconPoolFormula',
                    value: recipe?.name,
                    valueColor: 'orange',
                    onPress: handleNavigateToFormulaListScreen,
                },
                {
                    id: 'customTargets',
                    label: 'Target Levels: ',
                    image: 'IconCustomTargets',
                    value: `${numberOfTargetLevels} options`,
                    valueColor: 'teal',
                    onPress: handleNavigateToCustomTargets,
                },
            ],
        },
        {
            title: 'optional',
            data: [
                {
                    id: 'email',
                    label: 'Email: ',
                    image: 'IconPoolEmail',
                    value: pool?.email,
                    valueColor: 'green',
                    onPress: () => handleNavigateToPopover('email'),
                },
            ],
        },
        {
            title: 'actions',
            data: [
                {
                    id: 'exportData',
                    label: 'Export Data',
                    image: 'IconExportData',
                    valueColor: 'red',
                    onPress: handleExportButtonPressed,
                },
                {
                    id: 'deletePool',
                    label: 'Delete Pool',
                    image: 'IconDelete',
                    valueColor: 'red',
                    onPress: handleDeletePressed,
                },
            ],
        },
    ];
};
