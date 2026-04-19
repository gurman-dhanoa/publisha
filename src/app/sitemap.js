import { encodeId } from "@/lib/hashids";

// Revalidate this sitemap every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. Define your static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/authors`,
      changeFrequency: 'weekly',
      priority: 0.8, // Bumped slightly as it's a primary directory
    },
    {
      url: `${baseUrl}/articles`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Fetch dynamic products
  let articlesRoutes = [];
  
  try {
    const response = await fetch(`${apiUrl}/articles/sitemap`);
    
    if (response.ok) {
      const {data: products} = await response.json();
      
      // Map your API response to the sitemap format
      articlesRoutes = products.map((product) => ({
        // Adjust 'product.id' to 'product.slug' if your URLs use slugs
        url: `${baseUrl}/articles/${product.slug}`, 
        // Use the product's updated_at date if available, otherwise fallback to current date
        lastModified: product.updated_at || new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.6,
      }));
    } else {
      console.error("Failed to fetch products for sitemap:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    // If the fetch fails, it will gracefully fallback to just returning the static routes
  }

  let authorRoutes = [];
  
  try {
    const response = await fetch(`${apiUrl}/authors/sitemap`);
    
    if (response.ok) {
      const {data: authors} = await response.json();
      
      // Map your API response to the sitemap format
      authorRoutes = authors.map((author) => ({
        // Adjust 'product.id' to 'product.slug' if your URLs use slugs
        url: `${baseUrl}/authors/${encodeId(author.id)}`, 
        // Use the product's updated_at date if available, otherwise fallback to current date
        lastModified: author.updated_at || new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.6,
      }));
    } else {
      console.error("Failed to fetch products for sitemap:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    // If the fetch fails, it will gracefully fallback to just returning the static routes
  }

  // 3. Combine and return
  return [...staticRoutes, ...articlesRoutes, ...authorRoutes];
}