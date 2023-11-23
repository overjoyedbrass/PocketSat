import { Divider, FormControl, FormHelperText, FormLabel,  Heading, NumberInput, NumberInputField, VStack } from "@chakra-ui/react";
import React from "react";
import { Map } from "../map";

import { useDispatch, useSelector } from "react-redux";
import { selectFormState, updateForm } from "../../store/formInput/locationForm.js";

import { ObservatoryQuery } from "../../components";

export const LocationSubform = () => {
    const center = useSelector(selectFormState);
    const dispatch = useDispatch();

    function setCenter(location) {
        dispatch(updateForm(location));
    }
    
    return (
        <VStack
            align="flex-start"
            p={3}
            flex={2}
            alignItems="center"
            w="100%">
            <Heading size="md">Choose your location</Heading>
            <Divider />
            <ObservatoryQuery />
            <FormControl>
                <FormLabel>Latitude</FormLabel>
                <NumberInput value={center.lat} 
                    variant={"filled"}
                    isRequired={true}
                    onChange={(value) => setCenter({lat: value})}
                    step={"0.01"}>
                    <NumberInputField  />
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel>Longitude</FormLabel>
                <NumberInput isRequired={true} variant="filled" value={center.lng} onChange={(value) => setCenter({lng: value})} step={"0.01"}>
                    <NumberInputField />
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel>Altitude</FormLabel>
                <NumberInput isRequired={true} value={center.alt} variant="filled" onChange={(value) => setCenter({alt: value})} step={"0.01"}>
                    <NumberInputField />
                </NumberInput>
                <FormHelperText>
                    meters (m)
                </FormHelperText>
            </FormControl>

            <Map
                width="100%"
                height="300px"
            />
        </VStack>)
}