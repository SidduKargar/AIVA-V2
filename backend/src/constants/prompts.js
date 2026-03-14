export const PROMPTS = {
  RESPONSE_FORMAT: (prompt) =>
    `Please provide your response in a clear format. Only use markdown when it's necessary for better clarity, such as for code snippets, tables, or lists. For example, if you include code, please format it within code blocks. Similarly, use tables for structured data when appropriate. Here's the request: ${prompt}`,

  DOCUMENT_CONTEXT: (documentName, context) =>
    `You are answering questions about the document "${documentName}". Here are the most relevant sections from the document to help you provide an accurate response:\n\n${context}`,

  DOCUMENT_FALLBACK: (content) =>
    `Context from the document:\n${content}`,

  SVG_GENERATION: (prompt) => `
    Generate a detailed SVG image of ${prompt} with realistic proportions and accurate details. The image should:

    1. Use precise vector paths to capture the natural contours and shapes
    2. Incorporate appropriate lighting and shading through gradient fills to create depth
    3. Maintain accurate proportions and scale relationships between all elements
    4. Use a color palette that reflects natural/realistic tones
    5. Include fine details that enhance realism
    6. Be optimized for web display with clean, efficient SVG code
    7. Have a viewBox dimension of "0 0 800 600"
    8. Use appropriate grouping (<g>) elements to organize related components

    Please provide ONLY the complete SVG code wrapped in <svg> tags with all necessary attributes and ensure all paths are properly closed. The final image should be visually accurate and realistic.
    `,

  IMAGE_OCR_REFINE: (text) => `
    I have extracted text from an image using OCR. Please:
    1. Fix any obvious OCR errors
    2. Correct spelling and grammar
    3. Properly format paragraphs and spacing
    4. Maintain the original meaning and structure
    5. Ensure the text is clear and easy to read
    6. Remove any unnecessary information
    7. Make the text more engaging and interesting
    8. Keep the text relevant to the image content
    9. Read the text carefully if it is type of card return it like card in markdown
    10. Read the text carefully if it is type of resume return it like resume in markdown
    
    Original text:
    ${text}
    
    Enhanced version:`,

  CODE_SEARCH: (language, query) => `
    Act as a senior developer. I need help with code in ${language}.
    Query: ${query}

    Please provide:
    1. A detailed, production-ready code solution
    2. Brief explanation of how the code works
    3. Best practices and considerations
    4. Example usage if applicable

    Return the response in markdown format with proper code blocks.
    `,

  DOCS_SEARCH: (query) => `
    Act as a technical documentation expert. I need information about:
    ${query}

    Please provide:
    1. Detailed explanation
    2. Key concepts
    3. Common use cases
    4. Best practices
    5. Examples if applicable

    Return the response in well-formatted markdown.
    `,
};
