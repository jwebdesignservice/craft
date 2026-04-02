---
name: internet-intelligence
description: Complete knowledge for AI agents to scrape any website — from simple HTTP requests to full browser automation with anti-bot bypass. Covers adaptive element tracking that survives website redesigns, Cloudflare bypass, stealthy TLS fingerprint spoofing, concurrent spider crawls with pause/resume, proxy rotation, session management, and MCP server integration. Use when an agent needs to extract web data, bypass anti-bot protection, run crawls, or monitor websites for changes.
type: procedural
domain_tags: ["scraping", "web", "crawling", "automation", "anti-bot", "cloudflare", "playwright", "python", "data-extraction"]
price_sol: 0.14
source: "Scrapling by D4Vinci (BSD-3-Clause) — https://github.com/D4Vinci/Scrapling"
---

# Web Scraping Intelligence

Adaptive web scraping for AI agents. Handles anti-bot systems, website redesigns, and full-scale crawls out of the box.

---

## Install

```bash
pip install scrapling
scrapling install  # Install browser dependencies
```

---

## Three Fetcher Modes

| Mode | Use When |
|------|----------|
| `Fetcher` | Fast HTTP — static sites, APIs, no JS |
| `StealthyFetcher` | Anti-bot bypass — Cloudflare, Turnstile, fingerprint protection |
| `DynamicFetcher` | Full browser — JS-rendered content, interactions |

---

## Basic HTTP Scraping

```python
from scrapling.fetchers import Fetcher, FetcherSession

# One-off request
page = Fetcher.get('https://quotes.toscrape.com/')
quotes = page.css('.quote .text::text').getall()

# Session (reuse connection + cookies)
with FetcherSession(impersonate='chrome') as session:
    page = session.get('https://example.com/', stealthy_headers=True)
    data = page.css('.product', auto_save=True)  # Auto-save for adaptive tracking
```

---

## Anti-Bot Bypass (Cloudflare, Turnstile)

```python
from scrapling.fetchers import StealthyFetcher, StealthySession

# One-off stealth request
page = StealthyFetcher.fetch('https://nopecha.com/demo/cloudflare')
data = page.css('#content a').getall()

# Persistent session (browser stays open)
with StealthySession(headless=True, solve_cloudflare=True) as session:
    page = session.fetch('https://protected-site.com', google_search=False)
    data = page.css('.product').getall()
```

---

## Full Browser Automation

```python
from scrapling.fetchers import DynamicFetcher, DynamicSession

# One-off dynamic fetch
page = DynamicFetcher.fetch('https://spa-site.com', network_idle=True)
data = page.xpath('//span[@class="text"]/text()').getall()

# Persistent browser session
with DynamicSession(headless=True, network_idle=True) as session:
    page = session.fetch('https://example.com/')
    data = page.css('.item').getall()
```

---

## Adaptive Element Tracking

Elements are remembered across scrapes. If the website redesigns, they're automatically relocated.

```python
# First scrape — save element locations
products = page.css('.product', auto_save=True)

# Later, if website changes structure — adaptive=True finds them anyway
products = page.css('.product', adaptive=True)
```

---

## Selection Methods

```python
# CSS selectors
page.css('.class-name')
page.css('.class-name::text').get()       # Get text
page.css('.class-name::text').getall()    # Get all text values
page.css('.class-name::attr(href)').get() # Get attribute

# XPath
page.xpath('//div[@class="item"]/text()').getall()

# Text search
page.find_by_text('Add to cart')
page.find_similar(element)    # Find elements similar to a known one

# DOM navigation
element.parent
element.children
element.siblings
element.next_sibling
```

---

## Full Spider (Crawl at Scale)

```python
from scrapling.spiders import Spider, Response

class ProductSpider(Spider):
    name = "products"
    start_urls = ["https://example.com/products"]
    concurrency = 10          # Parallel requests
    download_delay = 0.5      # Polite delay

    async def parse(self, response: Response):
        for item in response.css('.product'):
            yield {
                "title": item.css('h2::text').get(),
                "price": item.css('.price::text').get(),
                "url": item.css('a::attr(href)').get(),
            }

        # Follow pagination
        next_page = response.css('.next-page::attr(href)').get()
        if next_page:
            yield response.request.follow(next_page, self.parse)

# Run it
result = ProductSpider().start()

# Or stream results in real-time
async for item in ProductSpider().stream():
    print(item)

# Export
result.items.to_json('products.json')
result.items.to_jsonl('products.jsonl')
```

**Spider features:**
- Pause/resume with Ctrl+C (checkpoint-based)
- Per-domain rate limiting
- Blocked request detection + retry
- Multi-session routing (mix HTTP + headless)

---

## Proxy Rotation

```python
from scrapling.fetchers import ProxyRotator

proxies = [
    "http://user:pass@proxy1:8080",
    "http://user:pass@proxy2:8080",
]
rotator = ProxyRotator(proxies, strategy='cyclic')

page = Fetcher.get('https://example.com', proxy=rotator.get())
```

---

## Async Mode

```python
from scrapling.fetchers import AsyncFetcher

async def scrape():
    page = await AsyncFetcher.get('https://example.com/')
    return page.css('.item::text').getall()
```

---

## CLI (No Code)

```bash
# Scrape a URL from terminal
scrapling fetch https://example.com

# Interactive shell
scrapling shell https://example.com
# >>> page.css('.product')
```

---

## MCP Server (for AI agent integration)

```bash
# Start MCP server
scrapling mcp

# Use with Claude/Cursor — fetches + parses before sending to AI
# Reduces token usage by pre-extracting relevant content
```

---

## Key Patterns for Agents

### Monitor page for changes
```python
import time
while True:
    page = Fetcher.get('https://example.com/price')
    price = page.css('.price::text').get()
    if price != last_price:
        # Alert or act
        last_price = price
    time.sleep(300)
```

### Scrape paginated data
```python
all_items = []
page_url = 'https://example.com/items?page=1'
while page_url:
    page = StealthyFetcher.fetch(page_url)
    all_items += page.css('.item::text').getall()
    page_url = page.css('.next::attr(href)').get()
```

### Extract structured data
```python
page = Fetcher.get('https://example.com/product/123')
product = {
    'title': page.css('h1::text').get(),
    'price': page.css('.price::text').get(),
    'description': page.css('.description').get(),
    'images': page.css('img::attr(src)').getall(),
}
```

