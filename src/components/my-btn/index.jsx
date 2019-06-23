import React from 'react';

import './index.less';

export default function MyBtn(props) {
  // props.children的属性时标签中的文本节点内容
  return <button className="my-btn" {...props}/>
}