export enum USER_ROLES {
  USER = "user",
  ADMIN = "admin",
  TENANT = "tenant",
}

export const VERIFICATION_TOKEN_EXP_MIN = 10 as const;

export const INVITATION_TOKEN_EXP_DAYS = 7 as const;
