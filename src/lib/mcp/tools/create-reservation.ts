import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { generateGuestAlias } from "@/lib/booking-names";
import { TENANTS } from "@/lib/tenants";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const tenantSlugs = TENANTS.map((t) => t.slug) as [string, ...string[]];

export default defineTool({
  name: "create_reservation",
  title: "Create reservation",
  description: "Create a reservation for the signed-in user at one of the motels.",
  inputSchema: {
    tenant_slug: z.enum(tenantSlugs).describe("Motel slug (see list_tenants)."),
    room_type: z.string().min(1).max(60).describe("Room / suite type."),
    check_in: z.string().describe("ISO date (YYYY-MM-DD)."),
    check_out: z.string().describe("ISO date (YYYY-MM-DD)."),
    guests: z.number().int().min(1).max(10).default(2),
    contact_phone: z.string().min(6).max(20).optional(),
    notes: z.string().max(500).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx)
      .from("reservations")
      .insert({
        user_id: ctx.getUserId(),
        tenant_slug: input.tenant_slug,
        room_type: input.room_type,
        check_in: input.check_in,
        check_out: input.check_out,
        guests: input.guests ?? 2,
        contact_phone: input.contact_phone ?? null,
        notes: input.notes ?? null,
        guest_alias: generateGuestAlias(),
        status: "pending",
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { reservation: data } };
  },
});
