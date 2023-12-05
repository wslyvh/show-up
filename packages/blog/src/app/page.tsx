import { Card } from "@/components/Card"
import { GetPosts } from "@/utils/data"

export default async function Home() {
  const posts = GetPosts()

  return (
    <div className='flex flex-col gap-2'>
      {posts.map((post) => {
        return <Card key={post.slug} post={post} />
      })}
    </div>
  )
}
