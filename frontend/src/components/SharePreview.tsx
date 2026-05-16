import React, { useState, useRef, useCallback } from 'react';
import { Button, Slider, InputNumber, message, Drawer, Modal, Input, Space, Card, Tag, ColorPicker, Segmented, Select, Tooltip, Divider, theme } from 'antd';
import {
  SaveOutlined,
  CopyOutlined,
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  ColumnWidthOutlined,
  FontSizeOutlined,
  BgColorsOutlined,
  UndoOutlined,
  ScissorOutlined,
} from '@ant-design/icons';

interface ChapterData {
  id: string;
  chapter_number: number;
  title: string;
  content: string;
  word_count: number;
}

interface SharePreviewProps {
  chapter: ChapterData;
}

interface ShareThemeConfig {
  id: string;
  name: string;
  emoji: string;
  headerBg: string;
  headerText: string;
  cardBg: string;
  textColor: string;
  footerBg: string;
  footerText: string;
  cardWidth: number;
  fontSize: number;
  titleSize: number;
  lineHeight: number;
  padding: number;
}

const STORAGE_KEY = 'share_presets';
const DEFAULT_MAX_CHARS = 1200;

const DEFAULT_THEMES: ShareThemeConfig[] = [
  {
    id: 'xhs', name: '小红书', emoji: '📕',
    headerBg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    headerText: '#ffffff', cardBg: '#fffaf8', textColor: '#2c2c2c',
    footerBg: '#fff0ed', footerText: '#999',
    cardWidth: 350, fontSize: 15, titleSize: 20, lineHeight: 1.85, padding: 20,
  },
  {
    id: 'ink', name: '水墨', emoji: '🖋️',
    headerBg: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)',
    headerText: '#f0ebe3', cardBg: '#faf8f5', textColor: '#2c2c2c',
    footerBg: '#f0ebe3', footerText: '#5c5c5c',
    cardWidth: 390, fontSize: 16, titleSize: 22, lineHeight: 1.9, padding: 24,
  },
  {
    id: 'night', name: '暗夜', emoji: '🌙',
    headerBg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    headerText: '#e8e6f0', cardBg: '#1a1a2e', textColor: '#d4d4e8',
    footerBg: '#16162a', footerText: '#9a9ab0',
    cardWidth: 390, fontSize: 16, titleSize: 22, lineHeight: 1.9, padding: 24,
  },
  {
    id: 'sakura', name: '樱花', emoji: '🌸',
    headerBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    headerText: '#ffffff', cardBg: '#fff9fb', textColor: '#3d2a3a',
    footerBg: '#fef0f3', footerText: '#8a5a6a',
    cardWidth: 390, fontSize: 16, titleSize: 22, lineHeight: 1.9, padding: 24,
  },
  {
    id: 'ocean', name: '深海', emoji: '🌊',
    headerBg: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    headerText: '#ffffff', cardBg: '#f7fbfc', textColor: '#1a2a3a',
    footerBg: '#eef6f8', footerText: '#4a6a7a',
    cardWidth: 390, fontSize: 16, titleSize: 22, lineHeight: 1.9, padding: 24,
  },
  {
    id: 'forest', name: '森林', emoji: '🌿',
    headerBg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    headerText: '#ffffff', cardBg: '#f5faf6', textColor: '#2a3a2c',
    footerBg: '#eaf5ec', footerText: '#4a6a4c',
    cardWidth: 390, fontSize: 16, titleSize: 22, lineHeight: 1.9, padding: 24,
  },
];

function loadPresets(): ShareThemeConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_THEMES;
}

