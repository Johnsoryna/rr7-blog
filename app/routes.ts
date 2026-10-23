import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("posts/new", "routes/posts.new.tsx"),
  route("posts/:postId", "routes/posts.$postId.tsx"),
] satisfies RouteConfig;
