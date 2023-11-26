import { FormControl, HStack, FormHelperText, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, NumberInputField, FormLabel, NumberInput } from "@chakra-ui/react";
            
export const MyNumberInput = ({title, value, onChange, step, helperText=null, ...props}) => {
    let res = (
        <NumberInput
            flex={1}
            {...props}
            value={value}
            variant={"filled"}
            isRequired={true}
            onChange={onChange}
            allowMouseWheel
            step={step}
            >
            <NumberInputField  />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
    )

    if(props.children) {
        res = (
            <HStack>
                {res}
                {props.children}
            </HStack>
        )
    }

    return (
        <FormControl isRequired>
            <FormLabel>{title}</FormLabel>
            {res}
            {!helperText || <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}