import { Modal, Button, Space, theme } from 'antd';

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  onDoNotShowToday: () => void;
  onNeverShow: () => void;
}

export default function AnnouncementModal({ visible, onClose, onDoNotShowToday, onNeverShow }: AnnouncementModalProps) {
  const { token } = theme.useToken();

  const handleDoNotShowToday = () => {
    onDoNotShowToday();
    onClose();
  };

  const handleNeverShow = () => {
    onNeverShow();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          color: token.colorPrimary,
          textAlign: 'center',
        }}>
          🎉 欢迎使用 AI小说创作助手
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            onClick={handleDoNotShowToday}
            size="large"
            style={{
              borderRadius: '8px',
              height: '40px',
              fontSize: '14px',
            }}
          >
            今日内不再展示
          </Button>
          <Button
            type="primary"
            onClick={handleNeverShow}
            size="large"
            style={{
              borderRadius: '8px',
              height: '40px',
              fontSize: '14px',
            }}
          >
            永不再展示
          </Button>
        </Space>
      }
      width={480}
      centered
      styles={{
        body: {
          padding: '24px',
          background: token.colorBgContainer,
        },
        header: {
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: '16px 24px',
        },
        footer: {
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: '16px 24px',
        },
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '15px',
          color: token.colorTextSecondary,
          lineHeight: '1.8',
        }}>
          <p style={{ fontSize: '20px', marginBottom: '12px' }}>✨ 欢迎回来！</p>
          <p>愿灵感常伴，笔下生花。</p>
          <p>开始你今天的创作之旅吧 📖</p>
        </div>
      </div>
    </Modal>
  );
}
