import axios from 'axios';
import queryString from 'query-string';
import { DriverInterface, DriverGetQueryInterface } from 'interfaces/driver';
import { GetQueryInterface } from '../../interfaces';

export const getDrivers = async (query?: DriverGetQueryInterface) => {
  const response = await axios.get(`/api/drivers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDriver = async (driver: DriverInterface) => {
  const response = await axios.post('/api/drivers', driver);
  return response.data;
};

export const updateDriverById = async (id: string, driver: DriverInterface) => {
  const response = await axios.put(`/api/drivers/${id}`, driver);
  return response.data;
};

export const getDriverById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/drivers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDriverById = async (id: string) => {
  const response = await axios.delete(`/api/drivers/${id}`);
  return response.data;
};
