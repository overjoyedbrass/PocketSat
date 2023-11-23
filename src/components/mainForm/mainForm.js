import React from "react";

import { Button, HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
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
    const Stack = useBreakpointValue({
        base: VStack,
        md: HStack,
    });
    return (
    <VStack w="100%" as="form" onSubmit={submit} bgAttachment={"fixed"}>
        <Stack alignItems="flex-start" flexWrap="wrap" w="100%" spacing={0} p={[0, 10, 10, 20]} pb={[0, 0, 0, 0]}>
            <TimeSubform datefrom={initState?.datefrom} dateto={initState?.dateto} step={initState?.step} />
            <LocationSubform lat={initState?.lat} lng={initState?.lng} alt={initState?.alt} />
            <DebrisObjectSubform objectid={initState?.objectId} />            
        </Stack>
        <HStack position={"sticky"} bottom="0" w="100%" p={2} justify={{base: "flex-end", md: "center"}} zIndex={9999999} bg={{base: "rgba(0, 0, 0, 0.3)", md: "none"}}>
            <Button type="submit" colorScheme="facebook" size={["sm", "sm", "md"]}>Get results</Button>
        </HStack>
    </VStack>)
}