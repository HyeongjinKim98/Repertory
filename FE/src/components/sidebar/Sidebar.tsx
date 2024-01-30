import styled from 'styled-components';
import { Link } from 'react-router-dom';

import ProfileImage from '@/components/common/Image';
import Navigation from '@/components/sidebar/Navigation';

const Aside = styled.aside`
  position: fixed;
  margin: var(--sidebar-margin);
  border-radius: 10px;
  min-height: calc(100vh - var(--sidebar-margin) * 2);
  background-color: var(--sidebar-background-dark-mode);
  width: var(--sidebar);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logout = styled.button`
  color: var(--rp-grey-500);
  background-color: transparent;
  border: 0;

  &:hover {
    color: var(--rp-yellow);
  }
`;

const SideBar = () => {
  return (
    <Aside>
      <Link to="/" style={{ margin: '48px' }}>
        <img src="/images/logo.svg" alt="logo" style={{ height: '52px' }} />
      </Link>
      <ProfileImage size={160} isRound={true} src="/images/index.jpg" />
      <div style={{ margin: '16px' }}>loginUserName</div>
      <Logout>Log Out</Logout>
      <Navigation />
    </Aside>
  );
};

export default SideBar;
