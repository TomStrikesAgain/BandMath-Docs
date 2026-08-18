const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const turndownService = new TurndownService();

async function fetchDocuments() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/legal_documents`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch documents: ${res.statusText}`);
    }

    const docs = await res.json();
    
    let privacyHtml = '';
    let tosHtml = '';
    let appleTermsHtml = '';

    docs.forEach(doc => {
      if (doc.id === 'privacy') privacyHtml = doc.html_body;
      if (doc.id === 'tos') tosHtml = doc.html_body;
      if (doc.id === 'apple_terms') appleTermsHtml = doc.html_body;
    });

    // Generate Privacy Policy
    const privacyMd = turndownService.turndown(privacyHtml);
    const privacyContent = `---
sidebar_position: 100
title: Privacy Policy
---
# Privacy Policy

${privacyMd}
`;
    fs.writeFileSync(path.resolve(__dirname, '../docs/Privacy_Policy.md'), privacyContent);

    // Generate Terms of Service
    const tosMd = turndownService.turndown(tosHtml);
    const tosContent = `---
sidebar_position: 98
title: Terms & Conditions
---
# Terms & Conditions

${tosMd}
`;
    fs.writeFileSync(path.resolve(__dirname, '../docs/98_Terms_of_Service.md'), tosContent);

    console.log('Successfully synced legal documents from Supabase.');
  } catch (err) {
    console.error('Error fetching legal documents:', err);
    process.exit(1);
  }
}

fetchDocuments();
