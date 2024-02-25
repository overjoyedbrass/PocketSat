/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import { Box, Divider, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputRightElement, Spinner, VStack } from "@chakra-ui/react";
import { MdClear } from "react-icons/md";

const AutoCompleteCard = ({children, ...props}) => {
    return (<Box 
        className="autocomplete-card" 
        cursor="pointer" 
        w="100%" p={1}
        m={0}
        _hover={{
            bg: "teal",
            color: "yellow",
            transition: "background-color 200ms ease-out"
        }}
        _focus={{
            outline: "none",
            bg: "gray",
            color: "white",
            transition: "background-color 200ms ease-out"
        }}
        borderRadius={"5px"}
        {...props}>
        {children}
    </Box>)
}

function ifNaNZero(number) {
    return isNaN(number) ? 0 : number;
}

export const AutoComplete = ({
        title, children, getFilteredData, format, placeholder,
        formatId, minQueryLength=2, 
        sideEffect=null, apiCall=null, 
        isLoading=false, titleRight=null, outsideControl="",
        childPosition="absolute",
    }) => {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [focusIndex, setFocusIndex] = React.useState(-1);
    const [query, setQuery] = React.useState("");
    const [timeoutId, setTimeoutId]  = React.useState(null);

    const formRef = React.useRef(null);
    const searchInput = React.useRef(null);
    const resultsDiv = React.useRef(null);
    
    const onFocus = () => {
        searchInput.current.scrollIntoView({ behavior: "smooth" });
    }
    const onBlur = () => {
        forceUpdate();
    }

    function applyItem(obs) {
        setQuery(format(obs));
        if(sideEffect) {
            sideEffect(obs);
        }
        document.activeElement.blur();
    }

    function handleQuery({ target: { value } }) {
        if(!apiCall) {
            setQuery(value);
            return;
        }

        if(timeoutId) {
            clearInterval(timeoutId);
        }

        if(value.length >= minQueryLength) {
            setTimeoutId(setTimeout(() => {
                apiCall(value);
                setTimeoutId(null);
            }, 500));
        }
        setQuery(value);
    }

    function clearQuery() {
        setQuery("");
        sideEffect(null);
        searchInput?.current?.focus();        
    }

    useEffect(() => {
        if(outsideControl) setQuery(outsideControl);
    }, [outsideControl]);
    
    let filteredData;
    if (query.length >= minQueryLength) {
        filteredData = getFilteredData(query);
    }

    useEffect(() => {
        resultsDiv?.current?.scrollIntoView({behavior: "smooth"});
    }, [filteredData?.length]);

    const keyDownListener = (e) => {
        const key = e.key;
        switch(key){
            case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight": 
                case "Space": e.preventDefault(); break;
            default: break; // do not block other keys
        }
        if(key == "ArrowDown") {
            const index = Math.min(ifNaNZero(filteredData?.length-1) ?? 0, focusIndex+1);
            const current = document.getElementById(`ac${index}`);
            setFocusIndex(index);
            if(current) current.focus();
        } else if (key == "ArrowUp") {
            const index = Math.max(0, focusIndex-1);
            const current = document.getElementById(`ac${index}`);
            setFocusIndex(index);
            if(current) current.focus();
        } else if (key == "Enter") {
            const current = document.activeElement;
            current?.click();
            current?.blur();
            formRef?.current?.blur();
        } else if(key == "Escape") {
            const current = document.activeElement;
            current?.blur();
            forceUpdate();
        }
        resultsDiv?.current?.scrollIntoView({behavior: "smooth"});
    }

    const focused = formRef?.current?.contains(document.activeElement);

    return (<FormControl position="relative" onFocus={onFocus} onBlur={onBlur} ref={formRef} onKeyDown={keyDownListener} minHeight="fit-content">
        {titleRight ? 
        <HStack w="100%" justify={"space-between"} mb={2}>
            <FormLabel m={0}>{title}</FormLabel>
            {titleRight}
        </HStack> :
        <FormLabel>{title}</FormLabel>
        }
    <HStack>
        <InputGroup>
        <Input
            variant="filled"
            placeholder={placeholder}
            value={query}
            onChange={handleQuery}
            ref={searchInput}
            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
            tabIndex={0}
            onFocus={() => {setFocusIndex(-1)}}
        />
        {!query || <InputRightElement>
            {(isLoading || timeoutId) && query.length >= minQueryLength ? <Spinner size="md" /> :
            <IconButton variant="ghost" onClick={clearQuery} icon={<MdClear size="1.5em" />}/>}
        </InputRightElement>}
        </InputGroup>
        { children }
        
    </HStack>
    { focused && (query.length >= minQueryLength) && !isLoading ? (
        <VStack mt={1} className="autocomplete" align="flex-start" divider={<Divider />} spacing={0} maxH="250px"
            overflow="auto" border="1px solid rgba(59,48,82,1)" borderRadius="5px"
            background="linear-gradient(53deg, rgba(71,78,136,1) 0%, rgba(2,0,70,1) 50%, rgba(71,78,136,1) 100%)"
            w="100%" p={2} position={childPosition} zIndex={1000}
            onFocus={onFocus} ref={resultsDiv}
            display={isLoading || timeoutId ? "none" : ""}
            onMouseDown={(e) => e.preventDefault()}
            >
            {filteredData?.map((item, ind) => (
                <AutoCompleteCard
                    tabIndex={ind}                    
                    key={formatId(item)}
                    onClick={() => applyItem(item)}
                    children={format(item)}
                    id={`ac${ind}`}
                    p={2}
                />))}
            {!timeoutId && filteredData?.length === 0 ? (
                <AutoCompleteCard className="autocomplete-card" children={"No Matches"} onClick={() => document.activeElement.blur()}/>
            ) : null}
        </VStack>
    ) : null}
</FormControl>)
}