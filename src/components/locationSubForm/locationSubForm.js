import { Divider,  IconButton,  Heading, VStack } from "@chakra-ui/react";
import React from "react";
import { Map } from "../map";
import { useDispatch, useSelector } from "react-redux";
import { selectFormState, updateForm } from "../../store/formInput/locationForm.js";
import { MyNumberInput, ObservatoryQuery } from "../../components";
import { getUserLocation, isNumeric } from "../../utils/helpers.js";
import { FaLocationCrosshairs } from "react-icons/fa6";

export const LocationSubform = () => {
    const center = useSelector(selectFormState);
    const dispatch = useDispatch();

    function setCenter(location, obsName="Custom") {
        for(let value of Object.values(location)) {
            if(['', '-'].includes(value)) continue;
            if(!isNumeric(value)) return;
        }
        dispatch(updateForm({...location, observatoryName: obsName}));
    }


    return (<VStack
            align="flex-start"
            p={3}
            flex={2}
            alignItems="center"
            w="100%" spacing={4}>
            <Heading size="md">Choose your location</Heading>
            <Divider />
            <ObservatoryQuery>
                <IconButton
                    colorScheme="teal"
                    title="Your current location" 
                    onClick={(e) => getUserLocation(e, setCenter)}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label="get user location" 
                    size="md"
                    placeholder="Use your location"
                    icon={<FaLocationCrosshairs size="1.5em" />} color="black"
                />
            </ObservatoryQuery>
            <MyNumberInput tabIndex={100} title="Latitude" value={center.lat} onChange={(value) => setCenter({lat: value})} step={0.10} min={-90} max={90} />
            <MyNumberInput tabIndex={101} title="Longitude" value={center.lng} onChange={(value) => setCenter({lng: value})} step={0.10} min={-180} max={180} />
            <MyNumberInput tabIndex={102} title="Altitude" value={center.alt} onChange={(value) => setCenter({alt: value})} step={1} helperText="meters (m)" min={-10000} max={10000} />
            <Map
                width="100%"
                height="300px"
            />
        </VStack>)
}