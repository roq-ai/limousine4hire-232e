import { VehicleInterface } from 'interfaces/vehicle';
import { DriverInterface } from 'interfaces/driver';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RideInterface {
  id?: string;
  pickup_location: string;
  dropoff_location: string;
  vehicle_id?: string;
  driver_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  driver?: DriverInterface;
  user?: UserInterface;
  _count?: {};
}

export interface RideGetQueryInterface extends GetQueryInterface {
  id?: string;
  pickup_location?: string;
  dropoff_location?: string;
  vehicle_id?: string;
  driver_id?: string;
  user_id?: string;
}
