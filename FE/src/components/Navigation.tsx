import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { primaryFont } from '@/styles/font';

const Accordion = styled.button`
  background-color: transparent;
  text-align: left;
  margin: 16px 0;

  &:hover {
    color: var(--rp-orange);
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  * {
    grid-column: 2;
    width: 100%;
  }
`;

const Panel = styled(Accordion)`
  padding-left: 32px;
  ${(props) => {
    if (props.visible) {
      return css`
        display: none;
      `;
    }
  }}
`;

const Navigation = () => {
  const [workspaceToggle, setWorkspaceToggle] = useState(true);

  const handleWorkspaceClick = () => {
    setWorkspaceToggle((prev) => !prev);
  };

  return (
    <Container>
      <Accordion onClick={handleWorkspaceClick}>Workspace</Accordion>
      <Link to="/projects">
        <Panel visible={workspaceToggle}>Projects</Panel>
      </Link>
      <Accordion>
        <Link to="/sources">
          <Panel visible={workspaceToggle}>Sources</Panel>
        </Link>
      </Accordion>

      <Link to="/community">
        <Accordion>Community</Accordion>
      </Link>

      <Accordion>My page</Accordion>
    </Container>
  );
};

export default Navigation;
