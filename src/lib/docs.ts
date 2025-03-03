import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import 'server-only';

/**
 * Interface for document metadata
 */
export interface DocMeta {
  title: string;
  description?: string;
  category?: string;
  order?: number;
  slug: string;
  path: string;
}

/**
 * Interface for document content
 */
export interface DocContent extends DocMeta {
  content: string;
}

/**
 * Interface for search result
 */
export interface SearchResult extends DocMeta {
  excerpt?: string;
}

// Path to the docs directory
const DOCS_DIRECTORY = path.join(process.cwd(), 'content/docs');

/**
 * Get all documentation files
 * @returns Array of document metadata
 */
export async function getAllDocs(): Promise<DocMeta[]> {
  // Check if the directory exists
  if (!fs.existsSync(DOCS_DIRECTORY)) {
    console.warn(`Docs directory not found: ${DOCS_DIRECTORY}`);
    return [];
  }

  // Get all markdown files
  const fileNames = fs.readdirSync(DOCS_DIRECTORY)
    .filter(fileName => /\.md$/.test(fileName));

  const docs = fileNames.map(fileName => {
    // Remove the .md extension to get the slug
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(DOCS_DIRECTORY, fileName);
    
    // Read the markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the frontmatter
    const { data } = matter(fileContents);
    
    // Return the document metadata
    return {
      title: data.title || slug,
      description: data.description || '',
      category: data.category || 'Uncategorized',
      order: data.order || 999,
      slug,
      path: `/docs/${slug}`,
    };
  });

  // Sort by order
  return docs.sort((a, b) => {
    // First sort by category
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    
    // Then sort by order
    return (a.order || 999) - (b.order || 999);
  });
}

/**
 * Get a specific document by slug
 * @param slug Document slug
 * @returns Document content or null if not found
 */
export async function getDocBySlug(slug: string): Promise<DocContent | null> {
  try {
    const filePath = path.join(DOCS_DIRECTORY, `${slug}.md`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    // Read the markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the frontmatter and content
    const { data, content } = matter(fileContents);
    
    // Return the document content
    return {
      title: data.title || slug,
      description: data.description || '',
      category: data.category || 'Uncategorized',
      order: data.order || 999,
      slug,
      path: `/docs/${slug}`,
      content,
    };
  } catch (error) {
    console.error(`Error getting doc by slug: ${slug}`, error);
    return null;
  }
}

/**
 * Get documents by category
 * @param category Category name
 * @returns Array of documents in the category
 */
export async function getDocsByCategory(category: string): Promise<DocMeta[]> {
  const docs = await getAllDocs();
  return docs.filter(doc => doc.category === category);
}

/**
 * Get all categories
 * @returns Array of category names
 */
export async function getAllCategories(): Promise<string[]> {
  const categoriesSet = new Set<string>();
  
  const docs = await getAllDocs();
  docs.forEach(doc => {
    if (doc.category) {
      categoriesSet.add(doc.category);
    }
  });
  
  return Array.from(categoriesSet);
}

/**
 * Search through all documents
 * @param query Search query
 * @returns Array of search results
 */
export async function searchDocs(query: string): Promise<SearchResult[]> {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Get all markdown files
  const fileNames = fs.readdirSync(DOCS_DIRECTORY)
    .filter(fileName => /\.md$/.test(fileName));

  for (const fileName of fileNames) {
    // Remove the .md extension to get the slug
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(DOCS_DIRECTORY, fileName);
    
    // Read the markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the frontmatter and content
    const { data, content } = matter(fileContents);
    
    const title = data.title || slug;
    const description = data.description || '';
    const category = data.category || 'Uncategorized';
    
    // Check if the query matches the title, description, or content
    const titleMatch = title.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = description.toLowerCase().includes(normalizedQuery);
    const contentMatch = content.toLowerCase().includes(normalizedQuery);
    
    if (titleMatch || descriptionMatch || contentMatch) {
      // Create an excerpt from the content if there's a content match
      let excerpt = '';
      if (contentMatch) {
        const contentLower = content.toLowerCase();
        const queryIndex = contentLower.indexOf(normalizedQuery);
        
        // Get a snippet of text around the match
        const startIndex = Math.max(0, queryIndex - 50);
        const endIndex = Math.min(content.length, queryIndex + normalizedQuery.length + 50);
        excerpt = content.substring(startIndex, endIndex);
        
        // Add ellipsis if we're not at the beginning or end
        if (startIndex > 0) {
          excerpt = '...' + excerpt;
        }
        if (endIndex < content.length) {
          excerpt = excerpt + '...';
        }
        
        // Highlight the match
        const highlightedExcerpt = excerpt.replace(
          new RegExp(normalizedQuery, 'gi'),
          match => `**${match}**`
        );
        
        excerpt = highlightedExcerpt;
      }
      
      results.push({
        title,
        description,
        category,
        order: data.order || 999,
        slug,
        path: `/docs/${slug}`,
        excerpt: excerpt || undefined,
      });
    }
  }
  
  // Sort results by relevance (title match > description match > content match)
  return results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    const bTitleMatch = b.title.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    
    if (aTitleMatch !== bTitleMatch) {
      return bTitleMatch - aTitleMatch;
    }
    
    const aDescMatch = a.description?.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    const bDescMatch = b.description?.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    
    if (aDescMatch !== bDescMatch) {
      return bDescMatch - aDescMatch;
    }
    
    // If all else is equal, sort by category and order
    if (a.category !== b.category) {
      return (a.category || '').localeCompare(b.category || '');
    }
    
    return (a.order || 999) - (b.order || 999);
  });
} 