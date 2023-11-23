import React from "react";
import { Box, Divider, FormControl, FormLabel, HStack, Input, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { selectFormState } from "../../store/formInput/locationForm";

const AutoCompleteCard = ({children, onClick}) => {
    return (<Box 
        className="autocomplete-card" 
        cursor="pointer" 
        w="100%" p={1} 
        onClick={onClick}>
        {children}
    </Box>)
}

export const AutoComplete = ({ children, getFilteredData, format, minQueryLength=2, sideEffect=null }) => {
    const [focused, setFocused] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [childrenFocus, setChildrenFocus] = React.useState(false);
    const obsName = useSelector(selectFormState).observatoryName;

    const onFocus = () => {
        window.scrollTo({
            top: searchInput.current.offsetTop,
            behavior: "smooth"
        });
        setFocused(true);
    }
    const onBlur = () => {
        if(!childrenFocus) {
            setFocused(false);
        }
    }
    function applyItem(obs) {
        setQuery(obs.name);
        setChildrenFocus(false);
        setFocused(false);
        if(sideEffect) {
            sideEffect(obs);
        }
    }

    function handleObsQuery({ target: { value } }) {
        setQuery(value);
    }

    React.useEffect(() => {
        setQuery(obsName);
    }, [obsName]);
    
    let filteredData;
    const searchInput = React.useRef(null);
    if (query.length >= minQueryLength) {
        filteredData = getFilteredData(query);
    }

    return (<FormControl position="relative" onFocus={onFocus} onBlur={onBlur}>
    <FormLabel>Observation location</FormLabel>
    <HStack>
        <Input
            variant="filled"
            placeholder="Observatory name"
            value={query}
            onChange={handleObsQuery}
            ref={searchInput}
        />
        { children }
    </HStack>
    {!focused || query.length < minQueryLength || query === "Custom" || (
        <VStack mt={1} className="autocomplete" align="flex-start" divider={<Divider />} maxH="250px"
            overflow="auto" border="2px solid rgba(255, 255, 255, 0.5)" borderRadius="5px" bg="black"
            w="100%" p={2} position="absolute" zIndex={100}
            onFocus={onFocus} onBlur={onBlur}
            onMouseEnter={() => {try{setChildrenFocus(true)}catch{}}}
            onMouseLeave={() => {try{setChildrenFocus(false)}catch{}}}
            >
            {filteredData?.map((item) => (
                <AutoCompleteCard
                    key={`obs-${item.code}`}
                    onClick={() => applyItem(item)}
                    children={format(item)}
                    setChildrenFocus={setChildrenFocus}
                />
            ))}
            {filteredData?.length === 0  ? (
                <AutoCompleteCard className="autocomplete-card" children={"No Matches"} />
            ) : null}
        </VStack>
    )}
</FormControl>)
}