import { Divider, FormControl, FormLabel, Heading, Input, NumberInput, NumberInputField, VStack } from "@chakra-ui/react";
import React from "react";
import { Map } from "../map";

import { observatories } from "../../data/observatories.js";
import { useDispatch } from "react-redux";
import { updateFormInput } from "../../store/formInput/formInput.js";

function matchObservatory(query) {
    query = query.toLowerCase();
    return observatories.filter((obs) =>
        query
            .split(" ")
            .map(
                (kw) =>
                    obs.code.toLowerCase().includes(kw) ||
                    obs.name.toLowerCase().includes(kw) ||
                    obs.region.toLowerCase().includes(kw)
            )
            .every((_) => _)
    );
}


export const LocationSubform = ({lat=null, lng=null, alt=null}) => {
    console.log("loc update");
    const [obsquery, setObsquery] = React.useState("");
    const [center, setCenter] = React.useState({
        lat: lat ?? "48.14816",
        lng: lng ?? "17.10674",
        alt: alt ?? "20",
    });    
    const filteredObs = matchObservatory(obsquery);
    const markerRef = React.useRef();
    const searchInput = React.createRef();
    const [focused, setFocused] = React.useState(false);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(updateFormInput(center));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [center]);

    const onFocus = () => setFocused(true);
    const onBlur = () => setTimeout(() => setFocused(false), 100);

    function handleObsQuery({ target: { value } }) {
        setObsquery(value);
    }

    function setObs(obs) {
        setCenter({ ...obs });
        setObsquery(obs.name);
    }

    const eventHandlers = React.useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    setCenter({...marker.getLatLng(), alt: center.alt});
                    setObsquery("Custom");
                }
            },
        }),
        [center]
    );

    return (
        <VStack
                align="flex-start"
                p={3}
                flex={1}
                alignItems="center"
                spacing="1em"
            >
                <Heading size="md">Choose your location</Heading>
                <Divider />
                <FormControl position="relative">
                    <FormLabel>Observation location</FormLabel>
                    <Input
                        placeholder="Observatory name"
                        value={obsquery}
                        onChange={handleObsQuery}
                        ref={searchInput}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                    {!focused || obsquery.length <= 2 || (
                        <VStack
                            className="autocomplete"
                            align="flex-start"
                            divider={<Divider />}
                        >
                            {filteredObs.map((obs) => (
                                <div
                                    key={`obs-${obs.code}`}
                                    className="autocomplete-card"
                                    onClick={() => setObs(obs)}
                                >
                                    {obs.name} ({obs.code})
                                </div>
                            ))}
                            {filteredObs.length === 0 ? (
                                <div className="autocomplete-card">
                                    No matches
                                </div>
                            ) : null}
                        </VStack>
                    )}
                </FormControl>
                <FormControl>
                    <FormLabel>Latitude</FormLabel>
                    <NumberInput value={center.lat} 
                        isRequired={true}
                        onChange={(value) => setCenter({...center, lat: value})}
                        step={"0.01"}>
                        <NumberInputField  />
                    </NumberInput>
                </FormControl>
                <FormControl>
                    <FormLabel>Longitude</FormLabel>
                    <NumberInput isRequired={true} value={center.lng} onChange={(value) => setCenter({...center, lng: value})} step={"0.01"}>
                        <NumberInputField />
                    </NumberInput>
                </FormControl>
                <FormControl>
                    <FormLabel>Altitude</FormLabel>
                    <NumberInput isRequired={true} value={center.alt} onChange={(value) => setCenter({...center, alt: value})} step={"0.01"}>
                        <NumberInputField />
                    </NumberInput>
                </FormControl>

                <Map
                    center={center} 
                    setCenter={setCenter} 
                    markerRef={markerRef} 
                    eventHandlers={eventHandlers} 
                    setObsquery={setObsquery} 
                    width="100%"
                    height="300px"
                />
            </VStack>
    )
}