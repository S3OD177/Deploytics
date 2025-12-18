// Archive duplicate Polar.sh products (since DELETE isn't allowed)

const POLAR_TOKEN = "polar_oat_Zc7ytaRUmShreDqrPwtaeUT5lTyGIIQy0NWOu2nGtK7";

// IDs to archive (old duplicates)
const toArchive = [
    "4156f4df-0593-4ee7-a1c0-115b730264bd", // Old Pro
    "901dae8c-91e2-4ac7-85d3-d60f94851808", // Old Enterprise
];

// IDs to KEEP
const KEEP = {
    pro: "cd0c6946-2769-4f97-98cd-320bd3af5e51",
    enterprise: "804a3305-cfef-4e61-8254-69ff2a746f30",
    addon: "4b25a12a-28b5-4d84-9bbe-5d1e5cf3d02e",
};

async function main() {
    console.log("📦 Archiving duplicate products...\n");

    for (const id of toArchive) {
        const res = await fetch(`https://api.polar.sh/v1/products/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${POLAR_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_archived: true }),
        });

        if (res.ok) {
            console.log(`✅ Archived ${id}`);
        } else {
            const text = await res.text();
            console.log(`❌ Failed to archive ${id}: ${text.substring(0, 100)}`);
        }
    }

    console.log("\n📋 Final .env.local values:\n");
    console.log(`POLAR_ACCESS_TOKEN=${POLAR_TOKEN}`);
    console.log(`POLAR_PRO_PRODUCT_ID=${KEEP.pro}`);
    console.log(`POLAR_ENTERPRISE_PRODUCT_ID=${KEEP.enterprise}`);
    console.log(`POLAR_ADDON_5_PRODUCT_ID=${KEEP.addon}`);
}

main().catch(console.error);
