/**
 * Debug Helper - Check what the frontend is actually receiving
 */

// Simulate what the frontend receives when the API responds
const mockBackendResponse = {
  "success": true,
  "message": "According to the knowledge base context...trust is defined as a mutual reliance...",
  "context": "[1] Trust...[2] Trust...",
  "context_items": [
    {
      "id": "a165fee8-b0d0-418b-a1df-1d27b14b9132",
      "title": "Trust",
      "node_type": "value",
      "attachments": []
    },
    {
      "id": "f1b0ce0c-0087-4bf3-baa1-bdd08b6f124f",
      "title": "Trust",
      "node_type": "value",
      "attachments": [
        {
          "id": "53205fd8-56f8-47d5-aca6-5bcfee98300d",
          "file_name": "trust.png",
          "file_type": "image/png",
          "file_path": "uploads/48372c35_1770218864_trust.png"
        },
        {
          "id": "2ac1b2a1-ade8-4ae4-9cb6-f4e06f8fbbc9",
          "file_name": "trust.png",
          "file_type": "image/png",
          "file_path": "uploads/48372c35_1770218864_trust.png"
        }
      ]
    }
  ],
  "context_count": 2,
  "timestamp": "2026-02-05T10:37:00"
};

console.log("=== FRONTEND DEBUGGING ===\n");
console.log("1. Response received from API:");
console.log(`   - success: ${mockBackendResponse.success}`);
console.log(`   - message length: ${mockBackendResponse.message.length}`);
console.log(`   - context_items count: ${mockBackendResponse.context_items?.length || 0}`);
console.log(`   - context_items is null/undefined: ${mockBackendResponse.context_items === null || mockBackendResponse.context_items === undefined}`);

const response = mockBackendResponse;

// Simulate creating the assistant message in App.tsx
const assistantMessage = {
  id: (Date.now() + 1).toString(),
  role: 'assistant',
  content: response.message,
  context_items: response.context_items,
  context: response.context,
  timestamp: response.timestamp,
};

console.log("\n2. Assistant message created:");
console.log(`   - message.context_items: ${assistantMessage.context_items}`);
console.log(`   - message.context_items is array: ${Array.isArray(assistantMessage.context_items)}`);
console.log(`   - message.context_items.length: ${assistantMessage.context_items?.length || 'undefined'}`);

// Simulate ChatMessage component rendering images
if (assistantMessage.context_items && Array.isArray(assistantMessage.context_items)) {
  console.log("\n3. Processing context_items in ChatMessage:");
  
  const images = assistantMessage.context_items.flatMap((item) => 
    item.attachments?.filter(att => att.file_type?.startsWith('image/')) || []
  );
  
  console.log(`   - Total attachments across all items: ${assistantMessage.context_items.flatMap(i => i.attachments || []).length}`);
  console.log(`   - Images found by filter: ${images.length}`);
  
  images.forEach((img, idx) => {
    const fileNameOnly = img.file_path?.split('/').pop();
    console.log(`   - Image ${idx + 1}: /uploads/${fileNameOnly}`);
  });
  
  // Check the rendering condition
  const isUser = false;
  const context_items = assistantMessage.context_items;
  
  const shouldRender = !isUser && context_items && context_items.length > 0;
  console.log(`\n4. Rendering condition:
   - !isUser: ${!isUser}
   - context_items truthy: ${!!context_items}
   - context_items.length > 0: ${context_items?.length > 0}
   - Overall: ${shouldRender}`);
  
  if (shouldRender && images.length > 0) {
    console.log(`\n✓ IMAGES SHOULD DISPLAY`);
  } else if (shouldRender && images.length === 0) {
    console.log(`\n✗ ISSUE: context_items exist but NO images found`);
    console.log(`   Check: Are attachments present in context_items?`);
    assistantMessage.context_items.forEach((item, idx) => {
      console.log(`    Item ${idx}: attachments = ${item.attachments?.length || 0}`);
      if (item.attachments && item.attachments.length > 0) {
        item.attachments.forEach(att => {
          console.log(`      - ${att.file_name} (type: ${att.file_type})`);
        });
      }
    });
  } else {
    console.log(`\n✗ ISSUE: Rendering condition failed`);
    console.log(`   context_items is: ${assistantMessage.context_items}`);
  }
} else {
  console.log("\n✗ ISSUE: context_items is not an array or doesn't exist");
  console.log(`   context_items value: ${assistantMessage.context_items}`);
  console.log(`   typeof: ${typeof assistantMessage.context_items}`);
}
