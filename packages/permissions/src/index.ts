export const platformPermissions = [
  'platform.workspaces.read',
  'platform.workspaces.create',
  'platform.workspaces.update',
  'platform.users.read',
  'platform.users.create',
  'platform.users.update',
  'platform.users.delete',
  'platform.sites.read',
  'platform.sites.create',
  'platform.sites.update',
  'platform.sites.delete',
  'platform.roles.read',
  'platform.roles.write',
  'platform.audit.read',
] as const;

export type PlatformPermission = (typeof platformPermissions)[number];

export function hasPermission(granted: readonly string[], permission: string): boolean {
  return granted.includes(permission) || granted.includes('*');
}