import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

// eslint-disable-next-line react-refresh/only-export-components
const DialogOverlay = styled.div`
  z-index: 30000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// eslint-disable-next-line react-refresh/only-export-components
const DialogBox = styled.div`
  background-color: black;
  min-height: 520px;
  border-radius: 10px;
  width: 1000px;
  padding: 26px;

  @media (max-width: 1080px) {
    width: 600px;
  }
`;
const Title = styled.div`
  width: 100%;
  padding: 0.6rem;
  font-size: 1.8rem;
`;
interface DialogProps {
  title: string;
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: ReactNode;
}

export const Dialog = ({ open, title, children }: DialogProps) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <DialogOverlay>
      <DialogBox
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          e.stopPropagation()
        }
      >
        <Title>Source</Title>
        {children}
      </DialogBox>
    </DialogOverlay>,
    document.body
  );
};
