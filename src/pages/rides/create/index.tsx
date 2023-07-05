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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRide } from 'apiSdk/rides';
import { Error } from 'components/error';
import { rideValidationSchema } from 'validationSchema/rides';
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
import { RideInterface } from 'interfaces/ride';

function RideCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RideInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRide(values);
      resetForm();
      router.push('/rides');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RideInterface>({
    initialValues: {
      pickup_location: '',
      dropoff_location: '',
      vehicle_id: (router.query.vehicle_id as string) ?? null,
      driver_id: (router.query.driver_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Ride
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(RideCreatePage);
