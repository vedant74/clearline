NEW_PAGES = [
dict(
slug="remove-bg-shutting-down",
title="remove.bg Is Shutting Down Dec 1, 2026: What to Do Now",
og_title="remove.bg's website closes 1 Dec 2026. What to save and what to use next",
description="remove.bg's standalone website closes on 1 December 2026 and moves to Canva. What to save before then, and free options for removing backgrounds after.",
crumb="remove.bg shutting down",
h1="remove.bg is shutting down on 1 December 2026: what to do now",
lede="remove.bg's own pricing page says the standalone website will no longer be available from <strong>1 December 2026 at 9:00am CET</strong>, and that background removal is moving to Canva. Here's a short checklist so nothing gets lost, and what you can use afterwards.",
cta=dict(href="", label="Try a free remove.bg replacement", note="Peelo: full-resolution cutouts, no account, nothing uploaded."),
body="""
<h2>What we actually know</h2>
<p>The confirmed facts are short. remove.bg's pricing page says the standalone remove.bg website will no longer be available from 1 December 2026 at 9:00am CET, and that background removal is moving into Canva. That's it. We haven't seen official details here about every plan, unused credits or API customers, so treat anything beyond that as unconfirmed and check remove.bg's own notice and support pages for your account.</p>
<p>Plenty of articles go further and predict what Canva will charge or which features disappear. Some of that may turn out right, but it isn't confirmed, so we've left it out.</p>

<h2>Before 1 December: a five-minute checklist</h2>
<ul>
<li><strong>Download anything you still need.</strong> Past results, edited images and especially <strong>invoices or receipts</strong> for your accounting. Once the website is gone you may not be able to get them.</li>
<li><strong>Check your credits and plan.</strong> If you have unused credits or a subscription, read remove.bg's notice about what happens to them, and contact their support before the cutoff if anything's unclear.</li>
<li><strong>Find your automations.</strong> If a plugin, script, Zapier step or shop integration calls remove.bg, note where it is so it doesn't fail silently on 2 December.</li>
<li><strong>Pick your replacement and test it on your hardest photo.</strong> Hair, glass and product shots with text on the packaging show differences between tools fast.</li>
</ul>

<h2>Where to go next</h2>
<p>It depends on how you used remove.bg:</p>
<ul>
<li><strong>You already pay for Canva:</strong> Canva's Background Remover is the official destination and is included with paid Canva plans.</li>
<li><strong>You want something free with no account:</strong> an in-browser tool like <a href="../">Peelo</a> removes backgrounds at your photo's full resolution, with no signup, credits or watermark. Your photo is processed on your device and never uploaded.</li>
<li><strong>You process batches of product photos:</strong> look for batch support and check the price per photo. Peelo's batch mode is free for 3 photos at a time, and Batch Pro handles up to 200 per run for a one-time $19, with no subscription.</li>
<li><strong>You used the API:</strong> you'll need another API provider. Peelo is a browser tool and doesn't offer an API.</li>
</ul>
<p>For a side-by-side table of the main options, see our <a href="../remove-bg-alternative/">remove.bg alternative comparison</a>.</p>

<h2>Why we built Peelo</h2>
<p>Peelo runs an open-source AI model (IS-Net, Apache-2.0) inside your browser, so there's no server receiving your photos and no reason to charge per image. It also automatically removes leftover background text and specks, a common problem with background removers when there's a sign or poster behind your subject. It's honest about its limits: very fine hair, glass and crowded scenes are the hardest cases for any remover, and Peelo includes an erase and restore brush for those.</p>
""",
steps_title="Replace remove.bg with Peelo in two minutes",
steps=[
"<strong>Open <a href=\"../\">Peelo</a></strong> and drop in a photo you'd normally send to remove.bg. The first run downloads the AI model once (about 91 MB); after that it loads from your browser cache.",
"<strong>Check the result</strong> with the before/after slider. If anything's off, switch to <em>Refine edges</em> and use Erase or Restore.",
"<strong>Pick your output:</strong> transparent PNG, or JPG on white, any colour, a blurred background or your own image. <em>Marketplace photo</em> makes a white, square, centred product shot.",
"<strong>Download.</strong> The file keeps your original resolution (up to 16 megapixels).",
"<strong>Got a folder of photos?</strong> Use the <a href=\"../#batch\">Batch</a> tab: one set of settings, one ZIP out.",
],
faqs=[
("When does remove.bg shut down?", "remove.bg's pricing page says the standalone website will no longer be available from 1 December 2026 at 9:00am CET, and that background removal is moving to Canva."),
("What happens to my remove.bg credits or subscription?", "We haven't seen confirmed public details for every plan. Read remove.bg's own notice and contact their support before 1 December 2026 if you have unused credits or an active subscription."),
("Will I need a Canva account?", "To use Canva's background remover, yes. Canva says its Background Remover is included with paid Canva plans. Independent tools like Peelo need no account."),
("Is there a free remove.bg replacement with no signup?", "Yes. Peelo is free for single photos at full resolution, with no account, credits or watermark, and processes images in your browser without uploading them."),
("Can I still remove backgrounds in bulk?", "Yes. Peelo's batch mode handles 3 photos at a time for free, or up to 200 per run with Batch Pro for a one-time $19."),
],
sources=[
("remove.bg pricing page (shutdown notice)", "https://www.remove.bg/pricing", "“The standalone website will no longer be available from 1 December 2026 at 9:00am CET.”"),
("Canva Help: Background Remover", "https://www.canva.cn/en/help/background-remover-cn/", "“Background Remover is included with paid plans.”"),
],
checked="29 October 2026",
),
# ---------------------------------------------------------------------------------------------
dict(
slug="bulk-background-remover",
title="Bulk Background Remover: Many Photos at Once, No Upload",
og_title="Remove the background from a whole folder of photos at once",
description="Remove backgrounds from many images at once: one set of settings, one ZIP, original filenames. 3 photos free; up to 200 per run for $19 once. No upload.",
crumb="Bulk background remover",
h1="Bulk background remover: a whole folder of photos at once",
lede="Doing product photos one by one gets old fast. Peelo's batch mode takes a set of photos, applies the same settings to every one, and gives you a single ZIP with your original filenames. It runs in your browser, so nothing is uploaded.",
cta=dict(href="#batch", label="Open batch mode", note="3 photos free at a time. Batch Pro: up to 200 per run, $19 once."),
body="""
<h2>What batch mode does</h2>
<ul>
<li><strong>One set of settings for every photo:</strong> transparent, white, any colour or a blurred background; PNG or JPG; an optional maximum size.</li>
<li><strong>Marketplace squares:</strong> tick one box to get white, square, centred product shots, which is what Amazon, Etsy and Shopify listings usually want.</li>
<li><strong>One ZIP at the end,</strong> with each file named after your original plus a suffix, so it's easy to match results to products.</li>
<li><strong>Automatic clean-up:</strong> leftover background text and specks are removed for you, which matters when shelves, signs or price tags are in the shot.</li>
<li><strong>No upload:</strong> every photo is processed on your device. That's useful for unreleased products, client work or anything under NDA.</li>
</ul>

<h2>Free vs Batch Pro</h2>
<div class="table-wrap">
<table class="compare-table">
<thead><tr><th></th><th>Free</th><th>Batch Pro</th></tr></thead>
<tbody>
<tr><th>Photos per run</th><td>3</td><td>Up to 200</td></tr>
<tr><th>Price</th><td>$0</td><td>$19 once, no subscription</td></tr>
<tr><th>Full resolution</th><td>Yes</td><td>Yes</td></tr>
<tr><th>Watermark</th><td>None</td><td>None</td></tr>
<tr><th>Photos uploaded?</th><td>No</td><td>No</td></tr>
</tbody>
</table>
</div>
<p>Single photos in the main tool are always free at full resolution. Batch Pro is for when you have a catalogue to get through.</p>

<h2>How long does a batch take?</h2>
<p>Each photo is processed on your own computer, so speed depends on your device. With a graphics chip the browser can use (WebGPU), photos typically take a few seconds each; on processor-only devices, expect longer per photo. A batch of 100 can take anywhere from a few minutes to about 20 on slower machines. Keep the tab open while it runs. You can pause and resume.</p>

<h2>Getting consistent results across a catalogue</h2>
<ul>
<li><strong>Shoot on a plain background</strong> with even light. Any remover does better when the subject clearly stands out.</li>
<li><strong>Keep the product a similar size in frame</strong> across shots. With <em>Marketplace square</em> on, Peelo centres each product at the same fill.</li>
<li><strong>Spot-check a few results</strong> before uploading the lot. For the odd hard photo (glass, fine hair), open it in the single-photo tool and touch it up with the Erase and Restore brush.</li>
</ul>
""",
steps_title="How to remove backgrounds in bulk",
steps=[
"<strong>Open the <a href=\"../#batch\">Batch</a> tab</strong> in Peelo.",
"<strong>Drop in your photos</strong>, or choose a folder's worth with the file picker.",
"<strong>Choose settings once:</strong> background (transparent, white or colour), Marketplace square on or off, PNG or JPG, and maximum size.",
"<strong>Run the batch.</strong> The first run downloads the AI model once (about 91 MB). Keep the tab open; you'll see progress for each photo.",
"<strong>Download the ZIP</strong> with all results, named after your original files.",
],
faqs=[
("How many photos can I process at once?", "3 per run for free, or up to 200 per run with Batch Pro."),
("Is Batch Pro a subscription?", "No. It's a one-time $19 payment, processed by Stripe. It unlocks in the browser you buy it in, and there's a 14-day refund if it doesn't work for you."),
("Are my photos uploaded?", "No. Peelo runs the AI model in your browser, so photos stay on your device during the whole batch."),
("Do results keep full resolution?", "Yes, up to 16 megapixels per photo, unless you set a smaller maximum size."),
("Can I use it for Amazon, Etsy or Shopify listings?", "Yes. Use a white background with Marketplace square on for centred, square product photos, then check your marketplace's current image rules before uploading."),
],
checked="29 October 2026",
),
# ---------------------------------------------------------------------------------------------
dict(
slug="make-background-transparent",
title="Make an Image Background Transparent (Free PNG, No Upload)",
og_title="Make any image background transparent, free, in your browser",
description="Make an image's background transparent and download a full-resolution PNG. Free, no signup, no watermark, and your image never leaves your device.",
crumb="Make background transparent",
h1="Make an image background transparent",
lede="A transparent background means everything around your subject is see-through, so you can put it on any colour, slide or design. Here's how to do it for free in your browser, plus which format to save in so the transparency doesn't vanish.",
cta=dict(href="", label="Make a background transparent", note="Free, full resolution, no account. Your image stays on your device."),
body="""
<h2>Which method to use</h2>
<p>Peelo has two ways to remove a background. Picking the right one is the biggest quality win:</p>
<ul>
<li><strong>AI subject (default):</strong> for photos of people, products, pets, cars and food. The AI finds the main subject and removes everything else, including leftover background text and specks.</li>
<li><strong>Plain background:</strong> for logos, icons, signatures, scans and screenshots on a flat white or solid colour. It removes that colour directly, which keeps sharp edges on flat artwork. See our guide to <a href="../remove-white-background/">removing a white background</a>.</li>
</ul>

<h2>Save as PNG, not JPG</h2>
<p>Only some formats can store transparency. <strong>PNG</strong> keeps it and is what Peelo gives you for transparent cutouts. <strong>JPG can't store transparency</strong>: if you save a cutout as JPG, the see-through area turns into a solid colour (Peelo lets you pick which). WebP and GIF also support transparency, but PNG works almost everywhere: Google Slides, PowerPoint, Canva, Figma, Word and most websites.</p>

<h2>Why does my transparent image show a white or black background?</h2>
<ul>
<li><strong>The viewer is drawing a background behind it.</strong> Many image viewers and chat apps show transparency as white or black. Open it in a slide or design tool to check.</li>
<li><strong>It was converted to JPG</strong> somewhere along the way, for example by a messaging app that compresses images. Send it as a file or document instead.</li>
<li><strong>The checkerboard is part of the image.</strong> Some sites let you download a "transparent" image that actually has a grey-and-white checkerboard baked in. Peelo's PNGs contain real transparency.</li>
</ul>

<h2>Tips for clean edges</h2>
<ul>
<li>Use <em>Edge softness</em> to go from crisp (products, logos) to soft (hair, fur).</li>
<li>Switch to <em>Refine edges</em> and brush with Erase or Restore to fix any spot the AI got wrong.</li>
<li>Start from the largest version of the image you have. Peelo keeps your original resolution, up to 16 megapixels.</li>
</ul>
""",
steps_title="How to make a background transparent",
steps=[
"<strong>Open <a href=\"../\">Peelo</a></strong> and drop in your image, choose it with the file picker, or paste it.",
"<strong>Pick the method:</strong> AI subject for photos, Plain background for logos and flat graphics.",
"<strong>Keep the background on Transparent</strong> (the default) and check the edges with the before/after slider.",
"<strong>Fix any spots</strong> in <em>Refine edges</em> with Erase or Restore.",
"<strong>Download PNG.</strong> The transparency is preserved at full resolution.",
],
faqs=[
("Is it free?", "Yes. Transparent PNG downloads are free at full resolution, with no account, credits or watermark."),
("Does my image get uploaded?", "No. The AI model runs in your browser, so the image never leaves your device."),
("Why is my transparent PNG showing a white background?", "Usually the app you're viewing it in draws white behind transparent areas, or the image was converted to JPG when it was sent. Open it in a design or slide tool to check."),
("Can I make a transparent background on my phone?", "Yes. Peelo works in mobile browsers. Very large photos may be scaled to 16 megapixels so the browser doesn't run out of memory."),
("Which is better for logos: AI or Plain background?", "Plain background, if the logo sits on a flat white or solid colour. It keeps sharp edges and small details that subject-detection AI can smooth over."),
],
checked="29 October 2026",
),
# ---------------------------------------------------------------------------------------------
dict(
slug="remove-white-background",
title="Remove a White Background From an Image (Free PNG)",
og_title="Remove the white background from a logo, scan or image, free",
description="Remove a white background from a logo, signature, scan or product photo and get a transparent PNG. Free, no signup, nothing uploaded.",
crumb="Remove white background",
h1="Remove a white background from an image",
lede="A white background is the most common one people want gone: logos saved as JPG, scanned signatures, screenshots, product shots on white. Peelo has a method built for exactly this, so you get crisp, transparent edges without the white halo.",
cta=dict(href="?preset=logo", label="Remove a white background", note="Opens Peelo set to Plain background with a transparent result."),
body="""
<h2>Two cases, two methods</h2>
<ul>
<li><strong>Flat white behind flat artwork</strong> (a logo, icon, signature, scan or diagram): use <strong>Plain background</strong>. It removes the white directly, pixel by pixel, which keeps thin lines and small text intact. The link above opens Peelo with this already selected.</li>
<li><strong>A photo on a white backdrop</strong> (a product shot, a person against a white wall): use <strong>AI subject</strong>. Real photos have shadows and gradients that aren't pure white, and the AI separates the subject from them better.</li>
</ul>

<h2>Getting rid of the white halo</h2>
<p>The thin white outline you sometimes see around a cutout comes from edge pixels that are part subject, part white. To clean it up:</p>
<ul>
<li>In Plain background mode, raise <em>Edge softness</em> slightly so edge pixels fade out instead of keeping a white fringe.</li>
<li>If your design has a dark background, test the PNG on dark. Halos are invisible on white and obvious on black.</li>
<li>Start from the highest-resolution original you have; JPG compression adds speckles around edges.</li>
</ul>

<h2>When white is part of your subject</h2>
<p>If the logo or product itself has white areas (white text inside a dark badge, a white mug), Plain background can make those see-through too. Two fixes:</p>
<ul>
<li>Switch to <strong>AI subject</strong>, which keeps the whole object as long as it's clearly separate from the background.</li>
<li>Or stay in Plain background and use <em>Refine edges → Restore</em> to paint the white parts back in.</li>
</ul>
""",
steps_title="How to remove a white background",
steps=[
"<strong>Open <a href=\"../?preset=logo\">Peelo with Plain background</a></strong>, or open Peelo and choose <em>Plain background</em> under Cut-out method.",
"<strong>Drop in your image.</strong> Peelo detects the background colour from the edges, usually white.",
"<strong>Adjust Edge softness</strong> until the edges look clean, with no white fringe.",
"<strong>Restore anything</strong> that should stay white using <em>Refine edges → Restore</em>.",
"<strong>Download PNG</strong> to keep the transparency.",
],
faqs=[
("What's the best way to remove a white background from a logo?", "Use the Plain background method. It removes flat white directly and keeps sharp edges and small text, which subject-detection AI can soften."),
("Why does my logo have a white outline after removing the background?", "Edge pixels are a mix of logo colour and white. Raise Edge softness a little and check the result on a dark background."),
("Can it remove off-white or grey backgrounds?", "Yes. Plain background removes whatever solid colour is around the edges, not just pure white. For photos with shadows or gradients, use AI subject instead."),
("Is it free and private?", "Yes. It's free at full resolution with no account, and the image is processed in your browser without being uploaded."),
],
checked="29 October 2026",
),
]
