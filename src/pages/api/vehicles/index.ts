import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { vehicleValidationSchema } from 'validationSchema/vehicles';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getVehicles();
    case 'POST':
      return createVehicle();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getVehicles() {
    const data = await prisma.vehicle
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'vehicle'));
    return res.status(200).json(data);
  }

  async function createVehicle() {
    await vehicleValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.ride?.length > 0) {
      const create_ride = body.ride;
      body.ride = {
        create: create_ride,
      };
    } else {
      delete body.ride;
    }
    const data = await prisma.vehicle.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
