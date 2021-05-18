import React from 'react';
import { SectionList as RnSectionList, SectionListData, StyleSheet } from 'react-native';

import { PDText } from '../PDText';
import { PDSpacing, PDTheme } from '../PDTheme';
import { PDSectionItemList } from './PDSectionItemList';

// TODO: Use generics to identify the id
export interface PDSectionListItemProps {
    id: string;
    value?: string | null;
    label: string;
    image: string;
    onPress: () => void;
    valueColor: keyof PDTheme;
}

export interface PDSectionListProps {
    title: string;
    data: PDSectionListItemProps[];
}

interface SectionListProps {
    sections: SectionListData<PDSectionListItemProps, PDSectionListProps>[];
}

export const PDSectionList: React.FC<SectionListProps> = (props) => {

    const { sections } = props;


    return (
        <RnSectionList
            sections={ sections }
            renderSectionHeader={ ({ section: { title } }) => (
                <PDText type="bodyBold" color="grey" style={ styles.sectionHeaderText }>
                    {title}
                </PDText>
            ) }
            renderItem={ ({ item, index, section }) => (
                <PDSectionItemList item={ item } index={ index } sectionLength={ section.data.length } />
            ) }
            keyExtractor={ (item, index) => item.id + index }
            stickySectionHeadersEnabled={ false }
            contentContainerStyle={ styles.listContent }
            style={ styles.listContainer }
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    listContent: {
        paddingHorizontal: PDSpacing.md,
    },
    sectionHeaderText: {
        marginBottom: PDSpacing.md,
        marginTop: PDSpacing.lg,
        textTransform: 'uppercase',
    },
});