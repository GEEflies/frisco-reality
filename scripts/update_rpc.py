"""Update claim_pending_images RPC to support re-enhancement."""
import urllib.request, json

sql = (
    "CREATE OR REPLACE FUNCTION claim_pending_images(batch_limit INT DEFAULT 1) "
    "RETURNS SETOF listing_images AS $$ "
    "BEGIN "
    "    RETURN QUERY "
    "    WITH candidates AS ( "
    "        SELECT id "
    "        FROM listing_images "
    "        WHERE enhancement_status = 'pending' "
    "        ORDER BY created_at ASC "
    "        LIMIT batch_limit "
    "        FOR UPDATE SKIP LOCKED "
    "    ) "
    "    UPDATE listing_images li "
    "    SET enhancement_status = 'processing' "
    "    FROM candidates c "
    "    WHERE li.id = c.id "
    "    RETURNING li.*; "
    "END; "
    "$$ LANGUAGE plpgsql SECURITY DEFINER;"
)

project_ref = "fcvswlurtchqorgnwclw"
api_token = "***REDACTED_SUPABASE_TOKEN***"

url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"
data = json.dumps({"query": sql}).encode()
req = urllib.request.Request(url, data=data, method="POST",
    headers={
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json",
        "User-Agent": "supabase-cli/1.0"
    })

try:
    resp = urllib.request.urlopen(req)
    print("OK:", resp.read().decode()[:500])
except Exception as e:
    if hasattr(e, 'read'):
        print("Error:", e.read().decode()[:500])
    else:
        print("Error:", e)
