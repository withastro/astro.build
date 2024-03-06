import TabLayout from "./TabLayout.tsx"

export default function Feedback() {
	return (
		<TabLayout
			illustration={
				<img
					class="h-fit w-auto"
					src="src/pages/db/_assets/forms-tab-illustration.png"
					alt="Image illustration of the Feedback Widget Use Case with Astro DB"
				/>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">Feedback Widget</h3>
				<div class="border-b border-[#272831]"></div>

				<div class="space-y-3">
					<p class="body w-full text-astro-gray-200">
						Collect user feedback directly on your documentation. Add a <code>{`<form>`}</code> to
						your page that tracks the current URL with a hidden input.
					</p>

					<p class="body w-full text-astro-gray-200">
					The  <code>{`/api/feedback`}</code> route should be a simple POST API endpoint that stores the feedback in Astro DB.
					</p>

					<pre class="overflow-x-auto rounded-lg border border-[#272831] bg-[#07040F] p-2">
						<code class="text-sm text-astro-gray-200">
							{`import type { APIRoute } from 'astro';
import { db, Feedback, sql, eq, } from 'astro:db';

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