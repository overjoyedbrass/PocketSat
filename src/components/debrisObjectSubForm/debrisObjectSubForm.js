import { Divider, FormControl, FormLabel, HStack, Heading, Input, VStack } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { updateFormInput } from "../../store/formInput/formInput";
            
export const  DebrisObjectSubform = ({objectid=null}) => {
    const [objectId, setObjectId] = React.useState(objectid ?? "");
    const dispatch = useDispatch();    

    function handleChange({target: {value}}) {
        setObjectId(value);
        dispatch(updateFormInput({objectId: objectId}));
    }
    React.useEffect(() => {
        dispatch(updateFormInput({objectId: objectId}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectId])
    return (
        <VStack
            align="flex-start"
            flex={1}
            alignItems="center"
            p={3}>
            <Heading size="md">Select object</Heading>
            <Divider />
            <HStack width="100%">
                <FormControl>
                    <FormLabel>Object name:</FormLabel>
                    <Input name="objectid" onChange={handleChange} value={objectId} required={true} />
                </FormControl>
            </HStack>
        </VStack>
    )
}