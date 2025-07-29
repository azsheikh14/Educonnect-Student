import { CSSObject } from '@emotion/react';

export const customSelectStyles = {
    control: (provided: CSSObject) => ({
        ...provided,
        padding: '0',
        height: '45px',
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '0.75rem',
        boxShadow: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            borderColor: '#E5E7EB',
        },
    }),
    valueContainer: (provided: CSSObject) => ({
        ...provided,
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
    }),
    input: (provided: CSSObject) => ({
        ...provided,
        margin: '0',
    }),
    placeholder: (provided: CSSObject) => ({
        ...provided,
        margin: '0',
        lineHeight: '45px',
    }),
    dropdownIndicator: (provided: CSSObject) => ({
        ...provided,
        padding: '0',
        paddingRight: '10px',
        paddingLeft: '10px',
    }),
    indicatorsContainer: (provided: CSSObject) => ({
        ...provided,
        padding: '0',
    }),
    menu: (provided: CSSObject) => ({
        ...provided,
        zIndex: 100,
    }),
    option: (provided: CSSObject, state: { isFocused: boolean }) => ({
        ...provided,
        cursor: 'pointer',
        backgroundColor: state.isFocused ? '#E5E7EB' : provided.backgroundColor,
        color: state.isFocused ? '#000' : provided.color,
    }),
};
