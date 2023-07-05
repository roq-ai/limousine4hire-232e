const mapping: Record<string, string> = {
  drivers: 'driver',
  organizations: 'organization',
  rides: 'ride',
  users: 'user',
  vehicles: 'vehicle',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
