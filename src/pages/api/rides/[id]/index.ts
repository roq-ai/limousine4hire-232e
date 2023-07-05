import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { rideValidationSchema } from 'validationSchema/rides';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.ride
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRideById();
    case 'PUT':
      return updateRideById();
    case 'DELETE':
      return deleteRideById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRideById() {
    const data = await prisma.ride.findFirst(convertQueryToPrismaUtil(req.query, 'ride'));
    return res.status(200).json(data);
  }

  async function updateRideById() {
    await rideValidationSchema.validate(req.body);
    const data = await prisma.ride.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRideById() {
    const data = await prisma.ride.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
