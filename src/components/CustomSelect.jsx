// Package imports
import Select from 'react-select';

// Image and Style imports
import './CustomSelect.css';

const CustomSelect = (props) => { 
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white': 'black'
        })
    };

    return (
       <Select
            options={props.options}
            onChange={props.setSelected}
            placeholder={props.placeholder}
            className='custom-select-container'
            styles={customStyles}
        /> 
    );
};

export default CustomSelect;
