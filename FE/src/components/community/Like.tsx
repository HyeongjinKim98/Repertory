import { useState } from 'react';
import styled from 'styled-components';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 16px;
`;

interface Props {
  likeCount: number;
  liked: boolean;
  // TODO: feedId 추가
  disable?: boolean;
}

const Like = ({ likeCount, liked, disable }: Props) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [count, setCount] = useState(likeCount);

  const handleClick = () => {
    if (disable) {
      return
    }
    if (isLiked) {
      // TODO: 좋아요 취소 api 보내기
      setCount((prevCount) => prevCount - 1);
    } else {
      // TODO: 좋아요 api 보내기
      setCount((prevCount) => prevCount + 1);
    }
    setIsLiked((prev) => !prev);
  };

  return (
    <Button as={disable ? 'div' : 'button'} onClick={handleClick}>
      {isLiked && <FavoriteIcon className='red' />}
      {!isLiked && <FavoriteBorderIcon />}
      <div>{count}</div>
    </Button>
  );
};

export default Like;
