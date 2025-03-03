import { DocMeta } from './docs';

/**
 * Interface for search result
 */
export interface SearchResult extends DocMeta {
  excerpt?: string;
  matchType: 'title' | 'description' | 'category' | 'content' | 'partial';
  relevanceScore: number;
  contentPreview?: string;
}

/**
 * Interface for document with content
 */
export interface DocWithContent extends DocMeta {
  content: string;
}

/**
 * Client-side search through provided docs
 * This function works on the client side with pre-loaded docs
 * @param query Search query
 * @param docs Array of docs to search through
 * @param docsContent Optional map of document content by slug
 * @returns Array of search results
 */
export function searchDocs(
  query: string, 
  docs: DocMeta[], 
  docsContent?: Map<string, string>
): SearchResult[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
  const results: SearchResult[] = [];
  
  // If no valid search terms, return empty results
  if (queryTerms.length === 0) {
    return [];
  }

  // Search through all docs
  for (const doc of docs) {
    const title = doc.title.toLowerCase();
    const description = (doc.description || '').toLowerCase();
    const category = (doc.category || '').toLowerCase();
    const content = docsContent?.get(doc.slug)?.toLowerCase() || '';
    
    // Check for exact matches in title (highest priority)
    if (title.includes(normalizedQuery)) {
      results.push({
        ...doc,
        matchType: 'title',
        relevanceScore: 100,
        excerpt: highlightMatch(doc.title, normalizedQuery)
      });
      continue; // Skip further checks for this doc
    }
    
    // Check for exact matches in description (high priority)
    if (description.includes(normalizedQuery)) {
      results.push({
        ...doc,
        matchType: 'description',
        relevanceScore: 80,
        excerpt: highlightMatch(doc.description || '', normalizedQuery)
      });
      continue; // Skip further checks for this doc
    }
    
    // Check for exact matches in category (medium priority)
    if (category.includes(normalizedQuery)) {
      results.push({
        ...doc,
        matchType: 'category',
        relevanceScore: 70,
        excerpt: `Category: ${highlightMatch(doc.category || '', normalizedQuery)}`
      });
      continue; // Skip further checks for this doc
    }
    
    // Check for exact matches in content (medium-high priority)
    if (content && content.includes(normalizedQuery)) {
      const excerpt = createExcerptFromContent(content, normalizedQuery);
      results.push({
        ...doc,
        matchType: 'content',
        relevanceScore: 75,
        excerpt: excerpt
      });
      continue; // Skip further checks for this doc
    }
    
    // Check for partial matches (all terms must match somewhere)
    let allTermsMatch = true;
    let matchScore = 0;
    let contentMatches = 0;
    let contentMatchPositions: number[] = [];
    
    for (const term of queryTerms) {
      const titleMatch = title.includes(term);
      const descMatch = description.includes(term);
      const catMatch = category.includes(term);
      const contentMatch = content && content.includes(term);
      
      if (!(titleMatch || descMatch || catMatch || contentMatch)) {
        allTermsMatch = false;
        break;
      }
      
      // Add to match score based on where the term was found
      matchScore += titleMatch ? 10 : 0;
      matchScore += descMatch ? 5 : 0;
      matchScore += catMatch ? 3 : 0;
      
      // Track content matches for excerpt creation
      if (contentMatch) {
        contentMatches++;
        const pos = content.indexOf(term);
        if (pos !== -1) {
          contentMatchPositions.push(pos);
        }
      }
    }
    
    if (allTermsMatch) {
      // Create an excerpt that shows the context of the match
      let excerpt = '';
      
      // Prefer description for excerpt if it exists and contains any term
      if (doc.description && queryTerms.some(term => description.includes(term))) {
        excerpt = createExcerptWithTerms(doc.description, queryTerms);
      } else if (queryTerms.some(term => title.includes(term))) {
        excerpt = `Title contains: ${highlightTerms(doc.title, queryTerms)}`;
      } else if (doc.category && queryTerms.some(term => category.includes(term))) {
        excerpt = `Category: ${highlightTerms(doc.category, queryTerms)}`;
      }
      
      // If we have content matches, add a content preview
      let contentPreview = '';
      if (contentMatches > 0 && content && contentMatchPositions.length > 0) {
        // Find the best position (average of all matches)
        const avgPos = contentMatchPositions.reduce((sum, pos) => sum + pos, 0) / contentMatchPositions.length;
        contentPreview = createContentPreview(content, Math.floor(avgPos), queryTerms);
        
        // If no other excerpt, use content preview as excerpt
        if (!excerpt) {
          excerpt = contentPreview;
        }
      }
      
      results.push({
        ...doc,
        matchType: 'partial',
        relevanceScore: 50 + matchScore + (contentMatches * 2), // Base score + match score + content bonus
        excerpt,
        contentPreview: contentPreview || undefined
      });
    }
  }
  
  // Sort results by relevance score (highest first)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Creates a content preview from a specific position in the content
 * @param content The full content
 * @param position The position to center the preview around
 * @param terms Search terms to highlight
 * @returns A formatted content preview with highlighted terms
 */
function createContentPreview(content: string, position: number, terms: string[]): string {
  const previewLength = 100;
  const startIndex = Math.max(0, position - previewLength / 2);
  const endIndex = Math.min(content.length, position + previewLength / 2);
  
  let preview = content.substring(startIndex, endIndex);
  
  // Add ellipsis if needed
  if (startIndex > 0) preview = '...' + preview;
  if (endIndex < content.length) preview += '...';
  
  // Highlight all terms in the preview
  return highlightTerms(preview, terms);
}

/**
 * Creates an excerpt from content for an exact match
 * @param content The full content
 * @param match The exact match string
 * @returns An excerpt with the match highlighted
 */
function createExcerptFromContent(content: string, match: string): string {
  const matchIndex = content.toLowerCase().indexOf(match.toLowerCase());
  if (matchIndex === -1) return '';
  
  const contextLength = 60;
  const startIndex = Math.max(0, matchIndex - contextLength);
  const endIndex = Math.min(content.length, matchIndex + match.length + contextLength);
  
  let excerpt = content.substring(startIndex, endIndex);
  
  // Add ellipsis if needed
  if (startIndex > 0) excerpt = '...' + excerpt;
  if (endIndex < content.length) excerpt += '...';
  
  // Highlight the match
  return highlightMatch(excerpt, match);
}

/**
 * Highlights a match in a text string
 * @param text The text to search in
 * @param match The string to match and highlight
 * @returns Text with match highlighted using markdown bold syntax
 */
function highlightMatch(text: string, match: string): string {
  if (!text || !match) return text;
  
  const regex = new RegExp(`(${escapeRegExp(match)})`, 'gi');
  return text.replace(regex, '**$1**');
}

/**
 * Highlights multiple terms in a text string
 * @param text The text to search in
 * @param terms Array of terms to highlight
 * @returns Text with terms highlighted using markdown bold syntax
 */
function highlightTerms(text: string, terms: string[]): string {
  if (!text || !terms.length) return text;
  
  let result = text;
  for (const term of terms) {
    if (term.length < 2) continue; // Skip very short terms
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    result = result.replace(regex, '**$1**');
  }
  return result;
}

/**
 * Creates an excerpt with context around matched terms
 * @param text The full text
 * @param terms Array of terms to find in the text
 * @returns An excerpt with context around the first matched term
 */
function createExcerptWithTerms(text: string, terms: string[]): string {
  if (!text || !terms.length) return text;
  
  // Find the first term that appears in the text
  let firstMatchTerm = '';
  let firstMatchIndex = text.length;
  
  for (const term of terms) {
    const index = text.toLowerCase().indexOf(term);
    if (index !== -1 && index < firstMatchIndex) {
      firstMatchIndex = index;
      firstMatchTerm = term;
    }
  }
  
  if (!firstMatchTerm) return text;
  
  // Create excerpt around the first match
  const contextLength = 50;
  const startIndex = Math.max(0, firstMatchIndex - contextLength);
  const endIndex = Math.min(text.length, firstMatchIndex + firstMatchTerm.length + contextLength);
  
  let excerpt = text.substring(startIndex, endIndex);
  
  // Add ellipsis if needed
  if (startIndex > 0) excerpt = '...' + excerpt;
  if (endIndex < text.length) excerpt += '...';
  
  // Highlight all terms in the excerpt
  return highlightTerms(excerpt, terms);
}

/**
 * Escapes special characters in a string for use in a regular expression
 * @param string The string to escape
 * @returns Escaped string safe for regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
} 