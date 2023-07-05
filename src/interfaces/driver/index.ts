import { RideInterface } from 'interfaces/ride';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface DriverInterface {
  id?: string;
  name: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  ride?: RideInterface[];
  user?: UserInterface;
  _count?: {
    ride?: number;
  };
}

export interface DriverGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
