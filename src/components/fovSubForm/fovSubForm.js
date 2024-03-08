import { Divider,  HStack,  Heading, VStack } from "@chakra-ui/react";
import { MyNumberInput } from "../myNumberInput";
// import { useDispatch } from "react-redux";
export const  FovSubForm = () => {
    // const dispatch = useDispatch();    

    return (
        <VStack align="flex-start"
            flex={1}
            w="100%"
            alignItems="center"
            spacing={4}
            p={3}>
            <Heading size="md" m="auto">Field of view</Heading>
            <Divider />
            <MyNumberInput title="Center of Fov - RA" helperText="Right Ascension [hours]" size="sm"/>
            <MyNumberInput title="Center of Fov - DEC" helperText="Declination [degrees]" size="sm"/>
            <HStack w="100%">
                <MyNumberInput title="Width of Fov" helperText="[degrees]" size="sm"/>
                <MyNumberInput title="Height of Fov" helperText="[degrees]" size="sm"/>
            </HStack>
            <MyNumberInput title="Limiting magnitude" helperText="[mag]" size="sm"/>

        </VStack>
    )
}