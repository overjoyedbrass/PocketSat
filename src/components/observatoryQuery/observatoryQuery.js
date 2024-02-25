import React from "react";
import { AutoComplete } from "../autoComplete/autoComplete.js";
import { observatories } from "../../data/observatories.js";
import { selectFormState, updateForm } from "../../store/formInput/locationForm.js";
import { useDispatch, useSelector } from "react-redux";


const MAX_ITEMS = 25;

function matchObservatory(query) {
    query = query.toLowerCase();
    const res = observatories.filter((obs) =>
    query.split(" ")
         .map((kw) =>
                // eslint-disable-next-line no-useless-escape
                obs.code.toLowerCase().includes(kw.replace(/[\(\)']+/g,'')) ||
                obs.name.toLowerCase().includes(kw) ||
                obs.region.toLowerCase().includes(kw))
         .every((_) => _))

    return res.length >= MAX_ITEMS ? res.splice(0, MAX_ITEMS) : res
}

export const ObservatoryQuery = ({ children }) => {
    function format(obs) {
        return `${obs.name} (${obs.code})`;
    }
    function formatId(obs) {
        return `obs-${obs.code}`;
    }
    const dispatch = useDispatch();
    const obsName = useSelector(selectFormState).observatoryName;

    function sideEffect(obs) {
        dispatch(updateForm({...obs}));
    }
    return (<AutoComplete placeholder="Observatory name" title="Observation location" getFilteredData={matchObservatory} format={format} formatId={formatId} sideEffect={sideEffect} outsideControl={obsName}>
        { children }
    </AutoComplete>)

}