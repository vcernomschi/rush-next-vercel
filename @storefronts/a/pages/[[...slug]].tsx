import { GetStaticPaths, GetStaticProps } from 'next';


type BlogPost = {
  slug: string;
  title: string;
  content: string;
};

export const getSlugDetails = (
  slugParams?: string | string[]
): {
  hasAbGroup: boolean;
  staged: boolean;
  canonicalSlug: string;
  abgroup: string;
  sitemapSlugs: string[];
} => {
  let hasAbGroup = false;
  let staged = false;
  let canonicalSlug = Array.isArray(slugParams) ? "" : slugParams || "";
  let abgroup = "";

  if (Array.isArray(slugParams)) {
    hasAbGroup = slugParams.some((param) => param.includes("abgroup"));
    staged = slugParams.includes("staged");
    canonicalSlug = slugParams
      .filter((param) => param !== "staged" && !param.includes("abgroup"))
      .join("/");
    abgroup = hasAbGroup
      ? slugParams
          ?.find((param) => param.includes("abgroup"))
          ?.replace("abgroup-", "") || ""
      : "";
  }

  const sitemapSlugs =
    canonicalSlug?.split("/").filter((path: string) => !!path) || [];

  return {
    hasAbGroup,
    staged,
    canonicalSlug,
    sitemapSlugs,
    abgroup,
  };
};

const fetchPost = async (canonicalSlug: string): Promise<BlogPost | null> => {
  // Dummy page data
  const DUMMY_PAGES: BlogPost[] = [
    { slug: "", title: "Home page", content: `Hello home pahe! ${new Date()}` },
    {
      slug: "first-page",
      title: "Page",
      content: `Hello world! ${new Date()}`,
    },
    {
      slug: "second-rewrite",
      title: "Rewrite",
      content: `second-rewrite! ${new Date()}`,
    },
    {
      slug: "second/rewrite",
      title: "second/rewrite",
      content: `second/rewrite ${new Date()}`,
    },
    {
      slug: "nextjs/tips",
      title: "Nested Tip",
      content: `ISR supports nested routes. ${new Date()}`,
    },
  ];


  return DUMMY_PAGES.find((p) => p.slug === canonicalSlug) || null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  console.log("getStaticPaths");

  return {
    paths: [], // no pre-built paths
    fallback: "blocking", // build on-demand
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("getStaticProps called with params:", params);

  const slugParts = Array.isArray(params?.slug) ? params.slug : [];

  const { staged, canonicalSlug, abgroup } = getSlugDetails(params?.slug);
  console.log("Slug details:", { staged, canonicalSlug, abgroup, slugParts });

  const post = await fetchPost(canonicalSlug);

  // intentionally log if no post is found, 
  // this can help in debugging issues with slug matching
  if (!post) {
    console.log("No post found for slug:", slugParts);
    return {
      props: {
        post: {
          title: "not found",
          content: "not found",
          slug: "not found",
        },
      },
      revalidate: 3600, // revalidate every hour for DEMO purposes
    };
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
