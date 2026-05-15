import { RouterProvider } from "react-router-dom";

import { SessionRuntimeProvider } from "../shared/runtime";
import { router } from "./router";

export function App() {
  return (
    <SessionRuntimeProvider>
      <RouterProvider router={router} />
    </SessionRuntimeProvider>
  );
}
