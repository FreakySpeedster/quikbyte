export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  try {
    // Parse the URL and get the path
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, '');
    
    // Build the target URL with query parameters
    const targetUrl = new URL(`/api${path}`, 'https://orderfoodonline.deno.dev');
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });
    
    // Get request method
    const method = request.method;
    
    // Prepare headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Create options for fetch
    const options = {
      method,
      headers,
      body: ['GET', 'HEAD'].includes(method) ? undefined : await request.text(),
    };
    
    // Make the request to the target API
    const response = await fetch(targetUrl.toString(), options);
    
    // Get the response data
    const responseData = await response.json();
    
    // Return the response
    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data from API' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}