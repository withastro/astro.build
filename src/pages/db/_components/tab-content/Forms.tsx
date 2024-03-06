import TabLayout from "./TabLayout.tsx"

export default function Forms() {
	return (
		<TabLayout
			illustration={
				<img
					class="h-fit w-auto"
					src="src/pages/db/_assets/forms-tab-illustration.png"
					alt="Image illustration of the Authentication Use Case with Astro DB"
				/>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">Collect Form Responses</h3>
				<div class="border-b border-[#272831]"></div>

				<div class="space-y-3">
					<p class="body w-full text-astro-gray-200">
						Create a contact form to collect responses from your visitors. Add a{" "}
						<code>{`<form>`}</code> to your page that points to a new API route.
					</p>

					<p class="body w-full text-astro-gray-200">
						The <code>/api/contact</code> route should be a simple POST API endpoint that stores
						responses in Astro DB.
					</p>

					<pre class="overflow-x-auto p-2 bg-[#07040F] border border-[#272831] rounded-lg">
						<code class="text-sm text-astro-gray-200">
							{`import type { APIRoute } from 'astro';
import { db, Feedback, sql, eq } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const { url: pathname, feedback: key } = Object.fromEntries(formData.entries());

  if (key === 'positive' || key === 'negative') {
    const url = pathname.toString();
    // TODO: IS THIS CORRECT?!
    const set = { url, [key]: sql\`(${`key`} + 1)\` };
    await db.insert(Feedback)
      .values(set)
      .onConflictDoUpdate({ target: Feedback.url, set });
  }
  return Response.json({ success: true });
}
`}
						</code>
					</pre>
				</div>
			</>
		</TabLayout>
	)
}
