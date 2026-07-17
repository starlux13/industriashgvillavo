import { defineTool } from "@lovable.dev/mcp-js";
import { TENANTS } from "@/lib/tenants";

export default defineTool({
  name: "list_tenants",
  title: "List motels",
  description: "List the motels (tenants) available on this site with their slug, name and location.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(TENANTS.map((t) => ({ slug: t.slug, name: t.name, city: t.city ?? null }))) }],
  }),
});
