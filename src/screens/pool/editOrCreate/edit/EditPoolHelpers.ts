import { PDColor } from '~/components/PDTheme';
import { EntryPoolElements } from '../entryPoolValues/EntryPoolHelpers';

export type EditPoolField = EntryPoolElements
    | 'recipe'
    | 'customTargets'
    | 'exportData'
    | 'deletePool';

export interface EditPoolListItem {
    id: EditPoolField;
    value?: string | null;
    label: string;
    image: string;
    onPress: () => void;
    valueColor: PDColor;
}

export interface EditPoolListSection {
    title: string;
    data: EditPoolListItem[];
}

