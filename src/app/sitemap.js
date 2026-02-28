export default function sitemap() {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_URL}`,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/authors`,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/articles`,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}