import { Divider, FormControl, FormHelperText, FormLabel, Heading, Input, VStack } from "@chakra-ui/react";
import React from "react";
import { updateForm } from "../../store/formInput/timeForm";
import { useDispatch } from "react-redux";
import { format, add } from "date-fns";

//must be inside of <form>{here}</form>
export const TimeSubform = ({ datefrom=null, dateto=null, step=null}) => {
    const [formState, setFormState] = React.useState({
        datefrom: datefrom ?? format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        dateto: dateto ?? format(add(new Date(), {hours: 1}), "yyyy-MM-dd'T'HH:mm"),
        step: step ?? 10,
    });
    const dispatch = useDispatch();
    const handleChange = ({target: { name, value }}) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
    }
    React.useEffect(() => {
        dispatch(updateForm(formState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState]);

    return (<VStack
                align="flex-start"
                alignItems="center"
                flex={1}
                p={3} w="100%">
                <Heading size="md">Select time frame</Heading>
                <Divider />
                <VStack width="100%">
                    <FormControl>
                        <FormLabel>Start date</FormLabel>
                        <Input 
                            type="datetime-local" 
                            variant="filled"
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
                            variant="filled"
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
                            variant="filled"
                            onChange={handleChange} 
                            value={formState.step}
                            min={1}
                            max={30}
                            required={true}
                        />
                        <FormHelperText>
                            Exposition time (seconds)
                        </FormHelperText>
                    </FormControl>
                </VStack>
            </VStack>)
}