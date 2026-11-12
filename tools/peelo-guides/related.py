"""Hand-picked "Related guides" for each Peelo guide: slug -> [(slug, why it's related)].
gen_guides.py renders these above the full guide list and fails if a slug doesn't exist."""
R = {
    "remove-bg-alternative": [
        ("remove-bg-shutting-down", "the date, what to save first and a pre-cutoff checklist"),
        ("remove-background-full-resolution-free", "why Peelo can export full resolution without charging"),
        ("remove-background-without-uploading", "how in-browser processing works and how to verify it"),
    ],
    "remove-bg-shutting-down": [
        ("remove-bg-alternative", "Peelo, Canva and Photoroom compared side by side"),
        ("bulk-background-remover", "if you relied on remove.bg for batches"),
        ("make-background-transparent", "the everyday job: a transparent PNG from any photo"),
    ],
    "white-background-amazon-product-photo": [
        ("remove-background-shopify-product-photos", "the same photos, sized and padded for your own store"),
        ("ebay-white-background-photos", "if you list the same items on eBay, without installing an app"),
        ("bulk-background-remover", "do a whole catalogue with one set of settings"),
    ],
    "remove-background-for-etsy": [
        ("remove-background-shopify-product-photos", "square product images for your own store"),
        ("white-background-amazon-product-photo", "the stricter pure-white main image rules"),
        ("bulk-background-remover", "process a whole shop's photos in one run"),
    ],
    "remove-background-shopify-product-photos": [
        ("white-background-amazon-product-photo", "if you sell on Amazon too"),
        ("ebay-white-background-photos", "if you sell on eBay too"),
        ("remove-background-for-etsy", "if you sell on Etsy too"),
    ],
    "transparent-background-logo": [
        ("remove-white-background", "white backgrounds on scans and product shots too"),
        ("make-background-transparent", "for photos rather than flat artwork"),
        ("remove-background-from-signature", "the same technique for a photographed signature"),
    ],
    "remove-background-from-signature": [
        ("transparent-background-logo", "the same technique for flat artwork"),
        ("remove-white-background", "other images on white paper or backgrounds"),
        ("remove-background-without-uploading", "why a signature shouldn't go to a server"),
    ],
    "remove-background-without-uploading": [
        ("remove-background-from-signature", "a good example of an image to keep private"),
        ("linkedin-headshot-background", "tidy a photo of yourself without uploading it"),
        ("remove-background-full-resolution-free", "why running on your device also means free full resolution"),
    ],
    "linkedin-headshot-background": [
        ("remove-background-without-uploading", "how your photo stays on your device"),
        ("remove-background-full-resolution-free", "keep your headshot sharp"),
        ("make-background-transparent", "if you'd rather place it on your own background"),
    ],
    "remove-background-pet-photo": [
        ("make-background-transparent", "transparent PNGs for stickers and gifts"),
        ("remove-background-full-resolution-free", "keep enough resolution for prints"),
        ("remove-background-car-photo", "another subject with tricky edges and shadows"),
    ],
    "remove-background-car-photo": [
        ("remove-background-full-resolution-free", "keep your listing photos at full resolution"),
        ("bulk-background-remover", "several photos of one car, same settings"),
        ("make-background-transparent", "a transparent PNG to place on your own background"),
    ],
    "remove-background-full-resolution-free": [
        ("remove-background-without-uploading", "what running on your device means for privacy"),
        ("remove-bg-alternative", "how this compares with paid HD downloads elsewhere"),
        ("make-background-transparent", "the simplest way to try it"),
    ],
    "bulk-background-remover": [
        ("white-background-amazon-product-photo", "the settings for Amazon main images"),
        ("ebay-white-background-photos", "the settings for eBay listings, resized to 1600 px"),
        ("remove-background-for-etsy", "the settings for Etsy listings"),
    ],
    "make-background-transparent": [
        ("remove-white-background", "if your background is plain white"),
        ("transparent-background-logo", "if it's a logo or flat artwork"),
        ("remove-background-full-resolution-free", "why your PNG stays at full resolution"),
    ],
    "remove-white-background": [
        ("transparent-background-logo", "avoid white halos around logos"),
        ("remove-background-from-signature", "signatures photographed on paper"),
        ("make-background-transparent", "for photos with a busier background"),
    ],
    "ebay-white-background-photos": [
        ("white-background-amazon-product-photo", "Amazon's stricter pure-white main image rules"),
        ("bulk-background-remover", "a whole folder of listing photos, resized to 1600 px"),
        ("remove-background-shopify-product-photos", "the same photos for your own store"),
    ],
}
