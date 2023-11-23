import React from "react";
import { AutoComplete } from "../autoComplete/autoComplete.js";
import { observatories } from "../../data/observatories.js";
import { updateForm } from "../../store/formInput/locationForm.js";
import { useDispatch } from "react-redux";


function matchObservatory(query) {
    query = query.toLowerCase();
    return observatories.filter((obs) =>
        query.split(" ")
             .map((kw) =>
                    obs.code.toLowerCase().includes(kw) ||
                    obs.name.toLowerCase().includes(kw) ||
                    obs.region.toLowerCase().includes(kw))
             .every((_) => _));
}

export const ObservatoryQuery = ({ children }) => {
    function format(obs) {
        return `${obs.name} (${obs.code})`;
    }
    const dispatch = useDispatch();
    function sideEffect(obs) {
        dispatch(updateForm({...obs}));
    }
    return (<AutoComplete getFilteredData={matchObservatory} format={format} sideEffect={sideEffect}>
        { children }
    </AutoComplete>)

}