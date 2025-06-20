// _shared uses the deno.json at root
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { StreamChat } from "npm:stream-chat@9.6.1";
import { SUPABASE_NEV } from "./constants.ts";

export const supabaseAdmin = createClient(
  Deno.env.get(SUPABASE_NEV.SUPABASE_URL) ?? "",
  Deno.env.get(SUPABASE_NEV.SUPABASE_SERVICE_ROLE_KEY) ?? "",
);

export const supabaseClient = createClient(
  Deno.env.get(SUPABASE_NEV.SUPABASE_URL) ?? "",
  Deno.env.get(SUPABASE_NEV.SUPABASE_ANON_KEY) ?? "",
);

export const streamServerClient = StreamChat.getInstance(
  Deno.env.get(SUPABASE_NEV.STREAM_API_KEY) ?? "",
  Deno.env.get(SUPABASE_NEV.STREAM_API_SECRET) ?? "",
);
