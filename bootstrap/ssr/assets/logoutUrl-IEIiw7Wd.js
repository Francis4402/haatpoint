function logoutUrl(role) {
  if (role === "agent") return "/agent/logout";
  if (role === "admin" || role === "superadmin") return "/admin/logout";
  return "/logout";
}
export {
  logoutUrl as l
};
