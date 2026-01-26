import React, { useState } from 'react';
const PhoneContext = React.createContext();

export const PhoneValue = props => {
    const [isPhone, setisPhone] = useState(null);
    return (
        <PhoneContext.Provider value={{ isPhone, setisPhone }}>
            {props.children}
        </PhoneContext.Provider>
    )
};

export default PhoneContext;