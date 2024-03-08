import TabLayout from "./TabLayout.tsx"

export default function Comments() {
	return (
		<TabLayout
			illustration={
				<div class="landing-section h-full p-16 lg:p-8">
					<img
						class="h-fit max-h-[24rem] w-auto"
						src="/assets/db/comments-tab-illustration.png"
						alt="Image illustration of the Comments Use Case with Astro DB"
					/>
				</div>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">Comments System</h3>
				<div class="border-b border-[#272831]"></div>

				<div class="body w-full space-y-3 text-astro-gray-200">
					<p>
						You can build a simple comment system on your website to accompany any kind of content.
						To get started, create a simple POST API endpoint that receives a new comment from the
						frontend and attach it to the correct author and post IDs:
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
