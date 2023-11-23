import { Divider, FormControl, FormLabel, HStack, Heading, Input, VStack } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { updateForm } from "../../store/formInput/objectForm";
            
export const  DebrisObjectSubform = ({objectid=null}) => {
    const [objectId, setObjectId] = React.useState(objectid ?? "");
    const dispatch = useDispatch();    

    function handleChange({target: {value}}) {
        setObjectId(value);
        dispatch(updateForm({objectId: objectId}));
    }
    React.useEffect(() => {
        dispatch(updateForm({objectId: objectId}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectId])
    return (
        <VStack
            align="flex-start"
            flex={1}
            w="100%"
            alignItems="center"
            p={3}>
            <Heading size="md">Select object</Heading>
            <Divider />
            <HStack width="100%">
                <FormControl>
                    <FormLabel>Object name:</FormLabel>
                    <Input 
                        name="objectid" 
                        variant="filled" 
                        onChange={handleChange} 
                        value={objectId} 
                        required={true}
                        placeholder="37204"
                    />
                </FormControl>
            </HStack>
        </VStack>
    )
}