import { GetPosts } from "@/utils/data"
import { LinkComponent } from "app/src/components/LinkComponent"
import dayjs from "dayjs"
import { marked } from "marked"

interface Params {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPost({ params }: Params) {
  const posts = GetPosts()
  const post = posts.find((post) => post.slug === params.slug)

  if (!post) return <div>404</div>

  return (
    <div className='flex flex-col gap-2 mb-12'>
      <h1 className='text-2xl font-bold'>{post.title}</h1>
      <p className='uppercase text-secondary text-sm'>{dayjs(post.date).format('ddd MMM DD')}</p>

      <div className="divider divider-end" />

      <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: marked.parse(post.body) as string }} />

      <div className='mt-4'>
        <LinkComponent href='/' className="text-accent">← Back to overview</LinkComponent>
      </div>
    </div>
  )
}
