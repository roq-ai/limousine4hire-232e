import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { driverValidationSchema } from 'validationSchema/drivers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.driver
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDriverById();
    case 'PUT':
      return updateDriverById();
    case 'DELETE':
      return deleteDriverById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDriverById() {
    const data = await prisma.driver.findFirst(convertQueryToPrismaUtil(req.query, 'driver'));
    return res.status(200).json(data);
  }

  async function updateDriverById() {
    await driverValidationSchema.validate(req.body);
    const data = await prisma.driver.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteDriverById() {
    const data = await prisma.driver.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
