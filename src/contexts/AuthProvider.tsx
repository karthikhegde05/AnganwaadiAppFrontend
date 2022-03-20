import React, {useState, createContext} from "react";




export const AuthContext = createContext({awwId, authenticated});


export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({authenticated:false});

    return (
        <AuthContext.Provider value={{auth, setAuth}} >
            {children}
        </AuthContext.Provider>
    )
};
