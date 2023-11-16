import React from "react";

import { Button, HStack, VStack } from "@chakra-ui/react";
import { TimeSubform } from "../timeSubForm";
import { LocationSubform } from "../locationSubForm";
import { DebrisObjectSubform } from "../debrisObjectSubForm";
import { useLocation, useNavigate } from "react-router-dom";

export const Mainform = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const initState = location.state;

    function submit(e) {
        e.preventDefault();
        navigate("/results");
    }
    return (
    <VStack w="100%" as="form" onSubmit={submit}>
        <HStack>
            <Button type="submit">Get results</Button>
        </HStack>
        <HStack alignItems="flex-start" flexWrap="wrap" whiteSpace={"nowrap"} w="100%">
            <TimeSubform datefrom={initState?.datefrom} dateto={initState?.dateto} step={initState?.step} />
            <LocationSubform lat={initState?.lat} lng={initState?.lng} alt={initState?.alt} />
            <DebrisObjectSubform objectid={initState?.objectId}/>
        </HStack>
    </VStack>)
}