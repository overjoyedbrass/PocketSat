import { Divider, FormControl, FormHelperText, FormLabel, Heading, Input, VStack } from "@chakra-ui/react";
import React from "react";
import { updateFormInput } from "../../store/formInput/formInput";
import { useDispatch } from "react-redux";

//must be inside of <form>{here}</form>
export const TimeSubform = ({ datefrom=null, dateto=null, step=null}) => {
    const [formState, setFormState] = React.useState({
        datefrom: datefrom ?? "",
        dateto: dateto ?? "",
        step: step ?? 1,
    });
    const dispatch = useDispatch();
    const handleChange = ({target: { name, value }}) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
    }
    React.useEffect(() => {
        dispatch(updateFormInput(formState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState]);

    return (<VStack
                align="flex-start"
                alignItems="center"
                flex={1}
                p={3}>
                <Heading size="md">Select time frame</Heading>
                <Divider />
                <VStack width="100%">
                    <FormControl>
                        <FormLabel>Start date</FormLabel>
                        <Input 
                            type="datetime-local" 
                            name="datefrom" 
                            onChange={handleChange} 
                            value={formState.datefrom} 
                            max={formState.dateto}
                            required={true}
                        />
                        <FormHelperText>
                            Start of observing (UTC)
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>End date</FormLabel>
                        <Input 
                            type="datetime-local" 
                            name="dateto" 
                            onChange={handleChange} 
                            value={formState.dateto} 
                            min={formState.datefrom}
                            required={true}
                        />
                        <FormHelperText>
                            End of observing (UTC)
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Step</FormLabel>
                        <Input 
                            type="number" 
                            name="step" 
                            onChange={handleChange} 
                            value={formState.step}
                            min={1}
                            max={30}
                            required={true}
                        />
                        <FormHelperText>
                            Divide interval into steps
                        </FormHelperText>
                    </FormControl>
                </VStack>
            </VStack>)
}