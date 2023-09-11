export default function ({ redirect,route }) {
  const loggeduser = localStorage.getItem("Auth");
  const publicPages = [
    "/admin/login",
    "/admin/register",
    "/admin/forgot-password",
  ];
  const authpage = !publicPages.includes(route.path);
  if (!loggeduser && authpage) {
    redirect("/admin/login");
  }
}
