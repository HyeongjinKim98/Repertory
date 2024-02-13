import { useState } from 'react';
import styled from 'styled-components';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Dance from '@/components/dance/Dance';
import { Secondary as Text } from '@/components/common/Text';
import DanceHover from '@/components/dance/DanceHover';
import { Menu } from '@/components/common/MenuButton';

const ListItem = styled.li`
  position: relative;
  cursor: pointer;
`;

const menus = [
  new Menu('이름 수정', <EditIcon fontSize="small" />, () => {}),
  new Menu('삭제', <DeleteIcon fontSize="small" className="red" />, () => {}),
];

const Project = ({ project }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <ListItem onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {isHovering && <DanceHover menus={menus} />}
      <Dance thumbnail={project.imageUrl} title={project.title}>
        <Text>{project.detail}</Text>
      </Dance>
    </ListItem>
  );
};

export default Project;
