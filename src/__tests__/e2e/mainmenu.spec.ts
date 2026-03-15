import { test, expect } from './fixtures'

/**
 * MainMenu Responsive Scaling Tests
 * 
 * Tests MainMenu component at all breakpoints:
 * - 375px (mobile)
 * - 600px (tablet) 
 * - 900px (desktop)
 * - 1200px (widescreen)
 * - 1800px (ultrawide)
 * 
 * Verifies:
 * - Container expands properly at each breakpoint
 * - Buttons resize and reflow correctly
 * - Typography scales appropriately
 * - No horizontal overflow
 * - Proper spacing and padding
 */

test.describe('MainMenu Responsive Scaling', () => {
  test('renders at all breakpoints without overflow', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })

      // Wait for any transitions
      await page.waitForLoadState('networkidle')

      // Get the main menu container
      const menu = page.locator('[class*="MainMenu"]').first()
      const box = await menu.boundingBox()

      expect(box, `MainMenu should be visible at ${bp.label}`).toBeTruthy()
      if (box) {
        // Should not exceed viewport width minus safe margins
        expect(box.width).toBeLessThanOrEqual(bp.width - 16)
        console.log(`✓ ${bp.label}: Container width ${Math.round(box.width)}px (max allowed: ${bp.width - 16}px)`)
      }
    }
  })

  test('scales button containers properly', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      const buttons = page.locator('button').filter({ has: page.locator('text=/^(Play|Continue|Settings|Info)$/') })
      const count = await buttons.count()

      expect(count).toBeGreaterThan(0)

      // At mobile: buttons should stack vertically
      if (bp.name === 'mobile') {
        const firstBtn = buttons.first()
        const secondBtn = buttons.nth(1)

        const box1 = await firstBtn.boundingBox()
        const box2 = await secondBtn.boundingBox()

        if (box1 && box2) {
          // Second button should be below first (stacked)
          expect(box2.y).toBeGreaterThan(box1.y + box1.height)
          console.log(`✓ Mobile: Buttons stacked vertically`)
        }
      }

      // At tablet+: buttons should be horizontal
      if (bp.name === 'tablet' || bp.name === 'desktop' || bp.name === 'widescreen' || bp.name === 'ultrawide') {
        const firstBtn = buttons.first()
        const secondBtn = buttons.nth(1)

        const box1 = await firstBtn.boundingBox()
        const box2 = await secondBtn.boundingBox()

        if (box1 && box2) {
          // Second button should be beside first (horizontal)
          expect(box2.x).toBeGreaterThan(box1.x)
          console.log(`✓ ${bp.label}: Buttons arranged horizontally`)
        }
      }
    }
  })

  test('typography scales across breakpoints', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Check subtitle font size increases at larger breakpoints
      const subtitle = page.locator('[class*="subtitle"]').first()
      const size = await subtitle.evaluate((el) => window.getComputedStyle(el).fontSize)
      const sizeNum = parseFloat(size)

      expect(sizeNum).toBeGreaterThan(0)

      // At desktop/widescreen/ultrawide, should be noticeably larger
      if (bp.name === 'ultrawide') {
        expect(sizeNum).toBeGreaterThanOrEqual(18) // ~1.2rem+
        console.log(`✓ Ultrawide: Subtitle font size ${sizeNum.toFixed(1)}px`)
      } else if (bp.name === 'desktop' || bp.name === 'widescreen') {
        expect(sizeNum).toBeGreaterThanOrEqual(16)
      }
    }
  })

  test('no horizontal scrollbar at any breakpoint', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
      console.log(`✓ ${bp.label}: No horizontal overflow (scroll: ${scrollWidth}px <= viewport: ${clientWidth}px)`)
    }
  })

  test('content padding increases at larger viewports', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    const paddingSizes: Record<string, number> = {}

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      const root = page.locator('[class*="root"]').first()
      const padding = await root.evaluate((el) => window.getComputedStyle(el).padding)
      const paddingNum = parseFloat(padding)

      paddingSizes[bp.name] = paddingNum
      console.log(`✓ ${bp.label}: Padding ${paddingNum.toFixed(1)}px`)
    }

    // Verify padding increases progressively
    expect(paddingSizes.mobile).toBeLessThan(paddingSizes.tablet)
    expect(paddingSizes.tablet).toBeLessThanOrEqual(paddingSizes.desktop)
    expect(paddingSizes.desktop).toBeLessThanOrEqual(paddingSizes.widescreen)
    expect(paddingSizes.widescreen).toBeLessThanOrEqual(paddingSizes.ultrawide)
  })

  test('visually stable at all breakpoints', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Verify page loads without errors
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
      })

      // Wait a tick for rendering
      await page.waitForTimeout(500)

      expect(errors).toEqual([])
      console.log(`✓ ${bp.label}: Page rendered without errors`)
    }
  })
})
