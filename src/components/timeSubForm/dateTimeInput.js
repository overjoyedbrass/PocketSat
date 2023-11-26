import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

export const DateTimeInput = ({label, helperText, children, value, ...props}) => {
    return (<FormControl isRequired>
        <FormLabel>{label}</FormLabel>
        <Input
            value={value}
            type="datetime-local" 
            variant="filled"
            required={true}
            {...props}
        />
        {!helperText || <FormHelperText>
            {helperText}
        </FormHelperText> }
    </FormControl>)
}