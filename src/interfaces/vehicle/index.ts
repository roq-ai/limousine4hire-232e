import { RideInterface } from 'interfaces/ride';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface VehicleInterface {
  id?: string;
  type: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  ride?: RideInterface[];
  user?: UserInterface;
  _count?: {
    ride?: number;
  };
}

export interface VehicleGetQueryInterface extends GetQueryInterface {
  id?: string;
  type?: string;
  user_id?: string;
}
