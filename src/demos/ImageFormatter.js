import { css } from '@linaria/core';

const wrapperClassname = css`
  display: flex;width: 100%;
  justify-content: space-around;
`;

const imageCellClassname = css`
  background: #efefef;
  background-size: 100%;
  display: inline-block;
  block-size: 28px;
  inline-size: 28px;
  vertical-align: middle;
  background-position: center;
`;


 function ImageFormatter({ value }) {
  return (
    <div className={wrapperClassname}>
      <div className={imageCellClassname} style={{ backgroundImage: `url(${value})` }} />
    </div>
  );
}

export default ImageFormatter;
