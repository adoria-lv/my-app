import React from 'react'
import ReadMore from '@/app/components/ui/ReadMore'
import ServiceReadMore from '@/app/components/ui/ServiceReadMore'

/**
 * ReadMore Content Parser
 *
 * This parser allows users to insert ReadMore components anywhere in their content
 * using a simple marker syntax in the QuillEditor.
 *
 * Usage:
 * 1. In the QuillEditor, click the "Lasīt vairāk" button in the toolbar
 * 2. This inserts a [READMORE] marker at the cursor position
 * 3. All content AFTER this marker will be collapsible
 *
 * Marker syntax:
 * - Basic: [READMORE]
 * - With custom height: [READMORE maxHeight="300"]
 * - With custom button text: [READMORE buttonText="Skatīt vairāk"]
 * - With custom collapse text: [READMORE collapseText="Paslēpt"]
 * - All options: [READMORE maxHeight="300" buttonText="Skatīt vairāk" collapseText="Paslēpt"]
 *
 * Example content:
 * "This is visible content. [READMORE maxHeight="200"] This content will be collapsible."
 */
const READMORE_REGEX = /<p[^>]*>\s*\[READMORE(?:\s+maxHeight="(\d+)")?(?:\s+buttonText="([^"]*)")?(?:\s+collapseText="([^"]*)")?\]\s*<\/p>|\[READMORE(?:\s+maxHeight="(\d+)")?(?:\s+buttonText="([^"]*)")?(?:\s+collapseText="([^"]*)")?\]/g

interface ReadMoreConfig {
  maxHeight?: number
  buttonText?: string
  collapseText?: string
}

export function parseContentWithReadMore(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let keyCounter = 0

  // Reset regex state
  READMORE_REGEX.lastIndex = 0
  const match = READMORE_REGEX.exec(content)

  if (!match) {
    // No ReadMore marker found, return the original content
    parts.push(
      <div
        key="full-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
    return parts
  }

  const [fullMatch, maxHeight, buttonText, collapseText] = match
  const matchStart = match.index
  const matchEnd = matchStart + fullMatch.length

  // Content before the ReadMore marker (always visible)
  const beforeContent = content.slice(0, matchStart)

  // Content after the ReadMore marker (collapsible)
  const afterContent = content.slice(matchEnd)

  // Add visible content before ReadMore marker
  if (beforeContent.trim()) {
    parts.push(
      <div
        key={`visible-content-${keyCounter++}`}
        dangerouslySetInnerHTML={{ __html: beforeContent }}
      />
    )
  }

  // Add collapsible content after ReadMore marker
  if (afterContent.trim()) {
    const config: ReadMoreConfig = {
      maxHeight: maxHeight ? parseInt(maxHeight) : 200,
      buttonText: buttonText || 'Lasīt vairāk',
      collapseText: collapseText || 'Lasīt mazāk'
    }

    parts.push(
      <ReadMore
        key={`readmore-${keyCounter++}`}
        maxHeight={config.maxHeight}
        buttonText={config.buttonText}
        collapseText={config.collapseText}
      >
        <div
          dangerouslySetInnerHTML={{ __html: afterContent }}
        />
      </ReadMore>
    )
  }

  return parts
}

// Helper function to insert ReadMore marker at cursor position in editor
export function createReadMoreMarker(config?: Partial<ReadMoreConfig>): string {
  const maxHeight = config?.maxHeight ? ` maxHeight="${config.maxHeight}"` : ''
  const buttonText = config?.buttonText ? ` buttonText="${config.buttonText}"` : ''
  const collapseText = config?.collapseText ? ` collapseText="${config.collapseText}"` : ''

  return `[READMORE${maxHeight}${buttonText}${collapseText}]`
}

// Service-specific parser with stronger content hiding
export function parseServiceContentWithReadMore(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let keyCounter = 0

  console.log('Content received:', content.substring(0, 200), '...')

  // Simple search for ReadMore marker - check both in <p> tags and standalone
  const readMoreInP = /<p[^>]*>\s*\[READMORE[^\]]*\]\s*<\/p>/i
  const readMoreStandalone = /\[READMORE[^\]]*\]/i

  let matchResult = content.match(readMoreInP) || content.match(readMoreStandalone)

  console.log('Match result:', matchResult)

  if (!matchResult) {
    // No ReadMore marker found, return the original content
    parts.push(
      <div
        key="full-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
    return parts
  }

  const fullMatch = matchResult[0]
  const matchStart = matchResult.index || 0
  const matchEnd = matchStart + fullMatch.length

  // Content before the ReadMore marker (always visible)
  const beforeContent = content.slice(0, matchStart)

  // Content after the ReadMore marker (collapsible)
  const afterContent = content.slice(matchEnd)

  // Add visible content before ReadMore marker
  if (beforeContent.trim()) {
    parts.push(
      <div
        key={`visible-content-${keyCounter++}`}
        dangerouslySetInnerHTML={{ __html: beforeContent }}
      />
    )
  }

  // Add collapsible content after ReadMore marker using ServiceReadMore
  if (afterContent.trim()) {
    console.log('Adding ServiceReadMore with afterContent:', afterContent.substring(0, 100))
    parts.push(
      <ServiceReadMore
        key={`service-readmore-${keyCounter++}`}
        maxHeight={80}
        buttonText="Lasīt vairāk"
        collapseText="Lasīt mazāk"
      >
        <div
          dangerouslySetInnerHTML={{ __html: afterContent }}
        />
      </ServiceReadMore>
    )
  }

  return parts
}