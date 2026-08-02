import { Request, Response } from 'express';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { sign as signPayload, verify as verifyPayload } from './signing.service';

const sign = (req: Request, res: Response) => {
  try {
    if (req.body === null || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Payload must be a JSON object or array' });
    }
    const signature = signPayload(req.body);
    return res.status(200).json({ signature });
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) });
  }
};

const verify = (req: Request, res: Response) => {
  try {
    const { signature, data } = (req.body ?? {}) as {
      signature?: unknown;
      data?: unknown;
    };

    if (typeof signature !== 'string' || data === undefined) {
      return res.status(400).json({
        error: 'Request body must include "signature" (string) and "data" properties',
      });
    }

    const isValid = verifyPayload(data, signature);
    if (isValid) {
      return res.status(204).send();
    }
    return res.status(400).json({ error: 'Invalid signature' });
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) });
  }
};

export const signingController = { sign, verify };
