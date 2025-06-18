// _shared uses the deno.json at root
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { StreamChat } from "npm:stream-chat@9.6.1";

export const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

export const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

export const streamServerClient = StreamChat.getInstance(
  Deno.env.get("STREAM_API_KEY") ?? "",
  Deno.env.get("STREAM_API_SECRET") ?? "",
);
