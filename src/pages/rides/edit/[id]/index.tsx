import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRideById, updateRideById } from 'apiSdk/rides';
import { Error } from 'components/error';
import { rideValidationSchema } from 'validationSchema/rides';
import { RideInterface } from 'interfaces/ride';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { VehicleInterface } from 'interfaces/vehicle';
import { DriverInterface } from 'interfaces/driver';
import { UserInterface } from 'interfaces/user';
import { getVehicles } from 'apiSdk/vehicles';
import { getDrivers } from 'apiSdk/drivers';
import { getUsers } from 'apiSdk/users';

function RideEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RideInterface>(
    () => (id ? `/rides/${id}` : null),
    () => getRideById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RideInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRideById(id, values);
      mutate(updated);
      resetForm();
      router.push('/rides');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RideInterface>({
    initialValues: data,
    validationSchema: rideValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Ride
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="pickup_location" mb="4" isInvalid={!!formik.errors?.pickup_location}>
              <FormLabel>Pickup Location</FormLabel>
              <Input
                type="text"
                name="pickup_location"
                value={formik.values?.pickup_location}
                onChange={formik.handleChange}
              />
              {formik.errors.pickup_location && <FormErrorMessage>{formik.errors?.pickup_location}</FormErrorMessage>}
            </FormControl>
            <FormControl id="dropoff_location" mb="4" isInvalid={!!formik.errors?.dropoff_location}>
              <FormLabel>Dropoff Location</FormLabel>
              <Input
                type="text"
                name="dropoff_location"
                value={formik.values?.dropoff_location}
                onChange={formik.handleChange}
              />
              {formik.errors.dropoff_location && <FormErrorMessage>{formik.errors?.dropoff_location}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<VehicleInterface>
              formik={formik}
              name={'vehicle_id'}
              label={'Select Vehicle'}
              placeholder={'Select Vehicle'}
              fetcher={getVehicles}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.type}
                </option>
              )}
            />
            <AsyncSelect<DriverInterface>
              formik={formik}
              name={'driver_id'}
              label={'Select Driver'}
              placeholder={'Select Driver'}
              fetcher={getDrivers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'ride',
    operation: AccessOperationEnum.UPDATE,
  }),
)(RideEditPage);
