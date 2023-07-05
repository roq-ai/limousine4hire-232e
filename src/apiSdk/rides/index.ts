import axios from 'axios';
import queryString from 'query-string';
import { RideInterface, RideGetQueryInterface } from 'interfaces/ride';
import { GetQueryInterface } from '../../interfaces';

export const getRides = async (query?: RideGetQueryInterface) => {
  const response = await axios.get(`/api/rides${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRide = async (ride: RideInterface) => {
  const response = await axios.post('/api/rides', ride);
  return response.data;
};

export const updateRideById = async (id: string, ride: RideInterface) => {
  const response = await axios.put(`/api/rides/${id}`, ride);
  return response.data;
};

export const getRideById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rides/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRideById = async (id: string) => {
  const response = await axios.delete(`/api/rides/${id}`);
  return response.data;
};
