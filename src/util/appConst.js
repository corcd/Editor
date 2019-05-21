let BACKEND_DOMAIN = "http://localhost:8080";
if (process.env.NODE_ENV === "production") {
  BACKEND_DOMAIN = "http://139.196.92.199";
} else if (process.env.NODE_ENV === "development") {
  BACKEND_DOMAIN = "http://localhost:8080";
}
export default {
  BACKEND_DOMAIN
};
