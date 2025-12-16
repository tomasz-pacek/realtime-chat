import { treaty } from "@elysiajs/eden";
import type { App } from "@/app/api/[[...slugs]]/route";

export const client = treaty<App>(
  "https://realtime-chat-pi-drab.vercel.app"
).api;

//https://realtime-chat-pi-drab.vercel.app
//localhost:3000
