import { Request, Response } from 'express';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { decryptObject, encryptObject, JsonObject } from './encryption.service';

const encrypt = (req: Request, res: Response) => {
  try {
    const encrypted = encryptObject(req.body as JsonObject);
    return res.status(200).json(encrypted);
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) });
  }
};

const decrypt = (req: Request, res: Response) => {
  try {
    const decrypted = decryptObject(req.body as JsonObject);
    return res.status(200).json(decrypted);
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) });
  }
};

export const encryptionController = { encrypt, decrypt };
