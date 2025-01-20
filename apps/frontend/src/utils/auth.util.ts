import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/auth.type';
import { cookies } from 'next/headers';

export const generateJWT = (user: UserPayload) => {
  const token = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  return token;
}

export const setCookie = async (name: string, token: string) => {
  const cookie = await cookies()
  cookie.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })
}


export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded as UserPayload
  }
  catch (error) {
    return null
  }
}

export const deleteCookie = async (name: string) => {
  const cookie = await cookies()

  cookie.delete(name)
}
