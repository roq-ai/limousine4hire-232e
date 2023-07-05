import * as yup from 'yup';

export const rideValidationSchema = yup.object().shape({
  pickup_location: yup.string().required(),
  dropoff_location: yup.string().required(),
  vehicle_id: yup.string().nullable(),
  driver_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
