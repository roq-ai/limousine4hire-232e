import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { driverValidationSchema } from 'validationSchema/drivers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getDrivers();
    case 'POST':
      return createDriver();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDrivers() {
    const data = await prisma.driver
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'driver'));
    return res.status(200).json(data);
  }

  async function createDriver() {
    await driverValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.ride?.length > 0) {
      const create_ride = body.ride;
      body.ride = {
        create: create_ride,
      };
    } else {
      delete body.ride;
    }
    const data = await prisma.driver.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
