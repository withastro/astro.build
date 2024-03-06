import TabLayout from "./TabLayout.tsx"

export default function Comments() {
	return (
		<TabLayout
			illustration={
				<img
					class="h-fit w-auto"
					src="src/pages/db/_assets/forms-tab-illustration.png"
					alt="Image illustration of the Comments Use Case with Astro DB"
				/>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">Comments System</h3>
				<div class="border-b border-[#272831]"></div>

				<div class="space-y-3">
					<p class="body w-full text-astro-gray-200">
						Collect user feedback directly on your documentation. Add a <code>{`<form>`}</code> to
						your page that tracks the current URL with a hidden input.
					</p>

					<p class="body w-full text-astro-gray-200">
						The <code>{`/api/feedback`}</code> route should be a simple POST API endpoint that
						stores the feedback in Astro DB.
					</p>

					<pre class="overflow-x-auto rounded-lg border border-[#272831] bg-[#07040F] p-2">
						<code class="text-sm text-astro-gray-200">
							{`import type { APIRoute } from 'astro';
import { db, Comment } from 'astro:db';

export const POST: APIRoute = async ({ request, locals }) => {
  const { body, blogPostId } = (await request.json());
  await db
    .insert(Comment)
    .values({
      authorId: "12345",      
	  postId: blogPostId,
      body
	});

  return Response.json({success: true});
}
`}
						</code>
					</pre>
				</div>
			</>
		</TabLayout>
	)
}
