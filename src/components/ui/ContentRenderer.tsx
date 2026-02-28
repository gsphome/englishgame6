/**
 * Content Renderer - Renders structured content as React components
 * Replaces dangerouslySetInnerHTML with safe, semantic rendering
 */

import React from 'react';
import type { StructuredContent, ContentSegment } from '../../types/content';
import '../../styles/components/content-renderer.css';

interface ContentRendererProps {
  content: StructuredContent;
  className?: string;
}

interface ContentSegmentProps {
  segment: ContentSegment;
  format?: StructuredContent['format'];
}

const ContentSegmentComponent: React.FC<ContentSegmentProps> = ({ segment, format }) => {
  const { type, content, metadata } = segment;

  switch (type) {
    case 'term':
      return (
        <span
          className={`content-renderer__segment content-renderer__segment--term ${format ? `content-renderer__segment--${format}` : ''}`}
          title={metadata?.definition}
        >
          {content}
        </span>
      );

    case 'emphasis':
      return (
        <strong
          className={`content-renderer__segment content-renderer__segment--emphasis ${format ? `content-renderer__segment--${format}` : ''}`}
        >
          {content}
        </strong>
      );

    case 'code':
      return (
        <code
          className={`content-renderer__segment content-renderer__segment--code ${format ? `content-renderer__segment--${format}` : ''}`}
        >
          {content}
        </code>
      );

    case 'variable':
      return (
        <span
          className={`content-renderer__segment content-renderer__segment--variable ${format ? `content-renderer__segment--${format}` : ''}`}
        >
          {content}
        </span>
      );

    case 'link':
      return (
        <span
          className={`content-renderer__segment content-renderer__segment--link ${format ? `content-renderer__segment--${format}` : ''}`}
        >
          {content}
        </span>
      );

    case 'text':
    default:
      return (
        <span className="content-renderer__segment content-renderer__segment--text">{content}</span>
      );
  }
};

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content, className = '' }) => {
  if (!content || !content.segments || content.segments.length === 0) {
    return <span className={`content-renderer ${className}`}>Loading...</span>;
  }

  return (
    <span
      className={`content-renderer ${className} ${content.format ? `content-renderer--${content.format}` : ''}`}
    >
      {content.segments.map((segment, index) => (
        <ContentSegmentComponent key={index} segment={segment} format={content.format} />
      ))}
    </span>
  );
};

export default ContentRenderer;
