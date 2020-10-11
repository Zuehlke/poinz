const normalizePathname = (pathname) =>
  pathname && pathname.length > 1 ? pathname.substring(1) : '';

export default normalizePathname;
