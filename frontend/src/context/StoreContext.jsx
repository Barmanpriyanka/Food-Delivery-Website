import React, { createContext } from "react"; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const { children } = props;

    const contextValue = {
        food_list
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

StoreContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
