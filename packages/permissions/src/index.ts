export const platformPermissions = [
  'platform.workspaces.read',
  'platform.workspaces.create',
  'platform.users.read',
  'platform.users.create',
  'platform.sites.read',
  'platform.sites.create',
  'platform.roles.read',
  'platform.roles.write',
  'platform.audit.read',
  'content.types.read',
  'content.types.create',
  'content.entries.read',
  'content.entries.create',
  'content.entries.publish',
  'content.taxonomies.read',
  'content.taxonomies.create',
  'content.media.read',
  'content.media.upload',
] as const;

export type PlatformPermission = (typeof platformPermissions)[number];

export function hasPermission(granted: readonly string[], permission: string): boolean {
  return granted.includes(permission) || granted.includes('*');
}
