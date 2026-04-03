const BASE_COUNT = 50; // Starting offset to make the site look established

export async function onRequest(context) {
  const { env } = context;
  
  try {
    // If KV is not bound (common in local dev), return a mock value
    if (!env.STATS_KV) {
      return new Response(JSON.stringify({ total: BASE_COUNT + 1337, warning: 'KV not bound - Mock Value used' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const countStr = await env.STATS_KV.get('total_recaps');
    const total = parseInt(countStr || '0', 10);
    
    // Add the base offset to the real count
    const finalTotal = total + BASE_COUNT;
    
    return new Response(JSON.stringify({ total: finalTotal }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ total: BASE_COUNT, error: err.message }), {
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


