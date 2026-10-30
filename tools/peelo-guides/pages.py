"""Guide page content. Each page: slug, title (<=60), description (<=155), crumb, h1, lede, cta,
body (HTML), steps (list of HTML), faqs [(q, a)], sources [(title, url, note)]."""

PAGES = [
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-bg-alternative",
title="remove.bg Alternative: Free, Full-Res, No Upload | Peelo",
og_title="remove.bg is closing on 1 Dec 2026. A free alternative that never uploads",
description="remove.bg's standalone service ends 1 Dec 2026. Compare Peelo, Canva and Photoroom on price, signup, uploads and quality, and how to switch.",
crumb="remove.bg alternative",
h1="A free remove.bg alternative that never uploads your photos",
lede="remove.bg's own pricing page says its standalone service ends on <strong>1 December 2026</strong> and moves into Canva. If you used it for quick cutouts, here's an honest look at your options, including where this free tool is weaker.",
cta=dict(href="", label="Remove a background now", note="Free, full resolution, no account. The AI runs in your browser."),
body="""
<h2>What's happening with remove.bg</h2>
<p>remove.bg's pricing page states that the standalone remove.bg service ends on 1 December 2026 and that background removal moves into Canva. That's all we're claiming here. For anything that affects your account, like remaining credits, refunds, invoices or the API, read remove.bg's own notice and FAQ and act before the cutoff. In particular, download any invoices you need while your account is still open.</p>
<p>If you only need to cut a subject out of a photo now and then, you don't have to pick a new subscription today. Most people fall into one of three groups:</p>
<ul>
<li><strong>Already on Canva Pro or Teams:</strong> use Canva's Background Remover. It's included with paid plans, and it's where remove.bg is going.</li>
<li><strong>Doing product photos in volume:</strong> look at Photoroom or another tool with batch editing. Check its current pricing for full-resolution exports.</li>
<li><strong>Doing the occasional cutout, or needing privacy:</strong> use a free in-browser tool like Peelo. Nothing is uploaded and there's no account.</li>
</ul>

<h2>Side-by-side comparison</h2>
<div class="table-wrap">
<table class="compare-table">
<thead><tr><th></th><th>Peelo</th><th>remove.bg (until 1 Dec 2026)</th><th>Canva Background Remover</th><th>Photoroom</th></tr></thead>
<tbody>
<tr><th>Full-resolution download</th><td>Free (up to 16 MP)</td><td>Credits or subscription</td><td>Included with paid Canva plans</td><td>Paid plan for full quality; the free plan has limits</td></tr>
<tr><th>Account needed</th><td>No</td><td>Yes, for HD</td><td>Yes</td><td>Yes, for most features</td></tr>
<tr><th>Is your photo uploaded?</th><td>No. It's processed on your device</td><td>Yes (server)</td><td>Yes (server)</td><td>Yes (server)</td></tr>
<tr><th>Batch</th><td>3 photos free; up to 200 per run with Batch Pro ($19 once, no subscription)</td><td>Yes (paid)</td><td>Check Canva's current features</td><td>Yes, on paid plans</td></tr>
<tr><th>Manual touch-up</th><td>Erase and restore brush</td><td>Erase and restore</td><td>Erase and restore brush</td><td>Yes</td></tr>
<tr><th>Quality notes</th><td>On-device IS-Net model at 1024 px, plus automatic clean-up of leftover background text and specks. Strong on single clear subjects; fine hair, glass and crowded scenes are the hardest cases</td><td>Large server model, strong on hair</td><td>Large server model</td><td>Large server model, tuned for products</td></tr>
</tbody>
</table>
</div>
<p class="fine">Accurate as far as we could check on 29 October 2026. Prices and plans change, so confirm on each vendor's pricing page before you buy anything.</p>

<h2>Where Peelo is genuinely good, and where it isn't</h2>
<p>Peelo runs an open-source segmentation model (IS-Net, Apache-2.0) directly in your browser, on your graphics chip when the browser supports WebGPU. The model looks at a 1024 × 1024 copy of your photo; a clean-up pass then drops leftover background text and specks, which most background removers leave behind, and the mask is applied to your <em>original</em> pixels. Your download keeps the full resolution of the photo you added.</p>
<p>It handles one clear subject well: a product on a table, a person, a pet, a car or a mug. It struggles where big server models shine, with wispy hair against a busy background, wine glasses and scenes with several overlapping subjects. For those you'll either fix the edges with the Refine brush or use a server tool. We'd rather say that up front than have you find out on a deadline.</p>
<p>What you get in exchange is privacy (photos never leave your device), no account, no credits and no watermark. After the first visit it also works offline. You can install it from your browser menu as an app.</p>

<h2>Features remove.bg users ask about</h2>
<ul>
<li><strong>White or coloured backgrounds:</strong> pick white, any colour, a blurred version of the original, or your own image.</li>
<li><strong>Marketplace photos:</strong> one click gives a pure white background on a square canvas with the product centred at 85% fill.</li>
<li><strong>Logos and signatures:</strong> a "Plain background" method keys out flat white or solid colours. For flat artwork it's often cleaner than AI.</li>
<li><strong>PNG or JPG:</strong> PNG keeps transparency; JPG is smaller and flattens onto your chosen background.</li>
</ul>
""",
steps_title="How to switch in two minutes",
steps=[
"<strong>Save what you need from remove.bg first.</strong> Download past results and invoices before 1 December 2026, and read its notice about your credits or plan.",
"<strong>Open <a href=\"../\">Peelo</a></strong> and drop in a photo you'd normally have sent to remove.bg. The first run downloads the AI model once (about 91 MB). After that it loads from your browser cache.",
"<strong>Check the edges</strong> with the before/after slider. If something's off, switch to <em>Refine edges</em> and use Erase or Restore.",
"<strong>Choose the output:</strong> transparent PNG, or JPG on white or any colour. For listings, use <em>Marketplace photo</em>.",
"<strong>Download.</strong> The file keeps your photo's original pixel dimensions (up to 16 MP).",
"<strong>Optional:</strong> install Peelo from your browser's menu (\"Install app\" or \"Add to Home Screen\") so it's one tap away and works offline.",
],
faqs=[
("When does remove.bg shut down?", "remove.bg's pricing page says its standalone service ends on 1 December 2026 and moves into Canva. Check remove.bg's own notice for details about credits, plans and the API."),
("Is Peelo really free at full resolution?", "Yes. Single images download free at the original resolution, up to 16 megapixels, with no account, credits or watermark. Processing happens on your device, so there's no server cost to pass on. Batch mode is free for 3 photos at a time; Batch Pro ($19 once) handles up to 200 per run."),
("Is the quality as good as remove.bg?", "For most photos it's close. Peelo runs a high-resolution open-source model (IS-Net) on your device and automatically removes leftover background text and specks. Large server models can still do better on very fine hair, glass and crowded scenes; the erase and restore brush fixes what's left."),
("Do I need a Canva account to keep removing backgrounds?", "Only if you want to use Canva's tool. Canva's help centre says its Background Remover is included with paid plans. Peelo is independent and needs no account."),
("Does Peelo have an API?", "No. Peelo is a browser tool. If you used remove.bg's API, read remove.bg's notice for its recommended path."),
],
sources=[
("remove.bg pricing page (shutdown notice)", "https://www.remove.bg/pricing", "states the standalone service ends 1 December 2026 and moves to Canva"),
("Canva Help: Background Remover", "https://www.canva.cn/en/help/background-remover-cn/", "“Background Remover is included with paid plans.”"),
("Photoroom background remover: free vs Pro (Closo, 2026)", "https://closo.co/blogs/beginner-guides-how-tos/photoroom-background-remover", "third-party summary of free-plan export limits and Pro batch mode; confirm on photoroom.com"),
],
checked="29 October 2026",
),
# ---------------------------------------------------------------------------------------------
dict(
slug="white-background-amazon-product-photo",
title="White Background for Amazon Product Photos (Free) | Peelo",
description="Make an Amazon-ready main image: pure white RGB 255,255,255 background, product filling about 85% of the frame, 1000px+ for zoom. Free, no upload.",
crumb="Amazon white background",
h1="Make a pure white background for your Amazon main image",
lede="Amazon is strict about the first image on a listing. It needs a pure white background, and the product should fill most of the frame. Here's how to get there from an ordinary phone photo, free and without uploading anything.",
cta=dict(href="?preset=marketplace", label="Open in Marketplace photo mode", note="Opens the tool with a pure white background, a square canvas and 85% fill already set."),
body="""
<h2>What Amazon asks for in the main image</h2>
<p>Amazon's product image requirements for the <em>main</em> image (the one shown in search results) boil down to a few rules:</p>
<ul>
<li><strong>Pure white background, RGB 255, 255, 255.</strong> Off-white, light grey or a slightly warm white from your lightbox doesn't count.</li>
<li><strong>The product fills about 85% of the frame.</strong> Big margins make your thumbnail look smaller than competitors'.</li>
<li><strong>At least 1000 pixels on the longest side</strong> is recommended so shoppers can zoom. Smaller images are accepted down to a lower minimum, but they lose zoom.</li>
<li><strong>JPEG is preferred.</strong> PNG, TIFF and non-animated GIF are also accepted.</li>
<li><strong>Only the product.</strong> No added text, logos, watermarks or props that aren't included in the sale.</li>
</ul>
<p>Secondary images (lifestyle shots, infographics) have looser rules. This guide covers the main image, which is where most suppressed listings come from.</p>

<h2>Why "almost white" gets flagged</h2>
<p>A photo of a product on white card almost never has a white background in the file. The camera reads it as something like RGB 240, 238, 235, with a gradient toward the corners. Turning up brightness pushes the product's own highlights to white too. The reliable fix is to cut the product out and put it on a fresh canvas filled with exactly 255, 255, 255. Peelo's Marketplace photo mode does exactly that, and the JPG it exports has a true white background.</p>

<h2>Getting the 85% fill right</h2>
<p>"Fill" means the product's longest side takes up about 85% of the image's width or height. With Peelo's square framing, the tool finds the edges of the cut-out product and builds a square around it, so the longest side is exactly the percentage you pick. A tall bottle touches 85% of the height; a wide tray touches 85% of the width. You can change the fill with the <em>Subject fills</em> slider.</p>

<h2>Resolution: plan for zoom</h2>
<p>Peelo never upscales. The square is built from your original pixels, so the output size depends on how big the product is in your photo. If the product spans 900 px in the original, an 85% square comes out at about 1060 px, which is just enough for zoom. Fill the frame when you shoot, or use a higher-resolution camera mode. The tool shows the output size before you download.</p>

<h2>Shooting tips that make the cut-out cleaner</h2>
<ul>
<li>Shoot against a plain background that contrasts with the product. A white product on white card is the hardest case for any AI.</li>
<li>Use soft, even light from two sides to cut down hard shadows. The cut-out removes the background, but shadows sitting on the product stay.</li>
<li>Avoid see-through packaging and glass where you can. Background removers find transparency hard, so check these edges carefully.</li>
<li>Keep the camera level with the product's centre to reduce distortion.</li>
</ul>
""",
steps=[
"<strong>Open the tool in <a href=\"../?preset=marketplace\">Marketplace photo mode</a>.</strong> The preset sets a white background, a square canvas and 85% fill.",
"<strong>Add your product photo</strong> by dropping it in, choosing it, or pasting it. It's processed on your device.",
"<strong>Check the edges.</strong> Drag the before/after slider. If a strap, handle or label edge is missing, use <em>Refine edges</em>, then <em>Restore</em>. Paint over leftover background with <em>Erase</em>.",
"<strong>Adjust the fill</strong> if needed. 85% suits most products. Very thin items, like pens, may look better at 80% so the ends aren't cramped.",
"<strong>Download JPG.</strong> Check the size shown under the buttons. Aim for at least 1000 px for zoom.",
],
faqs=[
("Is Peelo's white background exactly RGB 255, 255, 255?", "Yes. In Marketplace photo mode the canvas is filled with #FFFFFF before the product is placed, and the JPG export keeps that pure white background. The soft edge pixels around the product blend from the product into white, as they would in a studio shot."),
("Should I upload PNG or JPG to Amazon?", "Amazon prefers JPEG for product images. Use the JPG download for the main image. Keep a transparent PNG only if you'll be compositing the product elsewhere."),
("Why is my output smaller than 1000 pixels?", "Peelo builds the square from your original pixels and doesn't upscale. If the product is small in the photo, the square will be small. Shoot closer or at a higher resolution so the product spans at least 850 px in the original."),
("Can I add a drop shadow?", "Not yet. A shadow isn't required for the main image, and many top listings use a clean cut-out on white."),
],
sources=[
("Amazon Seller Central: Product image requirements (G1881)", "https://sellercentral.amazon.com/help/hub/reference/external/G1881", "official; sign-in may be required"),
("Photoroom: Amazon product image requirements", "https://www.photoroom.com/blog/amazon-product-images", "summary of Amazon's rules: pure white RGB 255,255,255; product ~85% of frame; ≥1000 px for zoom; JPEG preferred"),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-background-for-etsy",
title="Remove Background for Etsy Listing Photos (Free) | Peelo",
description="Clean, consistent Etsy listing photos: remove the background free at full resolution, aim for 2000px, and keep your shop grid tidy. No upload, no signup.",
crumb="Etsy listing photos",
h1="Remove the background from Etsy listing photos",
lede="Etsy doesn't require a white background, and handmade products often sell better in context. A clean cut-out is still the quickest way to a tidy shop grid and a first photo that stands out in search. Here's when to use one and how.",
cta=dict(href="?bg=ffffff&format=square&fill=80", label="Open with white, square, 80% fill", note="A good starting point for an Etsy first photo. You can switch to an off-white or brand colour in one click."),
body="""
<h2>White, off-white or lifestyle?</h2>
<p>Unlike Amazon, Etsy lets you use any background, so choose based on the product and on what shoppers see in search.</p>
<ul>
<li><strong>Clean background</strong> for small items that get lost in busy scenes (jewellery, pins, stickers, ceramics) and for shops that want a uniform grid.</li>
<li><strong>Soft off-white or a muted brand colour</strong> if pure white looks clinical next to your handmade style. Peelo's warm grey swatch (#F2EFE9) works well for this.</li>
<li><strong>Lifestyle photo</strong> for later images in the listing, showing scale, texture and use. A clean first photo plus lifestyle shots after it is a common winning combination.</li>
</ul>

<h2>Size and shape that work on Etsy</h2>
<p>Etsy's guidance for listing photos is to use images at least 2000 pixels on the shortest side, in a landscape 4:3 or a square 1:1 ratio. Search results and your shop page show a cropped thumbnail, and you can adjust that crop in the listing editor. Keep the product centred with some margin so the crop doesn't cut it off. A square with the product filling about 80% is a safe starting point.</p>
<p>Peelo keeps your original resolution, so start from a photo where the product is large. A modern phone photo with the product filling most of the frame easily gives a square over 2000 px.</p>

<h2>Keep your shop grid consistent</h2>
<p>Shoppers judge a shop at a glance. Listing photos with matching backgrounds and the same product size look professional even when the photos came from different days and lighting. To get there:</p>
<ul>
<li>Use the same background colour for every first photo. Note the hex code of your custom colour.</li>
<li>Use the same <em>Subject fills</em> percentage per product type, for example 80% for mugs and 70% for prints so the frame shows.</li>
<li>Shoot from the same angle, usually straight on or a three-quarter view from slightly above.</li>
</ul>

<h2>Handmade products that need extra care</h2>
<ul>
<li><strong>Fuzzy or fibre items</strong> (knits, macramé, plush): the AI may soften the edges. Raise <em>Edge softness</em> a little for a natural look rather than a hard, cut-paper edge.</li>
<li><strong>Jewellery with fine chains:</strong> thin chains can drop out. Use <em>Restore</em> with a small brush, or keep a lifestyle background for that photo.</li>
<li><strong>Glass and resin:</strong> transparent parts can disappear or keep bits of the old background. Check closely, or shoot on a plain contrasting backdrop.</li>
<li><strong>Prints and flat art:</strong> you usually want a mock-up rather than a cut-out. Cut-outs are best for physical objects.</li>
</ul>
""",
steps=[
"<strong>Open the tool</strong> with the <a href=\"../?bg=ffffff&amp;format=square&amp;fill=80\">Etsy starting preset</a> (white, square, 80% fill).",
"<strong>Add your photo.</strong> It's processed in your browser and never uploaded to us or anyone else.",
"<strong>Pick your shop background.</strong> Keep white, choose the warm grey swatch, or set your brand colour with <em>Custom</em>.",
"<strong>Fix any edges</strong> in <em>Refine edges</em>: Erase removes leftover background, and Restore brings back parts of the product.",
"<strong>Download JPG</strong> and upload it as the first listing photo. Then use Etsy's thumbnail adjust to centre the crop.",
],
faqs=[
("Does Etsy require a white background?", "No. Etsy allows any background. White or a consistent plain colour helps small items stand out in search and keeps your shop grid tidy, but lifestyle photos are fine and often work well as later images."),
("What size should Etsy photos be?", "Etsy recommends images at least 2000 pixels on the shortest side, in a 4:3 or square ratio. Peelo keeps your original resolution, so start with a photo where the product is large in the frame."),
("Can I process a whole shop's photos at once?", "Yes. Batch mode takes many photos with one set of settings and gives you a single ZIP. It's free for 3 photos at a time; Batch Pro ($19 once, no subscription) handles up to 200 per run."),
("Will Etsy know I edited the background?", "Editing a background is normal product photography. Just make sure the photo still shows the item accurately: colour, size and condition."),
],
sources=[
("Etsy Help: Requirements and Best Practices for Images", "https://help.etsy.com/hc/en-in/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop?segment=selling", "official"),
("Outfy: Etsy listing photo size guide", "https://www.outfy.com/blog/etsy-listing-photo-size-guide/", "summarises Etsy's guidance: at least 2000 px on the shortest side; 4:3 or 1:1"),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-background-shopify-product-photos",
title="Remove Background from Shopify Product Photos | Peelo",
description="Consistent Shopify product images: square 2048×2048, same background and padding on every product. Remove backgrounds free at full res, no upload.",
crumb="Shopify product photos",
h1="Remove backgrounds from Shopify product photos and keep them consistent",
lede="On Shopify, your theme puts products side by side in collection grids, so mismatched sizes and backgrounds show up straight away. The fix is boring but effective: the same aspect ratio, the same background and the same padding on every product.",
cta=dict(href="?bg=ffffff&format=square&fill=80", label="Open with white, square, 80% fill", note="Square with even padding suits most Shopify themes. Change the colour to match your store."),
body="""
<h2>The size Shopify recommends</h2>
<p>Shopify recommends <strong>2048 × 2048 px</strong> for square product images. That's large enough for zoom on high-density screens without huge files. Product images can be up to 4472 × 4472 px (20 megapixels) and 20 MB. Square is the safest choice because most themes crop collection thumbnails to a fixed ratio. If yours uses portrait or landscape, keep every product at that same ratio instead.</p>

<h2>Why consistency matters more than perfection</h2>
<p>A collection page with one product on pure white, one on grey card and one in a kitchen looks like a marketplace, not a brand. Shoppers read that as less trustworthy. With the same background and margin on every product, mismatched photography looks deliberate. Peelo's square framing helps here because it measures the cut-out product and sizes the square around it. A tall vase and a short candle end up with the same visual weight at the same fill.</p>
<ul>
<li><strong>Decide one fill</strong> for the whole catalogue. 75 to 85% suits most stores, and 80% leaves room for sale badges that some themes overlay in a corner.</li>
<li><strong>Decide one background:</strong> white, an off-white, or a brand tint. Write down the hex code and use <em>Custom</em> every time.</li>
<li><strong>Decide one file type.</strong> JPG is smaller and loads faster. Use PNG only if your theme's design needs transparent product images, for example on a coloured section background.</li>
</ul>

<h2>Transparent PNG or JPG on a colour?</h2>
<p>A transparent PNG lets the theme's background show through, which looks great on a tinted section. It's also larger, and if you later change the theme colour, your images change with it. A JPG on your chosen colour is predictable and lighter. Shopify serves images through its CDN in optimised sizes, but starting with a sensible file still helps your page weight. Most stores do best with JPG on white or off-white.</p>

<h2>Variants and colour accuracy</h2>
<p>When each colour variant gets its own photo, removing the background makes the variants easy to compare. Remember the cut-out doesn't change the product's pixels, so colour accuracy still comes from your lighting and camera. Shoot every variant in the same setup. If a variant looks off, fix it in your photo editor <em>before</em> removing the background.</p>
""",
steps=[
"<strong>Open the tool</strong> with the <a href=\"../?bg=ffffff&amp;format=square&amp;fill=80\">Shopify starting preset</a>, or use <em>Marketplace photo</em> in the tool.",
"<strong>Add a product photo.</strong> Shoot so the product is large in the frame. Peelo keeps your original pixels and never upscales, so a 2048 px square needs the product to span about 1650 px at 80% fill.",
"<strong>Set your store background</strong> (white or your brand hex) and keep it the same for every product.",
"<strong>Refine</strong> any missing straps, spouts or labels with <em>Restore</em>, and remove stray bits with <em>Erase</em>.",
"<strong>Download JPG</strong> (or PNG for transparent) and upload it in Shopify admin under Products → Media.",
],
faqs=[
("What image size does Shopify recommend?", "Shopify recommends 2048 × 2048 px for square product images. Images can be up to 4472 × 4472 px (20 megapixels) and 20 MB."),
("Should Shopify product images be PNG or JPG?", "JPG for most stores: it's smaller and faster. Use a transparent PNG only when your theme shows products on a coloured or patterned section and you want that background to show through."),
("How do I make all my product photos the same size?", "Use the square framing with the same Subject fills percentage for every product. Peelo measures the cut-out and builds the square around it, so items of different shapes get consistent margins."),
("Is there a bulk option for a whole catalogue?", "Yes. Batch mode processes up to 200 photos per run with Batch Pro ($19 once), or 3 at a time free, and downloads one ZIP with your original filenames."),
],
sources=[
("Soona: Shopify image sizes", "https://soona.co/blog/shopify-image-sizes", "2048 × 2048 px recommended for square; up to 4472 × 4472 px / 20 MP; up to 20 MB"),
("Shopify Help: Product media types", "https://help.shopify.com/en/manual/products/product-media/product-media-types", "official"),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="transparent-background-logo",
title="Make a Logo Background Transparent (Free PNG) | Peelo",
description="Turn a logo on white into a transparent PNG, free and in your browser. Uses colour keying made for flat artwork, with tips to avoid white halos.",
crumb="Transparent logo",
h1="Make a logo's background transparent",
lede="You have a logo as a JPG on white, and you need a transparent PNG for a slide, a website header or a product mock-up. AI subject detection is the wrong tool for flat artwork. Peelo has a <em>Plain background</em> method that removes the white itself.",
cta=dict(href="?preset=logo", label="Open with the logo preset", note="Sets the Plain background method and a transparent PNG output."),
body="""
<h2>Why logos need a different method</h2>
<p>Background-removal AI is trained to find "the subject" of a photo, like a person or a product. A logo isn't a photo. It might be three separate letters, a thin outline or a shape with holes in it, and an AI model may keep the main shape and drop the rest. The <strong>Plain background</strong> method works differently. It samples the colour around the edges of your image (usually white), then makes every pixel close to that colour transparent, with soft edges for anti-aliased lines. Letters, outlines and holes are all handled the same way.</p>

<h2>Start from the best source you have</h2>
<ul>
<li><strong>If you have a vector file</strong> (SVG, AI, EPS or a PDF from the designer), export a transparent PNG from it. That will always beat removing a background from a JPG.</li>
<li><strong>If you only have a raster file</strong>, use the largest version you can find. A 2000 px logo gives far cleaner edges than a 200 px favicon grabbed from a website.</li>
<li><strong>Avoid screenshots of logos.</strong> They add compression blur and a coloured fringe.</li>
</ul>

<h2>Avoiding white halos</h2>
<p>A logo on white has edge pixels that are a blend of logo colour and white. Remove the white and put the logo on a dark background, and you can see a faint light outline, or "halo". Use the <em>Edge softness</em> slider to control it:</p>
<ul>
<li><strong>Lower softness</strong> makes the cut tighter and removes more of the near-white fringe. This is best if the logo will sit on dark backgrounds.</li>
<li><strong>Higher softness</strong> gives smoother edges. This is best on light backgrounds.</li>
</ul>
<p>Before you download, preview with the <em>Colour</em> background set to black to see any halo, then switch back to <em>Transparent</em>.</p>

<h2>Watch out for white inside the logo</h2>
<p>The Plain background method removes <em>every</em> pixel that matches the background colour, including white inside the logo, like white text on a red badge. If parts of your logo should stay white:</p>
<ul>
<li>use <em>Refine edges</em> and then <em>Restore</em> to paint those areas back, or</li>
<li>switch the method to <em>AI subject</em>, which keeps a solid badge shape together.</li>
</ul>

<h2>Logos on a coloured background</h2>
<p>It doesn't have to be white. If your logo sits on flat blue, the method samples blue from the edges and removes that instead. It works best when the background is one flat colour without gradients or texture.</p>
""",
steps=[
"<strong>Open the tool with the <a href=\"../?preset=logo\">logo preset</a></strong>. It sets the Plain background method and transparent output. The AI model isn't needed, so it starts instantly.",
"<strong>Add your logo image</strong> (JPG, PNG or WebP). Use the largest version you have.",
"<strong>Check for halos.</strong> Switch the background to Colour and pick black, then adjust <em>Edge softness</em> until the edge looks clean.",
"<strong>Restore any white parts</strong> that belong to the logo with <em>Refine edges</em> and then <em>Restore</em>.",
"<strong>Set the background back to Transparent and download the PNG.</strong> JPG can't store transparency.",
],
faqs=[
("Why does my transparent logo have a white outline?", "The edge pixels in the original are a mix of logo colour and white. Lower the Edge softness slider for a tighter cut, and preview on black before downloading."),
("Part of my logo disappeared. Why?", "The Plain background method removes every pixel that matches the background colour, including white areas inside the logo. Paint them back with Restore, or switch to the AI subject method."),
("Can I get an SVG?", "No. Peelo outputs PNG and JPG. If you need a vector logo, ask your designer for the source file, or use a vector tracing tool on the transparent PNG."),
("Is my logo uploaded anywhere?", "No. Everything happens in your browser. That matters for unreleased brand work under NDA."),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-background-from-signature",
title="Remove Background from a Signature (Transparent PNG)",
description="Photograph your signature and turn it into a transparent PNG for documents, free and private. Your signature never leaves your device.",
crumb="Signature background",
h1="Remove the background from your signature",
lede="A clean, transparent signature image is handy for letters, invoices and forms you fill in yourself. Since it's your signature, it's also something you probably don't want to upload to a random website. Here's how to make one privately.",
cta=dict(href="?preset=signature", label="Open with the signature preset", note="Uses the Plain background method, which removes the paper and keeps the ink. Nothing is uploaded."),
body="""
<h2>Why privacy matters for this one</h2>
<p>Most online background removers upload your image to a server. For a product photo that hardly matters. For your signature it's worth avoiding. Peelo runs entirely in your browser: the image is decoded, processed and saved on your own device, and no copy is sent anywhere. You can check this yourself. Load the page, switch your device to airplane mode, then process the signature.</p>

<h2>Capture a clean signature</h2>
<p>Most of the quality comes from the photo, not the software.</p>
<ul>
<li><strong>Paper:</strong> plain white printer paper, no lines or grid.</li>
<li><strong>Pen:</strong> a black or dark blue felt-tip or gel pen. Thin ballpoint lines are faint and break up.</li>
<li><strong>Size:</strong> sign larger than usual, about 8 to 10 cm wide. You can shrink it later, but you can't add detail.</li>
<li><strong>Light:</strong> bright, even daylight from a window. Avoid your own shadow and the phone's shadow falling across the page.</li>
<li><strong>Angle:</strong> hold the phone flat and parallel to the paper, and fill the frame with the signature plus a small margin.</li>
</ul>
<p>Using a scanner? Scan in colour or greyscale at 300 dpi or more, then crop close to the signature.</p>

<h2>Why the Plain background method, not AI</h2>
<p>A signature is thin lines on paper, which isn't the kind of "subject" photo AI is trained on. The Plain background method samples the paper colour from the edges of the image and makes everything close to it transparent, keeping the ink. It also handles slightly grey or cream paper, as long as the light is even. If one corner is in shadow, that area may survive as a grey smudge. Paint it out with <em>Erase</em>.</p>

<h2>Getting crisp, natural edges</h2>
<ul>
<li><strong>Edge softness</strong> sets how much faint ink survives. Lower it for a bolder, cleaner line. Raise it to keep light pen pressure and tapering strokes.</li>
<li>Preview on white <em>and</em> on a light grey to make sure no paper texture remains.</li>
<li>Download as <strong>PNG</strong>. JPG has no transparency and would bring back a background.</li>
</ul>

<h2>Use it responsibly</h2>
<p>Only make images of your own signature, or one you're authorised to use. A pasted image is convenient for documents you send yourself, but it isn't the same as a verified e-signature. For contracts, use the signing process the other party asks for.</p>
""",
steps=[
"<strong>Photograph or scan your signature</strong> as described above: dark pen, white paper, even light.",
"<strong>Open the tool with the <a href=\"../?preset=signature\">signature preset</a>.</strong> No AI download is needed for this method.",
"<strong>Add the photo.</strong> The paper disappears and the ink stays.",
"<strong>Tidy up:</strong> adjust <em>Edge softness</em>, and use <em>Refine edges</em>, then <em>Erase</em>, on any shadows or specks.",
"<strong>Download the PNG</strong> and insert it into your document. In Word or Google Docs, set the image to \"In front of text\" and scale it down.",
],
faqs=[
("Is it safe to make a signature image online?", "With Peelo, the image never leaves your device. Processing runs in your browser and nothing is uploaded. You can confirm this by turning on airplane mode after the page loads."),
("Why is there a grey patch around my signature?", "That's usually a shadow or uneven light on the paper. Retake the photo in brighter, even light, or remove the patch with Refine edges and then Erase."),
("Why are parts of my signature faint or broken?", "Thin or light pen strokes are close to the paper colour. Lower Edge softness slightly, or sign again with a darker felt-tip pen."),
("Is a pasted signature image legally binding?", "That depends on where you are and on the document. A signature image isn't a verified electronic signature. For contracts, use the signing method the other party requires."),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-background-without-uploading",
title="Remove Background Without Uploading Your Photo | Peelo",
description="Remove image backgrounds entirely in your browser. The photo never leaves your device. How it works, how to verify it, and when it matters.",
crumb="No-upload background removal",
h1="Remove a background without uploading your photo",
lede="Most background removers send your photo to a server, process it there and send the result back. Peelo does the whole job inside your browser. Here's how that works, how to check it yourself, and when it matters.",
cta=dict(href="", label="Try it: nothing gets uploaded", note="The AI engine downloads once, then runs on your device."),
body="""
<h2>How on-device background removal works</h2>
<p>When you open Peelo, your browser downloads two things from the same site that serves the page:</p>
<ol>
<li><strong>The model:</strong> IS-Net, an open-source high-resolution segmentation network (Apache-2.0, about 91 MB, downloaded once). Fast mode uses U²-Net small (Apache-2.0, 5 MB).</li>
<li><strong>The runtime:</strong> ONNX Runtime Web, compiled to WebAssembly so it runs at near-native speed in any modern browser (about 11 MB).</li>
</ol>
<p>When you add a photo, your browser decodes it into memory. The model then works out which pixels belong to the subject, and the cut-out is composited at full resolution on a canvas, all in the browser tab. The download is created locally too. At no point does the image go into a network request.</p>

<h2>Verify it yourself</h2>
<p>You shouldn't have to take our word for it. Two easy checks:</p>
<ul>
<li><strong>Airplane mode test:</strong> open Peelo and process one photo so the engine is cached. Then turn on airplane mode or disconnect Wi-Fi and process another. It still works, because nothing needs the internet.</li>
<li><strong>Network tab:</strong> on a desktop, open your browser's developer tools (F12), go to the Network tab, then add a photo. You'll see no upload request, and no third-party requests at all. Peelo doesn't load ads, trackers or fonts from other domains.</li>
</ul>

<h2>When not uploading matters</h2>
<ul>
<li><strong>Client work under NDA:</strong> unreleased products, packaging and campaign assets.</li>
<li><strong>Photos of children</strong> or family photos you don't want stored on someone else's server.</li>
<li><strong>Signatures and personal documents.</strong> See the <a href="../remove-background-from-signature/">signature guide</a>.</li>
<li><strong>Workplaces with strict data policies</strong> where unapproved cloud tools are off-limits.</li>
<li><strong>Bad connections:</strong> processing locally means no waiting for a 10 MB upload on hotel Wi-Fi.</li>
</ul>

<h2>The trade-offs, honestly</h2>
<p>Running on your device means the model has to be small enough to download quickly and run on a phone. Server tools can run models that are 30 to 50 times larger. In practice:</p>
<ul>
<li>Single clear subjects (products, people, pets, cars) come out well.</li>
<li>Fine hair against busy backgrounds, glass and crowded scenes are weaker. The erase and restore brush is there for that.</li>
<li>Speed depends on your device. A recent phone takes about a second or two. A very old laptop may take longer.</li>
<li>Very large photos are capped at 16 megapixels, because browsers, especially on iPhone, fail on bigger canvases.</li>
</ul>

<h2>Install it for offline use</h2>
<p>Peelo is an installable web app. In Chrome or Edge, use "Install app" in the address bar or menu. On iPhone, use Share → Add to Home Screen. After one online visit, the app and its AI engine are cached, so it opens and works without a connection.</p>
""",
steps=[
"<strong>Open <a href=\"../\">Peelo</a></strong> while online. The engine downloads once and is cached.",
"<strong>Optional:</strong> turn on airplane mode to prove nothing leaves your device.",
"<strong>Add your photo.</strong> It's decoded and processed in your browser's memory.",
"<strong>Refine the edges</strong> if needed, and pick a transparent, colour, blur or image background.",
"<strong>Download.</strong> The file is created on your device at the photo's full resolution.",
],
faqs=[
("Does Peelo store my photos?", "No. Photos are processed in your browser's memory and are never uploaded, so there's nothing on our side to store. Closing the tab clears them."),
("Why does the first use take a while?", "That's the AI model (about 91 MB) and the runtime that runs it. They're downloaded once and cached by your browser, so later visits start almost instantly, even offline. Fast mode uses a 5 MB model instead."),
("Can I use it completely offline?", "Yes, after the first visit. Install it as an app from your browser menu, or just reopen the page. The app and the model come from your browser's cache."),
("Is on-device removal lower quality?", "It runs a 1024-pixel model and then removes leftover background text and specks automatically. Very fine hair, glass and crowded scenes are still the hardest cases; the refine brush fixes what's left."),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="linkedin-headshot-background",
title="Change Your LinkedIn Headshot Background (Free) | Peelo",
description="Replace a messy background in your LinkedIn photo with a neutral colour or soft blur. Square, 400×400+, full resolution, no upload. Free.",
crumb="LinkedIn headshot",
h1="Give your LinkedIn headshot a clean background",
lede="You don't need a studio for a professional profile photo. A well-lit phone photo plus a quiet, neutral background gets you most of the way. Here's how to swap out the kitchen, the office corridor or the holiday crowd.",
cta=dict(href="?bg=e9edf2&format=square&fill=80", label="Open with a soft grey, square", note="Square framing keeps your shoulders anchored to the bottom edge. Try the Blur option too."),
body="""
<h2>LinkedIn photo basics</h2>
<p>LinkedIn shows profile photos as a circle cropped from a square. The commonly recommended upload size is <strong>400 × 400 pixels</strong> or larger, up to an 8 MB file. Bigger is fine and stays sharp on high-resolution screens. Your face should be the clear focus. In the circle crop, head and shoulders filling roughly 60% of the frame reads well, even at the tiny size shown next to comments.</p>

<h2>Choosing a background</h2>
<ul>
<li><strong>Soft neutral colour</strong> (light grey-blue, warm grey, off-white): calm and professional, and it works in light and dark mode. The preset uses a light grey-blue (#E9EDF2).</li>
<li><strong>Blurred original:</strong> keeps a sense of place but takes away the clutter, like a portrait-mode photo. It also hides small edge mistakes around hair, which is useful because hair is the hardest part for any background remover.</li>
<li><strong>Brand colour:</strong> fine for founders and creatives. Keep it muted so your face stays the focus.</li>
<li><strong>Avoid pure black or busy patterns</strong>. They fight with the circular frame.</li>
</ul>

<h2>Framing that looks natural</h2>
<p>A headshot is cut off at the bottom of the frame by your shoulders. If you centre a cut-out like that in a square, the shoulders end up floating in the middle with empty space below. Peelo's square framing spots that the subject touches the bottom edge of the photo and keeps it anchored there, with even space on the sides and above your head. Set the fill to around 75 to 85%.</p>

<h2>Hair and edges</h2>
<p>Be realistic about hair. Flyaway strands against a busy background are its weakest spot. To get a natural result:</p>
<ul>
<li>Shoot against a plain wall if you can. The less the background looks like your hair, the cleaner the cut.</li>
<li>Raise <em>Edge softness</em> slightly so the outline doesn't look pasted on.</li>
<li>Use the <em>Blur</em> background, which blends any leftover edge pixels.</li>
<li>Use <em>Restore</em> with a big, soft pass over the hairline if the top of your head looks clipped.</li>
</ul>

<h2>Lighting matters more than the background</h2>
<p>Face a window and avoid overhead lights that throw shadows under your eyes. Hold the camera at eye level, a little more than arm's length away, or ask someone else to take it, and use the 2x lens if you have one, since it flatters faces more than wide-angle. Then swap the background. A well-lit face on a plain background beats a dim face in front of a perfect office.</p>
""",
steps=[
"<strong>Open the tool</strong> with the <a href=\"../?bg=e9edf2&amp;format=square&amp;fill=80\">headshot preset</a> (soft grey, square, 80% fill).",
"<strong>Add your photo.</strong> It stays on your device.",
"<strong>Compare backgrounds:</strong> try a swatch, Custom or Blur. Blur is the most forgiving around hair.",
"<strong>Adjust Subject fills</strong> so your head and shoulders sit comfortably. LinkedIn crops to a circle, so leave a little room above your head.",
"<strong>Download JPG</strong> and upload it via your profile photo. Use LinkedIn's crop tool to fine-tune the circle.",
],
faqs=[
("What size should a LinkedIn profile photo be?", "400 × 400 pixels or larger is the usual recommendation, with a maximum file size of 8 MB. Peelo keeps your photo's resolution, so a phone photo gives a much larger square, which is fine."),
("What background colour is best for LinkedIn?", "A soft neutral such as light grey, grey-blue or warm off-white looks professional and works on light and dark themes. A gently blurred real background also works well."),
("My hair looks cut out. How do I fix it?", "Raise Edge softness a little, use the Blur background, and brush over the hairline with Restore. Flyaway hair against a busy background is the hardest case for any background remover."),
("Is my photo uploaded?", "No. Peelo processes the photo in your browser and never uploads it."),
],
sources=[
("Linearity: LinkedIn size guide", "https://linearity.io/blog/linkedin-size-guide/", "profile photo 400 × 400 px, 1:1, max 8 MB"),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-background-pet-photo",
title="Remove the Background from a Pet Photo (Free) | Peelo",
description="Cut out your dog or cat for stickers, prints, memorials and custom gifts. Free, full resolution, and tips for fur and whiskers. No upload.",
crumb="Pet photos",
h1="Remove the background from a pet photo",
lede="Cut-out pet photos turn up everywhere: stickers, birthday cards, memorial prints, custom mugs, and the cat on the company Slack. Fur is the tricky part. Here's how to get a natural cut-out that doesn't look like a paper doll.",
cta=dict(href="?bg=transparent", label="Cut out your pet", note="Transparent PNG by default. Switch to a colour or blur in one click."),
body="""
<h2>What you're making decides the settings</h2>
<ul>
<li><strong>Stickers and custom prints:</strong> transparent PNG at the highest resolution you have. Print shops usually want 300 dpi at the final size, so a 10 cm sticker needs about 1200 px across.</li>
<li><strong>Memorial or portrait prints:</strong> a soft solid colour or a gentle blur often looks warmer than pure white.</li>
<li><strong>Social posts and profile pictures:</strong> square framing with a bright colour.</li>
<li><strong>Pet products and listings</strong> (collars, beds, clothing): white or off-white, so the product, not the background, gets the attention.</li>
</ul>

<h2>Fur: what to expect</h2>
<p>Background removers find soft, wispy edges hardest, and fur is all soft, wispy edges. Peelo uses a compact model that runs on your device, so be realistic. Short-haired pets on a contrasting background come out well. A long-haired white cat on a cream sofa won't be perfect. You can still get a natural result:</p>
<ul>
<li><strong>Raise Edge softness</strong> (around 50 to 70). A slightly soft outline reads as fur, while a razor-sharp one looks like it was cut with scissors.</li>
<li><strong>Pick a background close to the old one</strong> in brightness. Fur edges blended against a similar tone hide much better than against a high-contrast colour.</li>
<li><strong>Accept losing whiskers.</strong> Single whiskers are thinner than a pixel at the model's working size. Restore them by hand with a small brush if they matter to you.</li>
<li><strong>Try Blur instead of a new background.</strong> It keeps the original edge colours, which hides almost every fur artefact.</li>
</ul>

<h2>Take a photo that cuts out well</h2>
<ul>
<li>Get down to your pet's eye level. It looks better and separates them from the floor.</li>
<li>Choose a background that contrasts with their coat: a dark dog against a light wall, a white cat against a darker blanket.</li>
<li>Use daylight and avoid flash, which gives flat fur and glowing eyes.</li>
<li>Keep their whole outline in frame. Cropped ears or paws can't be invented later.</li>
<li>Take a burst. One frame will have the ears up and the eyes open.</li>
</ul>

<h2>Leads, toys and other pets</h2>
<p>The model looks for the main subject, so a lead, a toy in the mouth or a second pet may be kept or dropped unpredictably. Use <em>Restore</em> to keep things you want, like the toy, and <em>Erase</em> for things you don't, like a hand holding the lead.</p>
""",
steps=[
"<strong>Open <a href=\"../?bg=transparent\">Peelo</a></strong> and add your pet photo. It's processed on your device.",
"<strong>Raise Edge softness</strong> to around 50 to 70 for fur, and check the outline with the slider.",
"<strong>Fix ears, tails and paws</strong> with <em>Refine edges</em> and then <em>Restore</em>, using a small brush for fine bits.",
"<strong>Choose the output:</strong> transparent for stickers and gifts, or a colour or Blur for prints and posts. Square framing works well for profile pictures.",
"<strong>Download PNG</strong> (transparent) or JPG (on a colour) at full resolution.",
],
faqs=[
("Why does my pet's fur look jagged or blurry?", "Fur is the hardest case for background removal. Raise Edge softness for a natural edge, pick a background similar in brightness to the original, or use the Blur background, which hides edge artefacts best."),
("Can I make a sticker from my pet photo?", "Yes. Download a transparent PNG. For printing, check the shop's size needs, typically 300 dpi at the final size, and start from your highest-resolution photo."),
("The whiskers disappeared. Can I get them back?", "Single whiskers are often too thin for the model. Use Refine edges, then Restore, with a small brush to paint them back, or keep the Blur background, which preserves the original edges."),
("Does it work with two pets in one photo?", "Often, but not always. The model looks for the main subject. Use Restore to bring back a second pet if it gets dropped."),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-background-car-photo",
title="Remove the Background from a Car Photo (Free) | Peelo",
description="Clean car listing photos: remove the driveway, keep the car at full resolution. Tips for windows, shadows and number plates. Free, no upload.",
crumb="Car photos",
h1="Remove the background from a car photo",
lede="Selling a car privately? A clean background makes your listing look cared-for and puts the attention on the car, not the bins and the neighbour's van. Cars bring their own problems too: windows, reflections and shadows. Here's how to handle them.",
cta=dict(href="?bg=f2efe9", label="Open with a soft studio grey", note="A light warm grey looks like a studio floor. Switch to white or blur if you prefer."),
body="""
<h2>Clean background, honest photo</h2>
<p>A background swap should tidy up the scene, not change the car. Buyers notice when listing photos hide things, and it costs trust when they arrive for a viewing. Keep the car's own pixels as they are. Peelo only changes what's behind the car. Show dents and scuffs in separate close-ups. A clean main photo plus honest detail shots sells better than a flawless-looking one.</p>

<h2>Windows and glass</h2>
<p>This is where every background remover struggles. Through the windows you can see the original background: a hedge or a house. The model may:</p>
<ul>
<li>keep the windows with the old scene visible through them, which usually looks fine and natural, or</li>
<li>cut holes where the windows are, so the new background shows through, or</li>
<li>do a bit of both, which looks odd.</li>
</ul>
<p>The quickest fix is to choose one look and use the brush. In <em>Refine edges</em>, <em>Restore</em> over the windows to keep them solid. That's usually the most realistic option, since real glass reflects its surroundings anyway.</p>

<h2>Shadows and "floating" cars</h2>
<p>When a car is cut out from the tarmac, its shadow goes too, and on a plain background the car can look like it's hovering. Two things help:</p>
<ul>
<li><strong>Use a light, warm grey</strong> (like the preset) rather than stark white. It reads as a studio floor and makes the missing shadow less obvious.</li>
<li><strong>Keep the tyres sitting on the bottom edge</strong> if you use square framing. When the car touches the bottom of your original photo, Peelo keeps it anchored there instead of floating it in the middle.</li>
</ul>
<p>Or use <em>Blur</em>: it keeps the real ground and shadow but softens the driveway clutter, like a portrait-mode photo.</p>

<h2>Number plates</h2>
<p>Many private sellers hide the plate in online photos. Since Peelo runs on your device, the plate is never uploaded during editing. To hide it in the final image, use a photo editor or markup tool after downloading. The background tool won't cover it for you.</p>

<h2>Shooting tips</h2>
<ul>
<li>Shoot on an overcast day or in open shade. Hard sun creates reflections the model may treat as background.</li>
<li>Use the classic three-quarter front angle at headlight height, with the whole car in frame and a margin around it.</li>
<li>Move the car away from other cars and objects so its outline is clear.</li>
<li>Clean it first. Mud and water spots still show after a background change.</li>
</ul>
""",
steps=[
"<strong>Open the tool</strong> with the <a href=\"../?bg=f2efe9\">studio grey preset</a> and add a car photo. Nothing is uploaded.",
"<strong>Check the windows and wheels</strong> with the slider. Use <em>Refine edges</em>, then <em>Restore</em>, to keep the windows solid, and <em>Erase</em> to remove ground left between the tyres.",
"<strong>Choose the background:</strong> studio grey, white or Blur. Try <em>Square, centred</em> for listing sites with square thumbnails.",
"<strong>Download JPG</strong> at full resolution for the listing.",
],
faqs=[
("Why are the car's windows see-through after removing the background?", "Glass is transparent, so the model may treat the scene behind it as background. Use Refine edges, then Restore, to paint the windows back for a solid, realistic look."),
("My car looks like it's floating. How do I fix that?", "The cut-out removes the ground shadow. Use a light warm grey instead of pure white, keep the tyres on the bottom edge, or use the Blur background, which keeps the real ground."),
("Is it okay to edit the background on a car listing?", "Changing the background is common, but don't alter the car itself. Show any damage in separate photos so the listing stays accurate."),
],
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-background-full-resolution-free",
title="Remove Background at Full Resolution, Free | Peelo",
description="Most removers charge for HD downloads. Peelo exports at your photo's full resolution (up to 16 MP) free, because it runs on your device. How and why.",
crumb="Full resolution, free",
h1="Remove backgrounds at full resolution, free",
lede="The usual catch with free background removers is the download. The preview is free, but the full-size file costs credits or a subscription. Peelo's download keeps the full resolution of your photo, free. Here's why that's possible and where the limits are.",
cta=dict(href="", label="Get a full-resolution cut-out", note="No account, no credits, no watermark."),
body="""
<h2>Why other tools charge for HD</h2>
<p>Server-based removers pay for GPU time on every image they process, and large images cost more. A low-resolution free preview with paid HD downloads is a sensible business model for them. Peelo doesn't have that cost. The AI runs on <em>your</em> device, in your browser, so processing a 12-megapixel photo costs us nothing. That's why the full-resolution download is free.</p>

<h2>What "full resolution" means here</h2>
<p>Your download has the same pixel dimensions as the photo you added. A 4032 × 3024 phone photo comes back as a 4032 × 3024 PNG or JPG. In detail:</p>
<ul>
<li>The AI model works out the subject's outline on a 1024 × 1024 copy (320 × 320 in Fast mode), which keeps it fast enough to run in a browser.</li>
<li>That outline is smoothly upscaled to your photo's full size and shaped with the <em>Edge softness</em> curve.</li>
<li>It's then applied to your <strong>original pixels</strong>. The subject itself isn't resampled, so textures, text on labels and fine detail inside the subject stay as sharp as your original.</li>
<li>Your refine-brush strokes are recorded and replayed at full resolution on export, so manual fixes stay crisp.</li>
</ul>
<p>The honest caveat: because the outline starts at 1024 × 1024, very fine edge detail like individual hairs is approximated rather than traced pixel by pixel. For products and most subjects you won't notice. For hair-heavy portraits you might, and the brush helps there.</p>

<h2>The 16-megapixel limit</h2>
<p>Browsers limit how large a canvas can be, and iPhone Safari is the strictest, failing at around 16.7 megapixels. To make sure the export never fails silently, photos above 16 MP (for example 4900 × 3265) are scaled down to 16 MP, and the tool tells you before it happens. Most phone photos (12 MP) and many camera photos fit without any scaling.</p>

<h2>PNG or JPG?</h2>
<ul>
<li><strong>PNG</strong> keeps transparency and is lossless. It's the right choice for cut-outs you'll put on other backgrounds. Files are larger, often 5 to 15 MB at 12 MP.</li>
<li><strong>JPG</strong> flattens onto the background you chose (white by default) and is much smaller. It's the right choice for listings, email and anywhere transparency isn't needed.</li>
</ul>

<h2>Check the resolution yourself</h2>
<p>After processing, the line under the download buttons shows the exact output size. After downloading, check it in your file's info: Get Info on a Mac, Properties → Details on Windows, or the info panel in your phone's photo app.</p>
""",
steps=[
"<strong>Open <a href=\"../\">Peelo</a></strong> and add your highest-resolution original, not a screenshot or a messaging-app copy, which are often compressed.",
"<strong>Check the size</strong> shown under the download buttons. That's your output resolution.",
"<strong>Refine edges</strong> if needed. Brush strokes are replayed at full resolution.",
"<strong>Download PNG</strong> for transparency or <strong>JPG</strong> for a smaller file on a solid background.",
],
faqs=[
("Is the download really full resolution and free?", "Yes. The output has the same pixel dimensions as your photo, up to 16 megapixels, with no account, credits or watermark. It's free because processing runs on your device instead of a paid server."),
("Why was my photo scaled down?", "Photos over 16 megapixels are scaled to 16 MP because browsers, especially iPhone Safari, can't reliably create larger canvases. The tool warns you when this happens."),
("Does the AI upscale or sharpen my photo?", "No. It only decides which pixels are background. Your subject's pixels are your original pixels, not upscaled or regenerated."),
("Why is my PNG file so large?", "PNG is lossless and stores transparency, so a 12 MP cut-out can be 5 to 15 MB. Use JPG on a solid background for a much smaller file."),
],
),
]
