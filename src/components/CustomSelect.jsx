// Package imports
import Select from 'react-select';

const CustomSelect = (props) => { 
    return (
       <Select
            options={props.options}
            onChange={props.setSelected}
        /> 
    );
};

export default CustomSelect;
