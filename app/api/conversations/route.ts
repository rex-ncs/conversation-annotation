import { createConversation, getConversationById } from '@/app/actions/conversations';

export async function POST(request: Request) {
  try {
    // Parse multipart/form-data to get the file
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file uploaded." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const filename = file.name.replace(/\.[^/.]+$/, ""); // Remove extension for id

    // Check if conversation with this id already exists
    const existing = await getConversationById(filename);
    if (existing) {
      return new Response(
        JSON.stringify({ error: "Conversation with this id already exists." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Read file content as JSON
    const text = await file.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON file." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate 'messages'
    if (!json.messages || !Array.isArray(json.messages)) {
      return new Response(
        JSON.stringify({ error: "'messages' key missing or not an array." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    for (const msg of json.messages) {
      if (
        typeof msg !== 'object' ||
        !('role' in msg) ||
        !('content' in msg)
      ) {
        return new Response(
          JSON.stringify({ error: "Each message must have 'role' and 'content'." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Create conversation
    const result = await createConversation(filename, json.messages);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Conversation created.", conversation: result.conversation }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid request or server error." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}