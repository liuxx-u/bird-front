import util from './util';

const permissionKey='bird.permissions';

const permission = {
  check(permissionName) {
    if (util.string.isEmpty(permissionName)) return true;

    let permissions = permission.getPermissions();
    return permissions.findIndex(p => p == permissionName) >= 0;
  },
  getPermissions() {
    return util.store.get(permissionKey);
  },
  setPermissions(permissions) {
    if (!permissions || permissions.length === 0) return;
    util.store.set(permissionKey, permissions);
  },
  clear() {
    util.store.remove(permissionKey);
  }
}

export default permission;
