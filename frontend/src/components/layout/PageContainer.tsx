import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { SPACING } from '../../theme/spacing';

interface PageContainerProps {
  children: React.ReactNode;
  /** 内容最大宽度 */
  maxWidth?: number | 'narrow' | 'medium' | 'wide';
  /** 自定义 padding */
  padding?: { mobile?: string; desktop?: string };
  /** 自定义 className */
  className?: string;
  /** 自定义 style */
  style?: React.CSSProperties;
}

/**
 * 通用页面内容容器
 * - 自动居中、限制最大宽度
 * - 移动端紧凑 padding，桌面端宽松 padding
 * - 自动应用 flex-min 防溢出
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'narrow',
  padding,
  className,
  style,
}) => {
  const { isMobile } = useResponsive();

  const resolvedMaxWidth =
    typeof maxWidth === 'number'
      ? maxWidth
      : SPACING.contentMaxWidth[maxWidth];

  const resolvedPadding = isMobile
    ? padding?.mobile ?? SPACING.pagePadding.mobile
    : padding?.desktop ?? SPACING.pagePadding.desktop;

  return (
    <div
      className={`flex-min ${className || ''}`.trim()}
      style={{
        maxWidth: resolvedMaxWidth,
        margin: '0 auto',
        padding: resolvedPadding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
