import { Checkbox, Divider, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, Heading, Input, Spinner, Tag, Textarea, VStack } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetTleCountQuery, useLazyGetSatellitesQuery } from "../../api/ephemerides";
import { AutoComplete } from "../autoComplete/autoComplete";
import { selectFormState, updateForm } from "../../store/formInput/objectForm";
import { DropDownMenu } from "../dropDownMenu/dropDownMenu";
import { IoSettingsOutline } from "react-icons/io5";
import tleParser from "tle-parser";


const MAX_ITEMS = 25;

function matchSatellite(data, query) {
    if(!data) return [];
    query = query.toLowerCase();
    const res = data.filter((obs) =>
    query.split(" ")
         .map((kw) =>
                obs.id.toLowerCase().includes(kw) ||
                obs.name.toLowerCase().includes(kw) ||
                obs.intDes.toLowerCase().includes(kw))
         .every((_) => _))

    return res.length >= MAX_ITEMS ? res.splice(0, MAX_ITEMS) : res
}

export const  DebrisObjectSubform = () => {
    const dispatch = useDispatch();

    const customTLEValue = useSelector(selectFormState).tle
    const [trigger, result] = useLazyGetSatellitesQuery();    
    const data = result.data;
    const isLoading = result.isFetching;    
    const [customTLE, setCustomTLE] = React.useState(false);

    function sideEffect(object) {
        dispatch(updateForm({objectId: object.id}))
    }

    function dispatchCustomTLE(value) {
        if (value == "") {
            dispatch(updateForm({tle: ""}))
            return
        } 
        if(value) {
            dispatch(updateForm({tle: value.split('\n').splice(0, 3).join('\n')}))
        }
    }

    let validTle = false;
    if(customTLE) {
        try {
            tleParser(customTLEValue)
            validTle = true;
        } catch(err) {}
    }

    return (
        <VStack
            align="flex-start"
            flex={1}
            w="100%"
            alignItems="center"
            spacing={4}
            transition={"flex 10s ease-out"}
            p={3}>
            <HStack w="100%" m={0}>
                <Heading size="md" m={"auto"}>Select object</Heading>
                    <DropDownMenu icon={<IoSettingsOutline  size={"2em"}/>} children={
                        (<HStack>
                            <Checkbox name="customtle" isChecked={customTLE} id="customtle" onChange={() => setCustomTLE(!customTLE)} />
                            <FormLabel userSelect={"none"} htmlFor="customtle">Custom TLE</FormLabel>                
                        </HStack>)
                    }/>
                </HStack>
            <Divider />

            { !customTLE ? 
            (<AutoComplete  
                title="Object id"
                format={(item) => `${item.id} ${item.name} ${item.intDes}`}
                formatId={(item) => `obj-${item.id}`}
                getFilteredData={(query) => matchSatellite(data, query)}
                apiCall={trigger}
                isLoading={isLoading}
                sideEffect={sideEffect}
                minQueryLength={1}
                titleRight={<TleCount />}
                childPosition="relative"
            />) : 
            (<FormControl isRequired>
                <FormLabel>Your TLE</FormLabel>
                <Textarea required={true} noOfLines={3} onChange={({target: {value}}) => dispatchCustomTLE(value)} value={customTLEValue} isInvalid={!validTle && customTLEValue.length > 0}/>
                <HStack w="100%" justify="space-between" flexWrap={"wrap"}>
                <FormHelperText>
                    Max 1 object (3 lines)
                </FormHelperText>
                {!validTle && customTLEValue.length > 0 ? (<FormHelperText color="red.200">
                    Invalid TLE format
                </FormHelperText>) : null}
                </HStack>
            </FormControl>)}

        </VStack>
    )
}

const TleCount = () => {
    const { data, isLoading } = useGetTleCountQuery();
    return <Tag colorScheme={data?.count > 0 ? "green" : "red"}>{
        isLoading ? <Spinner size="xs" /> :
        <nobr>{`TLE: ${data? data.count : "error"}`}</nobr>
    }</Tag>
}