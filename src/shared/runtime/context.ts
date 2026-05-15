import { createContext } from "react";

import type { SessionRuntimeValue } from "./types";

export const SessionRuntimeContext = createContext<SessionRuntimeValue | null>(null);