function savePresetsToStorage(presets: ShareThemeConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

const SharePreview: React.FC<SharePreviewProps> = ({ chapter }) => {
  const { token } = theme.useToken();
  const [presets, setPresets] = useState<ShareThemeConfig[]>(loadPresets);
  const [activeId, setActiveId] = useState(presets[0]?.id || 'xhs');
  const [config, setConfig] = useState<ShareThemeConfig>(presets[0] || DEFAULT_THEMES[0]);
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newPresetModalOpen, setNewPresetModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [maxChars, setMaxChars] = useState(DEFAULT_MAX_CHARS);
  const [enableTruncate, setEnableTruncate] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyPreset = (preset: ShareThemeConfig) => {
    setActiveId(preset.id);
    setConfig({ ...preset });
  };

  const resetToPreset = useCallback(() => {
    const current = presets.find(p => p.id === activeId);
    if (current) {
      setConfig({ ...current });
      message.success('已重置为预设默认值');
    }
  }, [presets, activeId]);

  const saveCurrentAsPreset = () => {
    const updated = presets.map(p =>
      p.id === activeId ? { ...config, id: activeId, name: config.name || activeId } : p
    );
    setPresets(updated);
    savePresetsToStorage(updated);
    message.success('预设已保存');
  };

  const saveAsNewPreset = () => {
    setNewPresetName('');
    setNewPresetModalOpen(true);
  };

  const confirmSaveNewPreset = () => {
    const name = newPresetName.trim();
    if (!name) {
      message.warning('请输入预设名称');
      return;
    }
    const id = 'custom_' + Date.now();
    const newPreset = { ...config, id, name, emoji: '⭐' };
    const updated = [...presets, newPreset];
    setPresets(updated);
    savePresetsToStorage(updated);
    setActiveId(id);
    setNewPresetModalOpen(false);
    message.success(`预设"${name}"已创建`);
  };

  const deletePreset = (id: string) => {
    if (DEFAULT_THEMES.find(t => t.id === id)) {
      message.warning('内置预设不能删除');
      return;
    }
    Modal.confirm({
      title: '删除预设',
      content: `确定删除预设"${presets.find(p => p.id === id)?.name}"吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const updated = presets.filter(p => p.id !== id);
        setPresets(updated);
        savePresetsToStorage(updated);
        if (activeId === id && updated.length > 0) {
          applyPreset(updated[0]);
        }
        message.success('已删除');
      },
    });
  };

  // 长按删除支持（移动端）
  const handlePresetTouchStart = (id: string) => {
    longPressTimer.current = setTimeout(() => {
      deletePreset(id);
    }, 600);
  };

  const handlePresetTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${chapter.title || '分享'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      message.success('图片已保存');
    } catch {
      message.error('保存失败，请手动截图');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyText = () => {
    const text = `📖 第${chapter.chapter_number}章 · ${chapter.title}\n\n${chapter.content}`;
    navigator.clipboard.writeText(text).then(() => {
      message.success('文案已复制');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const updateConfig = (partial: Partial<ShareThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  // 截断后的正文内容
  const displayContent = enableTruncate && chapter.content.length > maxChars
    ? chapter.content.slice(0, maxChars) + '\n\n…… 全文共 ' + chapter.word_count + ' 字'
    : chapter.content;

  /* 设置面板（内联渲染，避免组件重建导致 Slider 失焦） */
  const settingsPanel = (
    <div style={{ padding: 16 }}>
      {/* 尺寸 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <ColumnWidthOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>卡片宽度</span>
        </div>
        {/* 快捷预设 */}
        <Segmented
          block
          size="small"
          options={[
            { label: '手机', value: 390 },
            { label: '平板', value: 768 },
            { label: '桌面', value: 1024 },
          ]}
          value={[390, 768, 1024].includes(config.cardWidth) ? config.cardWidth : undefined}
          onChange={v => updateConfig({ cardWidth: v as number })}
          style={{ marginBottom: 10 }}
        />
        {/* 手机型号下拉 */}
        <Select
          size="small"
          placeholder="选择设备型号"
          value={config.cardWidth}
          onChange={v => updateConfig({ cardWidth: v })}
          style={{ width: '100%', marginBottom: 10 }}
          options={[
            { label: '📱 iPhone SE / 5', value: 320 },
            { label: '📱 iPhone 6/7/8', value: 375 },
            { label: '📱 iPhone 12/13/14', value: 390 },
            { label: '📱 iPhone 14 Pro Max', value: 430 },
            { label: '📱 Samsung Galaxy S24', value: 360 },
            { label: '📱 Pixel 7', value: 412 },
            { label: '📱 小红书卡片', value: 350 },
            { label: '📱 微信朋友圈', value: 375 },
            { label: '📲 iPad Mini', value: 744 },
            { label: '📲 iPad Air/Pro', value: 820 },
            { label: '🖥️ 小平板横屏', value: 1024 },
          ]}
        />
        {/* 自定义宽度 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: token.colorTextSecondary, flexShrink: 0 }}>自定义</span>
          <Slider
            min={280} max={1024} value={config.cardWidth}
            onChange={v => updateConfig({ cardWidth: v })}
            style={{ flex: 1, margin: 0 }}
          />
          <InputNumber
            min={280} max={1024} size="small" value={config.cardWidth}
            onChange={v => updateConfig({ cardWidth: v || 390 })}
            style={{ width: 64 }}
            suffix="px"
          />
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* 排版 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <FontSizeOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>排版</span>
        </div>
        {([
          { label: '正文字号', key: 'fontSize' as const, min: 12, max: 24, step: 1, suffix: 'px' },
          { label: '标题字号', key: 'titleSize' as const, min: 16, max: 32, step: 1, suffix: 'px' },
          { label: '行高', key: 'lineHeight' as const, min: 1.4, max: 2.6, step: 0.1, suffix: '' },
          { label: '内边距', key: 'padding' as const, min: 12, max: 60, step: 1, suffix: 'px' },
        ]).map(({ label, key, min, max, step, suffix }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{label}</span>
              <span style={{ fontSize: 12, color: token.colorPrimary, fontWeight: 600 }}>
                {config[key]}{suffix}
              </span>
            </div>
            <Slider
              min={min} max={max} step={step}
              value={config[key] as number}
              onChange={v => updateConfig({ [key]: v })}
              style={{ margin: 0 }}
            />
          </div>
        ))}
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* 内容截断 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <ScissorOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>内容截断</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={enableTruncate}
            onChange={e => setEnableTruncate(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
            限制最大字数（超长章节自动截断）
          </span>
        </div>
        {enableTruncate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Slider
              min={400} max={3000} step={100} value={maxChars}
              onChange={v => setMaxChars(v)}
              style={{ flex: 1, margin: 0 }}
            />
            <InputNumber
              min={400} max={3000} step={100} size="small" value={maxChars}
              onChange={v => setMaxChars(v || DEFAULT_MAX_CHARS)}
              style={{ width: 72 }}
              suffix="字"
            />
          </div>
        )}
        {enableTruncate && chapter.content.length > maxChars && (
          <div style={{ fontSize: 11, color: token.colorWarning, marginTop: 4 }}>
            原文 {chapter.word_count} 字，将截断为 {maxChars} 字
          </div>
        )}
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* 颜色 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <BgColorsOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>颜色</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
          {([
            { label: '正文底色', key: 'cardBg' as const },
            { label: '正文字色', key: 'textColor' as const },
            { label: '标题字色', key: 'headerText' as const },
            { label: '尾栏底色', key: 'footerBg' as const },
            { label: '尾栏字色', key: 'footerText' as const },
          ]).map(({ label, key }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorPicker
                size="small"
                value={config[key]}
                onChange={(_, hex) => updateConfig({ [key]: hex })}
              />
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 12, color: token.colorTextSecondary, display: 'block', marginBottom: 4 }}>
            标题背景（支持 linear-gradient）
          </span>
          <Input
            size="small"
            value={config.headerBg}
            onChange={e => updateConfig({ headerBg: e.target.value })}
            placeholder="颜色值或 linear-gradient(...)"
          />
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* 保存预设 */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button icon={<UndoOutlined />} block onClick={resetToPreset}>
          重置为预设默认
        </Button>
        <Button icon={<SaveOutlined />} block onClick={saveCurrentAsPreset}>
          保存到当前预设
        </Button>
        <Button icon={<PlusOutlined />} block type="dashed" onClick={saveAsNewPreset}>
          另存为新预设
        </Button>
      </Space>
    </div>
  );

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: token.colorBgLayout,
    }}>
      {/* 顶部栏 */}
      <Card
        size="small"
        style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0, flexShrink: 0 }}
        styles={{ body: { padding: '10px 16px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <span style={{ fontSize: 16 }}>📐</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              第{chapter.chapter_number}章 · {chapter.title}
            </span>
            <Tag color="blue">{chapter.word_count} 字</Tag>
          </Space>
          <Space className="desktop-actions">
            <Button icon={<CopyOutlined />} onClick={handleCopyText}>
              复制文案
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveImage} loading={saving}>
              保存长图
            </Button>
          </Space>
          <Button
            className="mobile-settings-btn"
            icon={<SettingOutlined />}
            onClick={() => setSettingsOpen(true)}
            type="text"
          />
        </div>
      </Card>

      {/* 预设选择栏 */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        overflowX: 'auto',
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        maskImage: 'linear-gradient(to right, transparent 0px, black 16px, black calc(100% - 16px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 16px, black calc(100% - 16px), transparent 100%)',
      }}>
        {presets.map((t) => (
          <Tag
            key={t.id}
            color={activeId === t.id ? 'blue' : undefined}
            style={{
              cursor: 'pointer',
              padding: '4px 12px',
              fontSize: 13,
              borderRadius: 16,
              userSelect: 'none',
            }}
            onClick={() => applyPreset(t)}
            onTouchStart={() => handlePresetTouchStart(t.id)}
            onTouchEnd={handlePresetTouchEnd}
            onTouchCancel={handlePresetTouchEnd}
          >
            {t.emoji} {t.name}
          </Tag>
        ))}
        <Tag
          style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: 16, borderStyle: 'dashed' }}
          onClick={saveAsNewPreset}
        >
          <PlusOutlined /> 新增
        </Tag>
        {!DEFAULT_THEMES.find(t => t.id === activeId) && (
          <Tooltip title="删除当前预设">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deletePreset(activeId)}
            />
          </Tooltip>
        )}
      </div>

      {/* 主体 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 画布区域 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          padding: '24px 16px 100px',
          background: token.colorBgLayout,
        }}>
          {/* 尺寸信息 */}
          <div style={{
            marginBottom: 12,
            fontSize: 12,
            color: token.colorTextTertiary,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>宽 {config.cardWidth}px</span>
            <span>·</span>
            <span>字号 {config.fontSize}px</span>
            <span>·</span>
            <span>行高 {config.lineHeight}</span>
          </div>

          {/* 卡片预览 - 外层加 padding 防止阴影被裁切 */}
          <div style={{ padding: 24 }}>
            <div
              ref={cardRef}
              style={{
                width: config.cardWidth,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                background: config.cardBg,
              }}
            >
              {/* 标题区 */}
              <div style={{
                background: config.headerBg,
                padding: `${Math.round(config.padding * 1.5)}px ${config.padding}px ${config.padding}px`,
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  color: config.headerText, fontSize: 11, marginBottom: 10,
                }}>
                  第 {chapter.chapter_number} 章
                </div>
                <div style={{
                  fontSize: config.titleSize, fontWeight: 800,
                  color: config.headerText, lineHeight: 1.35,
                }}>
                  {chapter.title}
                </div>
              </div>

              {/* 正文区 */}
              <div style={{
                background: config.cardBg,
                padding: `${config.padding}px ${config.padding}px ${config.padding + 8}px`,
              }}>
                <div style={{
                  fontSize: config.fontSize,
                  lineHeight: config.lineHeight,
                  color: config.textColor,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  letterSpacing: 0.3,
                }}>
                  {displayContent}
                </div>
              </div>

              {/* 底栏 */}
              <div style={{
                background: config.footerBg,
                padding: `12px ${config.padding}px 16px`,
                borderTop: '1px solid rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: config.footerText, opacity: 0.85 }}>
                    — 继续阅读 —
                  </div>
                  <div style={{ fontSize: 11, color: config.footerText, opacity: 0.7 }}>
                    墨笔AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 桌面端右侧设置栏 */}
        <div className="settings-sidebar" style={{
          width: 280,
          flexShrink: 0,
          background: token.colorBgContainer,
          borderLeft: `1px solid ${token.colorBorderSecondary}`,
          overflowY: 'auto',
        }}>
          {settingsPanel}
        </div>
      </div>

      {/* 移动端底部操作栏 */}
      <div className="mobile-bottom-bar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        background: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
      }}>
        <Button icon={<CopyOutlined />} onClick={handleCopyText}>复制</Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveImage} loading={saving}>
          保存长图
        </Button>
      </div>

      {/* 移动端设置抽屉 */}
      <Drawer
        title="样式设置"
        placement="bottom"
        height="70vh"
        onClose={() => setSettingsOpen(false)}
        open={settingsOpen}
      >
        {settingsPanel}
      </Drawer>

      {/* 新增预设弹窗 */}
      <Modal
        title="新增预设"
        open={newPresetModalOpen}
        onOk={confirmSaveNewPreset}
        onCancel={() => setNewPresetModalOpen(false)}
        okText="创建"
        cancelText="取消"
        width={360}
      >
        <div style={{ padding: '12px 0' }}>
          <Input
            placeholder="输入预设名称"
            value={newPresetName}
            onChange={e => setNewPresetName(e.target.value)}
            onPressEnter={confirmSaveNewPreset}
            autoFocus
            maxLength={20}
            showCount
          />
        </div>
      </Modal>

      <style>{`
        @media (min-width: 1024px) {
          .settings-sidebar { display: block !important; }
          .mobile-bottom-bar { display: none !important; }
          .mobile-settings-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          .settings-sidebar { display: none !important; }
          .desktop-actions { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SharePreview;
