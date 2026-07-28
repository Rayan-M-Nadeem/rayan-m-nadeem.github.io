# Plainly Medicine

A medical awareness site that explains modern medicine to a general reader without either frightening them or making the science smaller than it is.

**Live site:** https://rayan-m-nadeem.github.io

## About

Public writing about medicine tends toward one of two failures. It either promises breakthroughs that have not arrived, or it dismisses real progress as hype. This site aims for the harder middle position: showing what the tools actually do today, where the limits are, and what would have to change for the next few decades to look different from the last.

Each topic is written for someone with no medical background, but the science is not simplified past the point of being true. Every page ends with references, including recent developments from 2025 and 2026, so a reader can go to the sources directly.

## Topics

**Interactive**

| Page | Subject |
|------|---------|
| Three Ways to Change a Gene | Apply CRISPR-Cas9, base editing, and prime editing to the same DNA sequence |
| The Arithmetic of a Lifetime | Two sliders showing why cumulative LDL exposure makes early lowering matter far more than late |
| Watch Resistance Happen | A bacterial colony given repeated antibiotic courses until the drug stops working |

**Chronic disease**

| Page | Subject |
|------|---------|
| Cardiology | Atherosclerosis as cumulative damage, and how prevention became durable |
| Neurology | Why the brain sets the ceiling on a long life, and the first disease-modifying Alzheimer's drugs |
| Oncology | Cancer as the central obstacle to longevity, and immune-based treatment |
| Metabolic Health | How GLP-1 drugs work, and what the evidence shows beyond weight |

**Acute and infectious**

| Page | Subject |
|------|---------|
| Infectious Disease | Why antibiotic resistance spreads sideways, and why the pipeline thinned |
| Critical Care | Organ substitution as a bridge, and what ECPR can and cannot do |

**Replacement and repair**

| Page | Subject |
|------|---------|
| Transplant and Regenerative Medicine | Machine perfusion, gene-edited pig organs, and engineered tissue |
| Longevity and Gene Editing | Capstone survey: gene editing, regenerative medicine, and the shifting boundary of death |

The longevity page is adapted from an independent research paper I wrote, *Rewriting the Lifespan: Gene Editing, Regenerative Medicine, and the Moving Frontier of Death* (January 2026).

## Built with

Plain HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies. Every page opens on its own.

- Bold editorial design on a cream ground, with each topic given its own saturated colour block
- Typography: Fraunces for display, IBM Plex Sans for body, IBM Plex Mono for labels
- Original inline SVG diagrams drawn for each topic: a heart, a brain, dividing cells, a glucose molecule, a bacterium, lungs, a kidney, and DNA
- Light and dark themes following the visitor's system setting, with a manual toggle that remembers the choice
- Three interactive explainers built in vanilla JavaScript, with no libraries
- A settings menu offering theme, text size, reduced motion, and link underlining, all persisted between visits
- Responsive down to small phone screens, and respects `prefers-reduced-motion`


## Reader features

- **Settings menu** (gear icon) with theme, higher contrast, text size, reading width, line spacing, article typeface, reduced motion and always-underlined links. Every choice is stored in the browser and applied before the page paints, so there is no flash of the wrong setting on the next visit.
- **Contents rail** built from each article's own headings, sticky on desktop and collapsible on mobile, with the section you are reading highlighted and an estimated reading time.
- **Reading progress bar** tied to the article body rather than the whole page.
- **Inline citations** that jump to the matching reference and highlight it.
- **Evidence status labels** marking each claim as approved, in trials, or early research.
- **Glossary definitions** on the first appearance of a technical term, shown on hover, tap or keyboard focus.
- **Previous and next** links between pieces, and a back-to-top button.
- **Keyboard support** throughout: a skip link, visible focus rings, and arrow, Home, End and Escape keys inside both menus.
- **A working model in every article**, not just the three standalone tools: an artery closing over decades; the order Alzheimer's changes appear; the same tumour run forward month by month under four different treatments; a weight trajectory you can stop at any week to see the regain; the two routes a resistance gene travels; a life-support simulation where organs fail on a clock and you decide what to support; the transplant supply gap; and two sliders that separate more years from more healthy years.
- **Remembers your place** in a piece and offers to pick it up, and ticks off what you have read in the contents menu.
- **Glossary underlines and evidence labels can be switched off** for readers who find them busy.
- **Print stylesheet** that drops the interface and expands link URLs.

## Structure

```
index.html          Homepage and topic index
glossary.js         Plain-language definitions surfaced inline
figures.js          One interactive model per article section
share-card.png      Social preview image (1200x630)
editing.html        Interactive: gene editing explainer
exposure.html       Interactive: cumulative LDL exposure
resistance.html     Interactive: antibiotic resistance simulation
cardiology.html     Chronic disease
neurology.html      Chronic disease
oncology.html       Chronic disease
metabolic.html      Chronic disease
infectious.html     Acute and infectious
criticalcare.html   Acute and infectious
transplant.html     Replacement and repair
longevity.html      Capstone
styles.css          Shared stylesheet and theme tokens
app.js              Theme toggle, mobile menu, scroll reveal
sitemap.xml         Search engine index
robots.txt          Crawler directives
```

## Deployment

This repository is named `rayan-m-nadeem.github.io`, which GitHub Pages serves at the root of the domain rather than under a project path. No build step is required; the files are served exactly as they are.

## Search visibility

Each page carries canonical URLs, Open Graph and Twitter card metadata, and JSON-LD structured data marking it as an article with a named author. The author markup states plainly that the author is a student researcher rather than a licensed clinician, and every clinical claim is cited to a primary source.

After deploying, submit the site at [Google Search Console](https://search.google.com/search-console) and add the sitemap URL there.

## Running it locally

Download the files and open `index.html` in any browser. Nothing to install.

## Disclaimer

This site is for educational purposes only and does not constitute medical advice. Consult a qualified healthcare professional for any medical concerns.

## License

Content © 2026. Code is free to reuse.
