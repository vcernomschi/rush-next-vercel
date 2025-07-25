import { GetStaticPaths, GetStaticProps } from 'next';


type BlogPost = {
  slug: string;
  title: string;
  content: string;
};



const fetchPost = async (slugParts: string[]): Promise<BlogPost | null> => {
  // Dummy post data
  const DUMMY_POSTS: BlogPost[] = [
    { slug: '', title: 'Home page', content: `Hello home pahe! ${new Date()}` },
    { slug: 'first-post', title: 'First Post', content: `Hello world! ${new Date()}` },
    { slug: 'nextjs/tips', title: 'Nested Tip', content: `ISR supports nested routes. ${new Date()}` },
  ];

  const slug = slugParts.join('/');
  return DUMMY_POSTS.find(p => p.slug === slug) || null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  console.log('getStaticPaths');
  return {
    paths: [], // no pre-built paths
    fallback: 'blocking', // build on-demand
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('getStaticProps called with params:', params);
  const slugParts = Array.isArray(params?.slug) ? params.slug : [];

  const post = await fetchPost(slugParts);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 3600, // revalidate every hour for DEMO purposes
  };
};

export default function BlogPost({ post }: { post: BlogPost }) {
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Slug: {post.slug}</p>
    </main>
  );
}