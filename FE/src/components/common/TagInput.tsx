import { useState, KeyboardEvent, ChangeEvent, FC } from 'react';
import styled from 'styled-components';

const TagsInputWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  height: px;
`;

const TagItem = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 26px;
  padding: 3px 13px;
  font-size: 13px;
  color: #9ba3a9;
  background-color: #e5f8f0;
  border: none;
  border-radius: 4px;
`;

const Button = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 15px;
  height: 15px;
  background-color: inherit;
  border: none;
`;

const TagInput = styled.input`
  cursor: text;
  box-sizing: border-box;
  display: flex;
  width: 300px;
  font-size: 16px;
  background-color: inherit;
  border: none;
  outline: none;

  &::placeholder {
    color: #acb5bd;
  }
`;

interface TagsInputProps {
  onTagListChange: (tagList: string[]) => void;
}

const TagsInput: FC<TagsInputProps> = ({ onTagListChange }) => {
  const [tagItem, setTagItem] = useState<string>('');
  const [tagList, setTagList] = useState<string[]>([]);

  // console.log(tagList);

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (tagList.length >= 10) {
      onError('태그는 최대 10개까지 지정할 수 있습니다.');
    }
    if (event.currentTarget.value.length !== 0 && event.key === 'Enter') {
      if (isTagDuplicated(event.currentTarget.value)) {
        onError('중복된 태그입니다');
      } else {
        setTagList([...tagList, tagItem]);
        setTagItem('');
        onTagListChange([...tagList, tagItem]);
      }
    }
  };

  const onError = (msg: string) => {
    alert(msg);
    setTagItem('');
  };

  const isTagDuplicated = (tag: string) => {
    return tagList.includes(tag);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length == 0 && event.key === 'Backspace') {
      deleteLastItem();
    }
  };

  const deleteLastItem = () => {
    const lastTagItem = tagList[tagList.length - 1];
    const filteredTagList = tagList.filter(
      (tagItem) => tagItem !== lastTagItem
    );
    setTagList(filteredTagList);
    onTagListChange([...tagList, tagItem]);
  };

  const deleteTagItem = (event: any) => {
    const deleteTagItem = event.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter(
      (tagItem) => tagItem !== deleteTagItem
    );
    setTagList(filteredTagList);
    onTagListChange([...tagList, tagItem]);
  };

  return (
    <TagsInputWrapper>
      {tagList.map((tagItem, index) => {
        return (
          <TagItem key={index}>
            <span>{tagItem}</span>
            <Button onClick={deleteTagItem}>X</Button>
          </TagItem>
        );
      })}

      <TagInput
        type='text'
        placeholder='태그를 설정하세요 (최대 10개)'
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setTagItem(event.target.value)
        }
        value={tagItem}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
      ></TagInput>
    </TagsInputWrapper>
  );
};
export default TagsInput;
