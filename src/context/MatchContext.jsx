"use client";
import { createContext, useContext, useState } from "react";

const MatchContext = createContext();

export const MatchProvider = ({ children }) => {

    const [matches, setMatches] = useState([]);
    const [shortListed, setShortListed] = useState([]);

    const removeShortListed = (user) => {
        setShortListed((prev) => (prev.filter((u) => u.username !== user.username)));
    }

    const addShortListed = (user) => {
        setShortListed((prev) => ([...prev, user]));
    }

    const resetMatches = () => {
        setMatches([]);
        setShortListed([]);
    }

    return (
        <MatchContext.Provider value={{ matches, setMatches, removeShortListed, addShortListed, shortListed, resetMatches }}>
            {children}
        </MatchContext.Provider>
    );
}

export const useMatch = () => useContext(MatchContext);