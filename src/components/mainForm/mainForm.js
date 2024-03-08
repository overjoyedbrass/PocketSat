import { Button, Flex, HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import { TimeSubform } from "../timeSubForm";
import { LocationSubform } from "../locationSubForm";
import { DebrisObjectSubform } from "../debrisObjectSubForm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectFormState } from "../../store/formInput/objectForm";
import { FovSubForm } from "../fovSubForm";

export const Mainform = () => {
    const navigate = useNavigate();
    const objectForm = useSelector(selectFormState)
    const objectId = objectForm.objectId;
    const tleError = objectForm.tleError;
    const customTLEMode = objectForm.customTLE;
    const desired_function = "FOV"

    function submit(e) {
        e.preventDefault();
        if(objectId === "" && !customTLEMode) {
            alert("Select object from the input field");
            return;
        }
        navigate("/results");
    }

    const flexDirection = useBreakpointValue({
        base: "column",
        lg: "row",
    });
    let error;
    if(customTLEMode) {
        error = tleError ? "Custom TLE Error" : "";
    } else {
        error = (objectId === "" || tleError) ? "Select object ID first" : "";
    }
    

    return (
    <VStack w="100%" as="form" onSubmit={submit} bgAttachment={"fixed"}>
        <Flex alignItems="flex-start" flexWrap="wrap" w="100%" spacing={0} p={[0, 5, 20, 10, 20]} pb={[0, 0, 0, 0, 0]} flexDirection={flexDirection}>
            <TimeSubform />
            <LocationSubform />
            {/*eslint-disable-next-line eqeqeq*/}
            {desired_function == "FOV" ? (<FovSubForm />) : (<DebrisObjectSubform />)}
        </Flex>
        <HStack position={"sticky"} bottom="0" w="100%" p={2} justify={{base: "flex-end", md: "center"}} zIndex={999} bg={{base: "rgba(0, 0, 0, 0.3)", md: "none"}}>
            <Button isDisabled={error} type="submit" colorScheme={error ? "red" : "green"} size={["sm", "sm", "md"]} title={error}>
                Get results
            </Button>
        </HStack>
    </VStack>)
}

