export const USER_ROLE = {
  CONTRIBUTOR: "contributor",
  MAINTAINER: "maintainer",
} as const;

export type UserRole = "contributor" | "maintainer";
