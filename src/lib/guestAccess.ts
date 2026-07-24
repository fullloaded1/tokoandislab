export function verifyGuestOrderAccess(
  order: { guestAccessToken: string | null; guestAccessTokenExpiresAt: Date | null },
  token: string | null
): boolean {
  if (!token || !order.guestAccessToken) return false;
  if (order.guestAccessToken !== token) return false;
  if (order.guestAccessTokenExpiresAt && new Date() > order.guestAccessTokenExpiresAt) return false;
  return true;
}
