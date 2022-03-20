import React, {useState, createContext} from "react";


export type authenticationObj = {
    awwId: number,
    loggedIn: boolean
}

type AuthContextProviderProps = {
    children: React.ReactNode;
}

type UserContextType = {
    auth: authenticationObj|null,
    setAuth: React.Dispatch<React.SetStateAction<authenticationObj | null>>
}


export const AuthContext = createContext<UserContextType | null>(null);


export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [auth, setAuth] = useState<authenticationObj | null>({awwId:0, loggedIn:false});

    return (
        <AuthContext.Provider value={{auth, setAuth}} >
            {children}
        </AuthContext.Provider>
    )
};
